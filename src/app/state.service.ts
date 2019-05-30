import { Injectable, NgZone } from '@angular/core';
import { Actor, ActorHandle, lookup, hookup } from 'actor-helpers/lib/actor/Actor';
import StateActor from 'reciprocity-tracker-state-actor/lib/StateActor';
import {
  ADD_AGENT,
  SELECT_AGENT,
  SELECT_DATE,
  UNSELECT_DATE,
  ADD_EXCHANGE,
  CANCEL_EXCHANGE,
  ADD_FLOW,
  STATE,
} from 'reciprocity-tracker-state-actor/lib/actionTypes';
import { Agent, Exchange, Flow } from 'reciprocity-tracker-state-actor/lib/interfaces';

import {Observable, BehaviorSubject} from 'rxjs';


declare global {
  interface ActorMessageType {
    ui: StateMessage;
  }
}

interface StateMessage {
  type: 'STATE';
  state: object;
}

const actionsFactory = (store: ActorHandle<'state'>) => ({
  addAgent: (agent: Agent) => {
      return store.send({
        type: ADD_AGENT,
        payload: agent
      });
  },
  selectAgent: (agent: Agent) => {
      return store.send({
        type: SELECT_AGENT,
        payload: agent
      });
  },
  selectDate: (date: string) => {
      return store.send({
        type: SELECT_DATE,
        payload: date
      });
  },
  unselectDate: () => {
      return store.send({
          type: UNSELECT_DATE
      });
  },
  addFlow: (flow: Flow) => {
      return store.send({
          type: ADD_FLOW,
          payload: flow
      });
  },
  addExchange: (exchangeRate: Exchange) => {
      return store.send({
          type: ADD_EXCHANGE,
          payload: exchangeRate
      });
  },
  cancelExchange: () => {
      return store.send({
          type: CANCEL_EXCHANGE,
      });
  },
  state: () => {
      return store.send({
          type: STATE,
      });
  }
});

class UiActor extends Actor<StateMessage> {

  private stateSubject$: BehaviorSubject<object>
  private zone: NgZone;
  constructor (stateSubject$, zone) {
    super()
    this.stateSubject$ = stateSubject$
    this.zone = zone;
  }
  async onMessage(stateMessage: StateMessage) {
    this.zone.run(() => this.stateSubject$.next(stateMessage.state));
  }
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private uiActor: UiActor;
  private stateActorHandle: ActorHandle<'state'>;

  // hide state subject, to not allow next() elsewhere
  private stateSubject$: BehaviorSubject<object> = new BehaviorSubject({});
  public state$: Observable<object> = this.stateSubject$.asObservable();
  public actions: any

  constructor(private zone: NgZone) {
    this.uiActor = new UiActor(this.stateSubject$, zone);
    hookup('ui', this.uiActor);

    // todo: move bootstraping someware else
    const stateActor = new StateActor();
    hookup('state', stateActor);

    this.stateActorHandle = lookup('state');
    this.actions = actionsFactory(this.stateActorHandle);
  }
}

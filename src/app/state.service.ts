import { Injectable } from '@angular/core';
import { Actor, ActorHandle, lookup, hookup } from 'actor-helpers/lib/actor/Actor';
import StateActor from 'reciprocity-tracker-agent-actor/src/StateActor';
import {
  ADD_AGENT,
  SELECT_AGENT,
  SELECT_DATE,
  UNSELECT_DATE,
  ADD_EXCHANGE,
  CANCEL_EXCHANGE,
  ADD_FLOW,
  STATE,
} from 'reciprocity-tracker-agent-actor/src/actionTypes';
import { Agent, Exchange, Flow } from 'reciprocity-tracker-agent-actor/src/interfaces';

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
  private stateActorHandle: ActorHandle<'state'>;
  private state: object;
  private actions: object;
  callback: (state: object) => void;

  constructor() {
    super();
    this.stateActorHandle = lookup('state');
    this.actions = actionsFactory(this.stateActorHandle);
  }

  async onMessage(stateMessage: StateMessage) {
    console.log(stateMessage);
    if (this.callback) {
      this.callback(stateMessage.state);
    }
  }

  subscribe(callback: (state: object) => void) {
    this.callback = callback;
  }
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private uiActor: UiActor;

  // hide state subject, no not allow next() elseware
  private stateSubject$: BehaviorSubject<object> = new BehaviorSubject({});
  public state$: Observable<object> = this.stateSubject$.asObservable();

  constructor() {
    // todo: move bootstraping someware else
    const stateActor = new StateActor();
    hookup('state', stateActor);

    this.uiActor = new UiActor();
    hookup('ui', this.uiActor);

    this.uiActor.subscribe((state: object) => {
      this.stateSubject$.next(state);
    });
  }
}

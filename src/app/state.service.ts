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
  private connectedComponentsCallbacks = [];

  constructor() {
    super();
    this.stateActorHandle = lookup('state');
    this.actions = actionsFactory(this.stateActorHandle);
  }

  async onMessage(stateMessage: StateMessage) {
    this.state = stateMessage.state;

    for (const callback of this.connectedComponentsCallbacks) {
      callback(this.state);
    }
  }

  subscribe(componentCallback) {
    this.connectedComponentsCallbacks.push(componentCallback);
  }
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  static init() {
    // TODO: replace with injection tokens
    return () => new Promise(resolve => {
      const stateActor = new StateActor();
      hookup('state', stateActor);

      const uiActor = new UiActor();
      hookup('ui', uiActor);

      resolve();
    });
  }
}

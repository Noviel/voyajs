import { createExposable, Exposable } from './Exposable';
import { PendingObservers } from './PendingObservers';
import { workerEmitEvent } from './Retranslator';

export interface Event<T> {
  event: string;
  data: T;
}

export interface Communicator {
  // addRetranslator(retranslator: Retranslator): void;

  expose<T>(event: string, initialValue: T, unique?: boolean): Exposable<T>;
  on<T extends Event<T['data']>>(event: T['event'], observer: (data: T['data']) => void): void;
  // onEvent<T>(event: Event<T>, observer: (data: T) => void): void;
}

/* Communication inside one JavaScript Realm */
export class InterCommunicator implements Communicator {
  protected exposed: Record<string, Exposable<unknown>> = {};
  protected pendingObservers = new PendingObservers();

  public expose<T>(event: string, initialValue: T, unique = true): Exposable<T> {
    if (unique && this.exposed[event]) {
      throw new Error(`Event '${event}' is already exposed by communicator.`);
    }

    if (!this.exposed[event]) {
      const exposable = createExposable(initialValue);
      this.exposed[event] = exposable as any;
    } else {
      this.exposed[event].subject.next(initialValue);
    }

    this.pendingObservers.onExpose(event, this.exposed[event]);

    return (this.exposed[event] as any) as Exposable<T>;
  }

  public on<T extends Event<T['data']>>(event: T['event'], observer: (data: T['data']) => void) {
    const target = this.exposed[event] as Exposable<T>;

    if (!target) {
      this.pendingObservers.add({
        event,
        observer,
      });
    } else {
      target.subject.subscribe(observer);
    }
  }
}

/*
  Communicator should be used inside WebWorker.
  It will send all needed events to the main thread.
*/
export class WorkerInsideCommunicator extends InterCommunicator {
  public expose<T>(event: string, initialValue: T, exposeToMain = true) {
    const exp = super.expose(event, initialValue);

    /* postMessage to Main thread on every update if needed */
    if (exposeToMain) {
      workerEmitEvent(event, exp);
    }

    return exp;
  }

  public accept<T extends any[]>(eventsMap: T) {
    const exposablesMap = eventsMap.reduce((acc, curr) => {
      acc[curr.event] = this.expose(curr.event, curr.initial, false);
      return acc;
    }, {});

    addEventListener('message', ev => {
      if (Object.keys(exposablesMap).includes(ev.data.event)) {
        exposablesMap[ev.data.event].subject.next(ev.data.data);
      }
    });
  }
}

/*
 */

// export class HttpRequestCommunicator implements Communicator {
//   public expose<T>(event: string, initialValue: T, unique?: boolean) {

//   }

//   public on<T extends Event<T['data']>>(event: T['event'], observer: (data: T['data']) => void) {

//   }

// }

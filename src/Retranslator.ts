import { Communicator } from './Communicator';
import { Exposable } from './Exposable';

/*
  From Worker to Main thread.
  Should be used on Main.
*/
export function mainAcceptWorkerEvent<T>(
  communicator: Communicator,
  worker: Worker,
  event: string,
  initialValue: T
) {
  const exp = communicator.expose(event, initialValue, true);

  worker.addEventListener('message', ({ data }) => {
    if (data.event === event) {
      exp.subject.next(data.data);
    }
  });
}

/*
  Should be used inside Web Worker to emit messages to Main thread.
*/
export function workerEmitEvent<T>(event: string, exposable: Exposable<T>) {
  exposable.subject.subscribe(data => ((self as any) as Worker).postMessage({ event, data }));
}

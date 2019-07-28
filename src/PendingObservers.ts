import { ArraysMap } from './utils';
import { Exposable } from './Exposable';

interface PendingObserver {
  event: string;
  observer: (data: any) => void;
}

export class PendingObservers {
  public list = new ArraysMap<PendingObserver>();

  public add(pending: PendingObserver) {
    this.list.add(pending.event, pending);
  }

  public onExpose<T>(event: string, { subject }: Exposable<T>) {
    const pendingObservers = this.list.get(event);

    if (!pendingObservers || !pendingObservers.length) {
      return;
    }

    pendingObservers.forEach(pendingObs => {
      subject.subscribe(data => {
        pendingObs.observer(data);
      });
    })

    this.list.clear(event);
  }
}

import { action, reaction, observable } from 'mobx';

import { runWithComlink } from '../web-worker/runner';

type ServiceUse<S> = (service: S) => void;

export class SyncServiceWrapper<S> {
  public constructor(public service: S) {}

  public use(callback: ServiceUse<S>) {
    this.onReady(callback);
  }

  public onReady(callback: ServiceUse<S>) {
    callback(this.service);
  }
}

export class AsyncServiceWrapper<S> {
  @observable public isReady = false;
  @observable public service: S | undefined;

  public constructor(servicePromise: Promise<S>) {
    servicePromise.then(service => {
      this.service = service;
      this.isReady = true;
    });
  }

  public use(callback: ServiceUse<S>) {
    return this.onReady(callback);
  }

  public get(): Promise<S> {
    return new Promise(resolve => {
      return this.use(service => {
        resolve(service);
      });
    });
  }

  public onReady(callback: ServiceUse<S>) {
    const handler = reaction(
      () => this.service,
      service => {
        if (service) {
          callback(service);
          handler();
        }
      },
      {
        fireImmediately: true,
      }
    );

    return handler;
  }
}

export class WebWorkerServiceWrapper<S> extends AsyncServiceWrapper<S> {
  @observable public worker: Worker | undefined;

  public constructor(worker: Worker) {
    const runPromise = runWithComlink<S, null>(worker, false);
    super(runPromise.then(({ instance }) => instance));
    runPromise.then(({ worker }) => (this.worker = worker));
  }

  public useWorker(callback: (worker: Worker) => void) {
    const handler = reaction(
      () => this.worker,
      worker => {
        if (worker) {
          callback(worker);
          handler();
        }
      },
      {
        fireImmediately: true,
      }
    );

    return handler;
  }
}

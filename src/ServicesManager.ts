import { Communicator, InterCommunicator } from './Communicator';
import { SyncServiceWrapper, AsyncServiceWrapper, WebWorkerServiceWrapper } from './ServiceWrapper';

import { mainAcceptWorkerEvent as acceptFromWorker } from './Retranslator';

type ServiceCreator<S, I = {}> = (communicator: Communicator, inject: I) => S;

interface ServiceCreationOptions {
  accept: {
    event: string;
    initial: unknown;
  }[];
  workerAccept: {
    event: string;
  }[];
  // retranslators: (<T extends any[]>(...args: T) => void)[];
}

export class ServicesManager {
  public communicator: Communicator;
  protected services: Record<string, unknown> = {};

  public constructor() {
    this.communicator = new InterCommunicator();
  }

  public addLocalService<S, I = {}>(name: string, sc: ServiceCreator<S, I>, inject: I) {
    if (this.services[name]) {
      throw new Error(`Service with alias '${name}' is already exist.`);
    }

    const serviceWrapper = new SyncServiceWrapper<S>(sc(this.communicator, inject));

    this.services[name] = serviceWrapper;

    return serviceWrapper;
  }

  public addServiceInWebWorker<S, W extends Worker>(
    name: string,
    worker: W,
    { accept, workerAccept }: ServiceCreationOptions
  ) {
    const serviceWrapper = new WebWorkerServiceWrapper<S>(worker);
    this.services[name] = serviceWrapper;

    serviceWrapper.useWorker(w => {
      for (const { event, initial } of accept) {
        acceptFromWorker(this.communicator, w, event, initial);
      }

      for (const { event } of workerAccept) {
        this.communicator.on(event, data => w.postMessage({ event, data }));
      }
    });

    return serviceWrapper;
  }

  public getService(name: string) {
    return this.services[name];
  }
}

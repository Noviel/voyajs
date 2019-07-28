import { BehaviorSubject, Observer } from 'rxjs';

interface Service {}

export interface Exposable<T> {
  value: T;
  subject: BehaviorSubject<T>;
  update(updater: (current: T) => T): void;
}

export interface Event<T> {
  type: string;
  data: T;
}

interface Retranslator {
  retranslate<T>(source: any, event: string, initial: T): void;
}

export interface Communicator {
  addRetranslator(retranslator: Retranslator): void;

  expose<T>(event: string, initialValue: T): Exposable<T>;
  on<T>(event: string, observer: (data: T) => void): void;
}

interface ServiceConnector {}

interface ServiceConnectorWebWorker {}

interface ServiceConnectorLocal {}

interface ServicesManager {}

type Acceptor<D, R> = (data: D) => R;
/*
  Usage: accept 
*/
interface DataBridge {
  /*
    Send request to the outer system and get a response
  */
  request<P, R>(endpoint: string, payload: P): R;
  /*
    Listen for message from outer system.
  */
  accept<P, R>(endpoint: string, acceptor: Acceptor<P, R>): void;
}

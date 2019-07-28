import { BehaviorSubject } from 'rxjs';

export interface Exposable<T> {
  value: T;
  subject: BehaviorSubject<T>;
  update(updater: (current: T) => T): void;
}

export function createExposable<T>(initialValue: T): Exposable<T> {
  let value = initialValue;
  const subject = new BehaviorSubject(value);

  return {
    value,
    subject,
    update(updater: (prev: T) => T) {
      value = updater(value);
      subject.next(value);
    },
  };
}

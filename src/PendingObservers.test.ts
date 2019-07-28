import { PendingObservers } from './PendingObservers';
import { createExposable } from './Exposable';

const noOp = () => undefined;

describe(`PendingObservers`, () => {
  it(`can add new pending observers to an event`, () => {
    const po = new PendingObservers();
    const event = `TEST`;
    const event2 = `TEST2`;

    po.add({
      event,
      observer: noOp,
    });

    po.add({
      event,
      observer: noOp,
    });

    po.add({
      event: event2,
      observer: noOp,
    });

    expect(po.list.get(event).length).toBe(2);
    expect(po.list.get(event2).length).toBe(1);
  });

  it(`removes only related pending observers when event is activated`, () => {
    const po = new PendingObservers();
    const event = `ACTIVATE`;
    const event2 = `DO_NOT_ACTIVATE`;

    po.add({
      event,
      observer: noOp,
    });

    po.add({
      event: event2,
      observer: noOp,
    });

    po.onExpose(event, createExposable(`exposable`));

    expect(po.list.get(event).length).toBe(0);
    expect(po.list.get(event2).length).toBe(1);
  });
});

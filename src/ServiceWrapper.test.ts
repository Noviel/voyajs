import { SyncServiceWrapper, AsyncServiceWrapper } from './ServiceWrapper';

function createCounter(target: number, doneFn: () => void) {
  let counter = 0;

  return () => {
    counter++;
    if (counter === target) {
      doneFn();
    }
  };
}

function getDummyService() {
  const service = {
    plus42(input: number) {
      return 42 + input;
    },
  };

  return service;
}

function getDummyAsyncService() {
  return Promise.resolve(getDummyService());
}

describe(`SynServiceWrapper`, () => {
  it(`should be synchronous`, () => {
    const sw = new SyncServiceWrapper(getDummyService());
    let data = 0;
    sw.onReady(service => {
      data = service.plus42(0);
    });
    expect(data).toBe(42);
  });

  it(`should execute callback on service ready`, async done => {
    const sw = new SyncServiceWrapper(getDummyService());
    sw.onReady(async service => {
      const data = await service.plus42(0);
      expect(data).toBe(42);
      done();
    });
  });

  it(`should execute uses when ready`, async done => {
    const sw = new SyncServiceWrapper(getDummyService());

    const counter = createCounter(2, done);

    sw.use(async service => {
      const data = await service.plus42(0);
      expect(data).toBe(42);
      counter();
    });

    sw.use(async service => {
      const data = await service.plus42(10);
      expect(data).toBe(52);
      counter();
    });
  });
});

describe(`AsyncServiceWrapper`, () => {
  it(`should execute callback on service ready`, async done => {
    const sw = new AsyncServiceWrapper(getDummyAsyncService());
    sw.onReady(async service => {
      const data = await service.plus42(0);
      expect(data).toBe(42);
      done();
    });
  });

  it(`should be asynchronous`, () => {
    const sw = new AsyncServiceWrapper(getDummyAsyncService());
    let data = 0;
    sw.onReady(service => {
      data = service.plus42(0);
    });
    expect(data).toBe(0);
  });

  it(`should execute uses when ready`, async done => {
    const sw = new AsyncServiceWrapper(getDummyAsyncService());

    const counter = createCounter(2, done);

    sw.use(async service => {
      const data = await service.plus42(0);
      expect(data).toBe(42);
      counter();
    });

    sw.use(async service => {
      const data = await service.plus42(10);
      expect(data).toBe(52);
      counter();
    });
  });
});

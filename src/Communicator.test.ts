import { Communicator, InterCommunicator } from './Communicator';

describe(`S2SCommunicator`, () => {
  it(`should receive initial value for exposed event`, () => {
    const comm = new InterCommunicator();
    const fn = jest.fn(x => x);

    comm.expose(`EVENT`, 10);
    comm.on(`EVENT`, fn);

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.results[0].value).toBe(10);
  });

  it(`should not react to unrelated events`, () => {
    const comm = new InterCommunicator();
    const fn = jest.fn(x => x);

    comm.expose(`UNRELATED_EVENT`, null);
    comm.on(`UNUSED_EVENT`, fn);

    expect(fn.mock.calls.length).toBe(0);
  });

  it(`should activate observers that was added before an event`, () => {
    const comm = new InterCommunicator();
    const fn = jest.fn(x => x);

    const value = `fired`;

    comm.on(`EVENT`, fn);
    comm.expose(`EVENT`, value);

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.results[0].value).toBe(value);
  });

  it(`should throw on attempt to expose an event second time`, () => {
    const comm = new InterCommunicator();
    comm.expose(`EVENT`, `value`);

    expect(() => {
      comm.expose(`EVENT`, `value2`);
    }).toThrow();
  });

  it(`should retranslate events from generic source`, () => {
    const comm = new InterCommunicator();

    const serviceConsumer = (communicator: Communicator) => {
      let localData = 0;

      communicator.on<{ event: `PROVIDER_EVENT`, data: number}>(`PROVIDER_EVENT`, data => (localData += data));

      return {
        get data() {
          return localData;
        },
      };
    };

    const serviceProvider = (communicator: Communicator) => {
      const state = communicator.expose(`SC_STATE`, `started`);
      const data = communicator.expose(`PROVIDER_EVENT`, 0);

      data.update(prev => prev + 1);
      data.update(prev => prev + 1);
      data.update(prev => prev + 1);

      state.update(_ => `ready`);

      return {};
    };

    const [s1, s2] = [serviceConsumer(comm), serviceProvider(comm)];

    expect(s1.data).toBe(6);

    // const createSource = () => {
    //   const listeners: Record<string, any> = {};
    //   return {
    //     addEventListener(msg: string, { data }: any) {},
    //   };
    // };

    // comm.addRetranslator();
  });
});

import { Communicator } from './Communicator';
import { ServicesManager } from './ServicesManager';

const noOp = () => void 0;

class ProxyService {
  public state = 0;

  public constructor(public communicator: Communicator) {
    communicator.on('EVENT', (data: number) => (this.state = data));
  }

  public act() {
    return 0;
  }
}

function createProxyService(communicator: Communicator) {
  let state = 0;

  communicator.on('EVENT', (data: number) => {
    state = data;
  });

  return {
    act() {
      return 0;
    },
    getState() {
      return state;
    },
    communicator,
  };
}

describe(`ServicesManager`, () => {
  it(`should work`, () => {
    const sm = new ServicesManager();

    const { service } = sm.addLocalService('service', createProxyService);
    const comm = service.communicator;

    const ev = comm.expose(`EVENT`, 420);
    expect(service.getState()).toBe(420);

    ev.update(_ => 0);
    expect(service.getState()).toBe(0);
  });
});

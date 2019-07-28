import { IAnyModelType, SnapshotOrInstance } from 'mobx-state-tree';

export interface IServices {
  [service: string]: any;
}

export const createStoreWithServices = <Services extends IServices, Store extends IAnyModelType>(
  store: Store,
  initialState: SnapshotOrInstance<Store>,
  services?: Services
) => {
  console.log('store', store);
  console.log('got services', services);

  const createdStore = store.create(initialState, services);

  return createdStore;
};

type MetaStoreDescription = Record<string, any>;

export function createNamedStores(storeDesc: MetaStoreDescription) {
  let stores: Record<string, any> = {};
  for (let [alias, store] of Object.entries(storeDesc)) {
    stores[alias] = store;
  }

  return { stores };
}

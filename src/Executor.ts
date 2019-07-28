import { ArraysMap } from './utils';

export const createMultipleExecutor = () => {
  const list = new ArraysMap<any>();
  return {
    add(map: Record<string, any>) {
      Object.keys(map).forEach(event => {
        list.add(event, map[event]);
      });
    },

    exec<T>(event: string, data: T) {
      const fns = list.get(event);
      if (fns) {
        for (const fn of fns) {
          fn(data);
        }
      }
    },
  };
};
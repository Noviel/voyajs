export function run(WorkerCreator: Worker): Worker | null {
  try {
    const worker: Worker = new (WorkerCreator as any)();
    return worker;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export function work(worker: any): Worker {
  const ctx: Worker = worker as any;

  return ctx;
}

export async function runWithComlink<T, I>(WorkerFile: any, isConstructor = true, inject?: I) {
  const Comlink = await import('../comlink/comlink');
  const worker: Worker = new WorkerFile();
  const ProxiedWorker: any = Comlink.wrap(worker);
  const instance: T = isConstructor ? await new ProxiedWorker(inject) : await ProxiedWorker;
  return { instance, worker };
}

interface Callable<R> {
  (...args: any[]): R;
}

type GenericReturnType<R, X> = X extends Callable<R> ? R : never;

export type RunWithComlink<T> = GenericReturnType<T, typeof runWithComlink>;

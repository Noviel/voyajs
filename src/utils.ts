export function iterateReverse<T>(arr: T[], callback: (curr: T, index: number, arr: T[]) => void) {
  for (let i = arr.length - 1; i >= 0; i--) {
    callback(arr[i], i, arr);
  }
}

export class ArraysMap<T> {
  protected map: Record<string, T[]> = {};

  public add(key: string, value: T) {
    if (!this.map[key]) {
      this.map[key] = [value];
    } else {
      this.map[key].push(value);
    }
  }

  public get(key: string) {
    return this.map[key];
  }

  public clear(key: string) {
    if (this.map[key]) {
      this.map[key] = [];
    }
  }
}

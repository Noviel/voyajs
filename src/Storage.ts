export interface Storage {
  get<T = any>(key: string): Promise<T>;
  set(key: string, value: any): Promise<any>;
  remove(key: string): Promise<any>;
}

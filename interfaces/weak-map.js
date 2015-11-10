declare class WeakMap<K, V> {
  clear(): void;
  delete(key: K): boolean;
  get(key: K): V;
  has(key: K): boolean;
  set(key: K, value: V): WeakMap<K, V>;
}

declare module 'core-js/library/es6/weak-map' {
 declare var exports: typeof WeakMap;
}

export class LazyMap<K, V> implements Map<K, V> {
	constructor() {
		return new Proxy(this, {
			get(target, prop) {
				const val = Reflect.get(target.map, prop);
				return typeof val === "function" ? val.bind(target.map) : val;
			},
		});
	}

	private _map: Map<K, V> | undefined;

	private get map(): Map<K, V> {
		if (!this._map) {
			this._map = new Map<K, V>();
		}
		return this._map;
	}

	get [Symbol.toStringTag](): string {
		return "LazyMap";
	}

	// Satisfy the type checker — runtime behaviour is handled by the Proxy
	declare clear: () => void;
	declare delete: (key: K) => boolean;
	declare forEach: (
		callbackfn: (value: V, key: K, map: Map<K, V>) => void,
		thisArg?: unknown,
	) => void;
	declare get: (key: K) => V | undefined;
	declare has: (key: K) => boolean;
	declare set: (key: K, value: V) => this;
	declare readonly size: number;
	declare entries: () => MapIterator<[K, V]>;
	declare keys: () => MapIterator<K>;
	declare values: () => MapIterator<V>;
	declare [Symbol.iterator]: () => MapIterator<[K, V]>;
}

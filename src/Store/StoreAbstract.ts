export abstract class StoreAbstract<T> {
	protected abstract value: T;
	set(value: T) {
		this.value = value;
	}
	get(): T {
		return this.value;
	}
}

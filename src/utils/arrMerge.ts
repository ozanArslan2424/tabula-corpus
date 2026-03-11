export function arrMerge<T>(
	base: T[] = [],
	override: T[] = [],
): T[] | undefined {
	if (base.length === 0 && override.length === 0) return undefined;

	const seen = new Set<T>(base);
	for (const item of override) seen.add(item);
	return [...seen];
}

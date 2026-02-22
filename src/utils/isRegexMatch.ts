export function isRegexMatch(source: string, pattern: RegExp): boolean {
	return pattern.test(source);
}

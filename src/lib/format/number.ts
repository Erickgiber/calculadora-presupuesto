export function parseNumber(value: string | number): number {
	return Number(String(value).replace(',', '.'));
}

export function roundToCents(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function isNonNegativeNumber(value: string): boolean {
	const parsed = parseNumber(value);
	return value !== '' && Number.isFinite(parsed) && parsed >= 0;
}

export function isPositiveNumber(value: string): boolean {
	const parsed = parseNumber(value);
	return Number.isFinite(parsed) && parsed > 0;
}

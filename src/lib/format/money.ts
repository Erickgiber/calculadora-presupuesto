export const CURRENCIES = {
	USD: 'Dólar estadounidense',
	VES: 'Bolívar venezolano',
	EUR: 'Euro',
	COP: 'Peso colombiano',
	MXN: 'Peso mexicano',
	ARS: 'Peso argentino',
	CLP: 'Peso chileno',
	PEN: 'Sol peruano'
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export function isCurrencyCode(value: unknown): value is CurrencyCode {
	return typeof value === 'string' && Object.hasOwn(CURRENCIES, value);
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
	return new Intl.NumberFormat('es-VE', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}

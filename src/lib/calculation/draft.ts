import type { CurrencyCode } from '#lib/format/money.ts';

type ProductionMode = 'unit' | 'batch';

export type MaterialsInputMode = 'total' | 'detail';

export interface MaterialItem {
	name: string;
	quantity: string;
	price: string;
}

export interface CalculationDraft {
	currency: CurrencyCode;
	product: string;
	productionMode: ProductionMode;
	batchUnits: string;
	materialsMode: MaterialsInputMode;
	materialsTotal: string;
	materialItems: MaterialItem[];
	laborHours: string;
	hourlyRate: string;
	otherExpenses: string;
	marginPercent: string;
}

export const PRODUCTION_MODE_OPTIONS = [
	{
		value: 'unit',
		label: 'Una pieza a la vez',
		description: 'Registras lo que cuesta hacer una sola unidad.'
	},
	{
		value: 'batch',
		label: 'Por lote',
		description: 'Produces varias unidades juntas y dividimos los costos entre ellas.'
	}
] as const satisfies readonly { value: ProductionMode; label: string; description: string }[];

export const MATERIALS_MODE_OPTIONS = [
	{ value: 'total', label: 'Ingresar total' },
	{ value: 'detail', label: 'Detallar productos' }
] as const satisfies readonly { value: MaterialsInputMode; label: string }[];

export const MARGIN_PRESETS = [20, 30, 40] as const;

export const MAX_MARGIN_PERCENT = 95;

export function createMaterialItem(): MaterialItem {
	return { name: '', quantity: '1', price: '' };
}

export function createDraft(currency: CurrencyCode): CalculationDraft {
	return {
		currency,
		product: '',
		productionMode: 'unit',
		batchUnits: '',
		materialsMode: 'total',
		materialsTotal: '',
		materialItems: [createMaterialItem()],
		laborHours: '',
		hourlyRate: '',
		otherExpenses: '0',
		marginPercent: '30'
	};
}

export function isBatch(draft: CalculationDraft): boolean {
	return draft.productionMode === 'batch';
}

export function isMaterialItemBlank(item: MaterialItem): boolean {
	return !item.name.trim() && !item.price.trim();
}

export function isMaterialItemIncomplete(item: MaterialItem): boolean {
	return !item.name.trim() || !item.price.trim();
}

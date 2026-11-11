import { parseNumber, roundToCents } from '#lib/format/number.ts';
import { isBatch, type CalculationDraft, type MaterialItem } from './draft.ts';

export interface PriceBreakdown {
	units: number;
	materials: number;
	labor: number;
	otherExpenses: number;
	totalCost: number;
	price: number;
	profit: number;
}

export function isValidBatchSize(batchUnits: string): boolean {
	const units = parseNumber(batchUnits);
	return Number.isInteger(units) && units >= 1;
}

export function productionUnits(draft: CalculationDraft): number {
	return isBatch(draft) && isValidBatchSize(draft.batchUnits) ? parseNumber(draft.batchUnits) : 1;
}

function materialItemCost(item: MaterialItem): number {
	const price = parseNumber(item.price);
	const quantity = parseNumber(item.quantity);
	return Number.isFinite(price) && Number.isFinite(quantity) ? price * quantity : 0;
}

export function materialItemsTotal(items: MaterialItem[]): number {
	return roundToCents(items.reduce((sum, item) => sum + materialItemCost(item), 0));
}

export function materialsCost(draft: CalculationDraft): number {
	return draft.materialsMode === 'detail'
		? materialItemsTotal(draft.materialItems)
		: parseNumber(draft.materialsTotal);
}

export function calculatePrice(draft: CalculationDraft): PriceBreakdown {
	const units = productionUnits(draft);
	const materials = roundToCents(materialsCost(draft) / units);
	const labor = roundToCents(
		(parseNumber(draft.laborHours) * parseNumber(draft.hourlyRate)) / units
	);
	const otherExpenses = roundToCents(parseNumber(draft.otherExpenses) / units);
	const totalCost = roundToCents(materials + labor + otherExpenses);
	const price = roundToCents(totalCost / (1 - parseNumber(draft.marginPercent) / 100));
	return {
		units,
		materials,
		labor,
		otherExpenses,
		totalCost,
		price,
		profit: roundToCents(price - totalCost)
	};
}

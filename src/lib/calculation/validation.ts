import { isNonNegativeNumber, isPositiveNumber, parseNumber } from '#lib/format/number.ts';
import {
	isBatch,
	isMaterialItemBlank,
	MAX_MARGIN_PERCENT,
	type CalculationDraft,
	type MaterialItem
} from './draft.ts';
import { isValidBatchSize, materialsCost } from './pricing.ts';

export type ValidationResult = string | null;

export function isMaterialItemComplete(item: MaterialItem): boolean {
	return (
		Boolean(item.name.trim()) && isPositiveNumber(item.quantity) && isPositiveNumber(item.price)
	);
}

export function validateProduct(draft: CalculationDraft): ValidationResult {
	if (!draft.product.trim()) return 'Escribe el nombre de tu producto.';
	if (isBatch(draft) && !isValidBatchSize(draft.batchUnits)) {
		return 'Indica cuántas unidades produce el lote (mínimo 1).';
	}
	return null;
}

export function validateMaterials(draft: CalculationDraft): ValidationResult {
	if (draft.materialsMode === 'detail') {
		const filledItems = draft.materialItems.filter((item) => !isMaterialItemBlank(item));
		if (!filledItems.length) return 'Agrega al menos un producto.';
		if (!filledItems.every(isMaterialItemComplete)) {
			return 'Completa el nombre, la cantidad y un precio mayor que cero en cada producto.';
		}
	}
	return isPositiveNumber(String(materialsCost(draft)))
		? null
		: 'El costo de materiales debe ser mayor que cero.';
}

export function validateLabor(draft: CalculationDraft): ValidationResult {
	return isNonNegativeNumber(draft.laborHours) && isNonNegativeNumber(draft.hourlyRate)
		? null
		: 'Ingresa valores válidos para tu tiempo y tarifa.';
}

export function validateMargin(draft: CalculationDraft): ValidationResult {
	const margin = parseNumber(draft.marginPercent);
	return Number.isFinite(margin) && margin >= 0 && margin <= MAX_MARGIN_PERCENT
		? null
		: `Elige un margen entre 0 y ${MAX_MARGIN_PERCENT} %.`;
}

import {
	createMaterialItem,
	type CalculationDraft,
	type MaterialItem
} from '#lib/calculation/draft.ts';
import { materialsCost } from '#lib/calculation/pricing.ts';
import { DEFAULT_CURRENCY, isCurrencyCode } from '#lib/format/money.ts';
import { isRecord, readJson, readString, writeJson } from './local-storage.ts';

const STORAGE_KEY = 'margen-calculos';

export const MAX_SAVED_CALCULATIONS = 50;

export type SavedCalculationId = string | number;

export interface SavedCalculation {
	id: SavedCalculationId;
	updatedAt: number;
	draft: CalculationDraft;
}

function toStoredItem(item: MaterialItem) {
	return { nombre: item.name, cantidad: item.quantity, precio: item.price };
}

function fromStoredItem(stored: unknown): MaterialItem {
	if (!isRecord(stored)) return createMaterialItem();
	return {
		name: readString(stored.nombre),
		quantity: readString(stored.cantidad, '1'),
		price: readString(stored.precio)
	};
}

function toStoredCalculation({ id, updatedAt, draft }: SavedCalculation) {
	return {
		id,
		updatedAt,
		moneda: draft.currency,
		producto: draft.product,
		modoProduccion: draft.productionMode === 'batch' ? 'lote' : 'unidad',
		unidadesLote: draft.batchUnits,
		materiales: String(materialsCost(draft)),
		modoMateriales: draft.materialsMode === 'detail' ? 'detalle' : 'total',
		totalMateriales: draft.materialsTotal,
		itemsMateriales: draft.materialItems.map(toStoredItem),
		horas: draft.laborHours,
		tarifa: draft.hourlyRate,
		gastos: draft.otherExpenses,
		margen: draft.marginPercent
	};
}

function fromStoredCalculation(stored: unknown): SavedCalculation | null {
	if (!isRecord(stored) || (typeof stored.id !== 'string' && typeof stored.id !== 'number')) {
		return null;
	}
	const items = Array.isArray(stored.itemsMateriales) ? stored.itemsMateriales : [];
	const isDetailed = stored.modoMateriales === 'detalle';
	return {
		id: stored.id,
		updatedAt: typeof stored.updatedAt === 'number' ? stored.updatedAt : 0,
		draft: {
			currency: isCurrencyCode(stored.moneda) ? stored.moneda : DEFAULT_CURRENCY,
			product: readString(stored.producto),
			productionMode: stored.modoProduccion === 'lote' ? 'batch' : 'unit',
			batchUnits: readString(stored.unidadesLote),
			materialsMode: isDetailed ? 'detail' : 'total',
			materialsTotal: readString(isDetailed ? stored.totalMateriales : stored.materiales),
			materialItems: items.length ? items.map(fromStoredItem) : [createMaterialItem()],
			laborHours: readString(stored.horas),
			hourlyRate: readString(stored.tarifa),
			otherExpenses: readString(stored.gastos, '0'),
			marginPercent: readString(stored.margen, '30')
		}
	};
}

export function loadSavedCalculations(): SavedCalculation[] {
	const stored = readJson(STORAGE_KEY);
	if (!Array.isArray(stored)) return [];
	return stored
		.map(fromStoredCalculation)
		.filter((calculation): calculation is SavedCalculation => calculation !== null);
}

export function storeSavedCalculations(calculations: SavedCalculation[]): boolean {
	return writeJson(STORAGE_KEY, calculations.map(toStoredCalculation));
}

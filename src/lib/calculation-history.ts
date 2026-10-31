import type { BudgetDraft, Calculation } from './budget.svelte';
import { clearStore, deleteRecord, readAllRecords, STORES, updateRecord } from './db';
import { isRecord, normalizeDraft } from './draft-schema';

export type SavedCalculation = {
	id: string;
	createdAt: number;
	updatedAt: number;
	draft: BudgetDraft;
	result: Calculation;
};

function toSavedCalculation(value: unknown): SavedCalculation | undefined {
	if (
		!isRecord(value) ||
		typeof value.id !== 'string' ||
		typeof value.createdAt !== 'number' ||
		typeof value.updatedAt !== 'number' ||
		!isRecord(value.result) ||
		typeof value.result.total !== 'number'
	) {
		return undefined;
	}

	const draft = normalizeDraft(value.draft);
	return draft && { ...(value as SavedCalculation), draft };
}

export async function listCalculations() {
	const records = await readAllRecords<unknown>(STORES.calculations, 'updatedAt', 'prev');
	return records.map(toSavedCalculation).filter((record) => record !== undefined);
}

export function saveCalculation(id: string, draft: BudgetDraft, result: Calculation) {
	return updateRecord<SavedCalculation>(STORES.calculations, id, (existing) => {
		const now = Date.now();
		return { id, createdAt: existing?.createdAt ?? now, updatedAt: now, draft, result };
	});
}

export function deleteCalculation(id: string) {
	return deleteRecord(STORES.calculations, id);
}

export function clearCalculations() {
	return clearStore(STORES.calculations);
}

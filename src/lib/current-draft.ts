import type { BudgetDraft } from './budget.svelte';
import { readRecord, STORES, writeRecord } from './db';
import { isRecord, normalizeDraft } from './draft-schema';

const CURRENT_DRAFT_ID = 'current';
const LEGACY_DRAFT_KEY = 'margenko:draft';

export type CurrentDraft = {
	calculationId: string;
	draft: BudgetDraft;
};

type DraftRecord = CurrentDraft & {
	id: typeof CURRENT_DRAFT_ID;
	updatedAt: number;
};

export function newCalculationId(): string {
	return crypto.randomUUID();
}

function takeLegacyDraft(): CurrentDraft | undefined {
	try {
		const storedDraft = localStorage.getItem(LEGACY_DRAFT_KEY);
		localStorage.removeItem(LEGACY_DRAFT_KEY);
		const draft = storedDraft ? normalizeDraft(JSON.parse(storedDraft)) : undefined;
		return draft && { calculationId: newCalculationId(), draft };
	} catch {
		return undefined;
	}
}

export async function loadCurrentDraft(): Promise<CurrentDraft | undefined> {
	const record = await readRecord<unknown>(STORES.drafts, CURRENT_DRAFT_ID);
	if (!isRecord(record)) {
		return takeLegacyDraft();
	}

	const draft = normalizeDraft(record.draft);
	return draft && typeof record.calculationId === 'string'
		? { calculationId: record.calculationId, draft }
		: undefined;
}

export function saveCurrentDraft(current: CurrentDraft) {
	return writeRecord<DraftRecord>(STORES.drafts, {
		id: CURRENT_DRAFT_ID,
		...current,
		updatedAt: Date.now()
	});
}

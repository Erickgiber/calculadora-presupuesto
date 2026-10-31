import type { BudgetDraft, Material } from './budget.svelte';

const DRAFT_KEY = 'margenko:draft';

const textFields = ['project', 'batchSize', 'hours', 'hourlyRate', 'profitPercent'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isMaterial(value: unknown): value is Material {
	return (
		isRecord(value) &&
		typeof value.id === 'number' &&
		typeof value.name === 'string' &&
		typeof value.quantity === 'string' &&
		typeof value.price === 'string'
	);
}

function isBudgetDraft(value: unknown): value is BudgetDraft {
	return (
		isRecord(value) &&
		textFields.every((field) => typeof value[field] === 'string') &&
		(value.mode === 'unit' || value.mode === 'batch') &&
		Array.isArray(value.materials) &&
		value.materials.every(isMaterial)
	);
}

export function loadDraft(): BudgetDraft | undefined {
	try {
		const storedDraft = localStorage.getItem(DRAFT_KEY);
		const draft: unknown = storedDraft ? JSON.parse(storedDraft) : undefined;
		return isBudgetDraft(draft) ? draft : undefined;
	} catch {
		return undefined;
	}
}

export function saveDraft(draft: BudgetDraft) {
	try {
		localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
	} catch (error) {
		console.warn('No se pudo guardar el borrador', error);
	}
}

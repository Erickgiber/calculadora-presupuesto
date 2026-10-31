import type { BudgetDraft, Material } from './budget.svelte';

const textFields = ['project', 'batchSize', 'hourlyRate', 'profitPercent'] as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
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

function readLaborTime(value: Record<string, unknown>) {
	if (typeof value.laborTime === 'string') {
		return value.laborTime;
	}
	return typeof value.hours === 'string' ? value.hours : undefined;
}

export function normalizeDraft(value: unknown): BudgetDraft | undefined {
	if (!isRecord(value)) {
		return undefined;
	}

	const laborTime = readLaborTime(value);
	const hasValidShape =
		textFields.every((field) => typeof value[field] === 'string') &&
		(value.mode === 'unit' || value.mode === 'batch') &&
		Array.isArray(value.materials) &&
		value.materials.every(isMaterial) &&
		laborTime !== undefined;

	if (!hasValidShape) {
		return undefined;
	}

	return {
		project: value.project as string,
		mode: value.mode as BudgetDraft['mode'],
		batchSize: value.batchSize as string,
		materials: value.materials as Material[],
		laborTime,
		timeUnit: value.timeUnit === 'minutes' ? 'minutes' : 'hours',
		hourlyRate: value.hourlyRate as string,
		profitPercent: value.profitPercent as string
	};
}

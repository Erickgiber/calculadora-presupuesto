import { createDraft, isBatch, type CalculationDraft } from '#lib/calculation/draft.ts';
import { calculatePrice, productionUnits } from '#lib/calculation/pricing.ts';
import type { SavedCalculation, SavedCalculationId } from '#lib/storage/saved-calculations.ts';
import { history } from './history.svelte.ts';
import { preferences } from './preferences.svelte.ts';

class CalculatorSession {
	draft = $state<CalculationDraft>(createDraft(preferences.current.currency));
	savedId = $state<SavedCalculationId | null>(null);
	pricing = $derived(calculatePrice(this.draft));
	isBatch = $derived(isBatch(this.draft));
	units = $derived(productionUnits(this.draft));
	hasStarted = $derived(Boolean(this.draft.product.trim()));

	byProductionMode<T>(unitValue: T, batchValue: T): T {
		return this.isBatch ? batchValue : unitValue;
	}

	startNew(): void {
		this.draft = createDraft(preferences.current.currency);
		this.savedId = null;
	}

	open(saved: SavedCalculation): void {
		this.draft = $state.snapshot(saved.draft);
		this.savedId = saved.id;
	}

	save(): boolean {
		this.draft.product = this.draft.product.trim();
		const entry = history.save(this.draft, this.savedId);
		if (!entry) return false;
		this.savedId = entry.id;
		return true;
	}
}

export const calculator = new CalculatorSession();

import type { CalculationDraft } from '#lib/calculation/draft.ts';
import {
	loadSavedCalculations,
	MAX_SAVED_CALCULATIONS,
	storeSavedCalculations,
	type SavedCalculation,
	type SavedCalculationId
} from '#lib/storage/saved-calculations.ts';

class CalculationHistory {
	items = $state<SavedCalculation[]>(loadSavedCalculations());
	latest = $derived<SavedCalculation | undefined>(this.items[0]);

	save(draft: CalculationDraft, id: SavedCalculationId | null): SavedCalculation | null {
		const now = Date.now();
		const entry: SavedCalculation = {
			id: id ?? now,
			updatedAt: now,
			draft: $state.snapshot(draft)
		};
		const others = this.items.filter((item) => item.id !== entry.id);
		return this.replace([entry, ...others].slice(0, MAX_SAVED_CALCULATIONS)) ? entry : null;
	}

	remove(id: SavedCalculationId): boolean {
		return this.replace(this.items.filter((item) => String(item.id) !== String(id)));
	}

	clear(): boolean {
		return this.replace([]);
	}

	private replace(next: SavedCalculation[]): boolean {
		if (!storeSavedCalculations(next)) return false;
		this.items = next;
		return true;
	}
}

export const history = new CalculationHistory();

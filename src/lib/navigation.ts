import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { calculator } from '#lib/state/calculator.svelte.ts';
import type { SavedCalculation } from '#lib/storage/saved-calculations.ts';

export function startNewCalculation(): Promise<void> {
	calculator.startNew();
	return goto(resolve('/calculator/product'));
}

export function openSavedCalculation(saved: SavedCalculation): Promise<void> {
	calculator.open(saved);
	return goto(resolve('/calculator/result'));
}

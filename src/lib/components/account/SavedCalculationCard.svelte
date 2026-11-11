<script lang="ts">
	import { calculatePrice } from '#lib/calculation/pricing.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import { formatDate } from '#lib/format/date.ts';
	import { formatMoney } from '#lib/format/money.ts';
	import type { SavedCalculation } from '#lib/storage/saved-calculations.ts';

	interface Props {
		calculation: SavedCalculation;
		onopen: () => void;
		ondelete: () => void;
	}

	let { calculation, onopen, ondelete }: Props = $props();

	const draft = $derived(calculation.draft);
	const savedOn = $derived(
		calculation.updatedAt ? formatDate(calculation.updatedAt) : 'Cálculo guardado'
	);
</script>

<article class="card">
	<div class="eyebrow">{draft.currency} · {savedOn}</div>
	<h2>{draft.product}</h2>
	<div class="price">{formatMoney(calculatePrice(draft).price, draft.currency)}</div>
	<p class="small">Margen: {draft.marginPercent} %</p>
	<div class="actions">
		<Button variant="secondary" onclick={onopen}>Ver cálculo</Button>
		<button type="button" class="delete-button" onclick={ondelete}>Borrar</button>
	</div>
</article>

<style>
	h2 {
		margin-top: 8px;
	}

	.price {
		color: var(--app-accent);
		font-size: 30px;
		overflow-wrap: anywhere;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.delete-button {
		flex: none;
		min-height: 50px;
		padding: 10px 14px;
		border: 0;
		border-radius: var(--radius-md);
		background: var(--app-danger-soft);
		color: var(--app-danger);
	}
</style>

<script lang="ts">
	import type { PriceBreakdown } from '#lib/calculation/pricing.ts';
	import ValueRow from '#lib/components/ui/ValueRow.svelte';
	import { formatMoney, type CurrencyCode } from '#lib/format/money.ts';

	interface Props {
		pricing: PriceBreakdown;
		currency: CurrencyCode;
	}

	let { pricing, currency }: Props = $props();

	const rows = $derived([
		{ label: 'Materiales y empaque', amount: pricing.materials },
		{ label: 'Tu trabajo', amount: pricing.labor },
		{ label: 'Otros gastos', amount: pricing.otherExpenses }
	]);
</script>

{#each rows as row (row.label)}
	<ValueRow label={row.label} value={formatMoney(row.amount, currency)} />
{/each}
<ValueRow label="Costo total" value={formatMoney(pricing.totalCost, currency)} variant="total" />
<ValueRow label="Tu ganancia por unidad" value={formatMoney(pricing.profit, currency)} />

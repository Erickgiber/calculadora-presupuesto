<script lang="ts">
	import { money, type Budget } from '#lib/budget.svelte.ts';

	let { calculation }: { calculation: Budget['calculation'] } = $props();

	const segments = $derived([
		{ label: 'Materiales', value: calculation.materialUnit, className: 'materials' },
		{ label: 'Mano de obra', value: calculation.laborUnit, className: 'labor' },
		{ label: 'Ganancia', value: calculation.profit, className: 'profit' }
	]);
</script>

<div class="composition-bar" aria-hidden="true">
	{#each segments as segment (segment.label)}
		<span
			class="segment {segment.className}"
			style:width="{calculation.total > 0 ? (segment.value / calculation.total) * 100 : 0}%"
		></span>
	{/each}
</div>
<dl class="breakdown">
	<div class="row">
		<dt><span class="swatch materials"></span>Materiales</dt>
		<dd>{money.format(calculation.materialUnit)}</dd>
	</div>
	<div class="row">
		<dt><span class="swatch labor"></span>Mano de obra</dt>
		<dd>{money.format(calculation.laborUnit)}</dd>
	</div>
	<div class="row is-subtotal">
		<dt>Inversión por unidad</dt>
		<dd>{money.format(calculation.investment)}</dd>
	</div>
	<div class="row">
		<dt><span class="swatch profit"></span>Ganancia ({calculation.profitRate}%)</dt>
		<dd class="is-profit">+{money.format(calculation.profit)}</dd>
	</div>
	<div class="row is-total">
		<dt>Precio de venta</dt>
		<dd>{money.format(calculation.total)}</dd>
	</div>
</dl>

<style>
	.composition-bar {
		height: 12px;
		border-radius: var(--radius-pill);
		background: var(--color-brand-soft);
		display: flex;
		gap: 2px;
		overflow: hidden;
	}

	.segment {
		height: 100%;
		transition: width 400ms var(--ease-out);
	}

	.materials {
		background: var(--color-materials-fill);
	}

	.labor {
		background: var(--color-labor-fill);
	}

	.profit {
		background: var(--color-profit-fill);
	}

	.breakdown {
		margin-top: 12px;
		font-size: 15px;
	}

	.row {
		padding: 8px 0;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	dt {
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	dd {
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		white-space: nowrap;
	}

	.swatch {
		width: 10px;
		height: 10px;
		flex: none;
		border-radius: 3px;
	}

	.is-subtotal,
	.is-total {
		border-top: 1px solid var(--color-border);
	}

	.is-subtotal dt {
		color: var(--color-text);
		font-weight: 500;
	}

	.is-subtotal dd {
		font-weight: 600;
	}

	dd.is-profit {
		color: var(--color-profit);
		font-weight: 600;
	}

	.is-total {
		margin-top: 4px;
		padding-top: 14px;
		border-top-color: var(--color-text);
	}

	.is-total dt {
		color: var(--color-text);
		font-weight: 600;
	}

	.is-total dd {
		color: var(--color-brand-strong);
		font-size: 19px;
		font-weight: 700;
	}
</style>

<script lang="ts">
	import { money, type Budget } from '#lib/budget.svelte.ts';
	import NumberField from '../NumberField.svelte';

	let { budget }: { budget: Budget } = $props();
</script>

<div class="inputs">
	<div class="field">
		<label for="hours" class="field-label">
			{budget.isBatch ? 'Horas para todo el lote' : 'Horas por pieza'}
		</label>
		<NumberField id="hours" bind:value={budget.hours} suffix="h" />
	</div>
	<div class="field">
		<label for="hourly-rate" class="field-label">Valor de tu hora</label>
		<NumberField id="hourly-rate" bind:value={budget.hourlyRate} placeholder="0.00" prefix="$" />
	</div>
</div>

<div class="labor-total">
	<span>Tu trabajo vale{budget.isBatch ? ' por unidad' : ''}</span>
	<strong>{money.format(budget.calculation.laborUnit)}</strong>
</div>

<details class="tip">
	<summary>¿Cómo calculo el valor de mi hora?</summary>
	<p>
		Divide lo que quieres ganar al mes entre las horas que trabajas en ese tiempo. Por ejemplo,
		$12,000 entre 120 horas son $100 por hora.
	</p>
</details>

<style>
	.inputs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.labor-total {
		margin-top: 20px;
		padding: 16px;
		border-radius: var(--radius-control);
		background: var(--color-brand-soft);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		color: var(--color-text-muted);
		font-size: 15px;
	}

	.labor-total strong {
		color: var(--color-brand-strong);
		font-family: var(--font-display);
		font-size: 24px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
	}

	.tip {
		margin-top: 16px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
	}

	.tip summary {
		min-height: 48px;
		padding: 0 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		color: var(--color-brand-strong);
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;
		list-style: none;
	}

	.tip summary::-webkit-details-marker {
		display: none;
	}

	.tip summary::after {
		content: '';
		width: 8px;
		height: 8px;
		flex: none;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: translateY(-2px) rotate(45deg);
		transition: transform 200ms var(--ease-out);
	}

	.tip[open] summary::after {
		transform: translateY(2px) rotate(-135deg);
	}

	.tip p {
		padding: 0 16px 16px;
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 1.5;
	}
</style>

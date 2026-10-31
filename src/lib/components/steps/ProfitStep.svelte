<script lang="ts">
	import { money, RECOMMENDED_PROFIT_PERCENT, type Budget } from '#lib/budget.svelte.ts';
	import NumberField from '../NumberField.svelte';

	let { budget }: { budget: Budget } = $props();

	const presets = ['20', '30', '40', '50'];
</script>

<fieldset class="field">
	<legend class="field-label">Elige un porcentaje</legend>
	<div class="presets">
		{#each presets as preset (preset)}
			<button
				type="button"
				class="preset"
				aria-pressed={Number(budget.profitPercent) === Number(preset)}
				onclick={() => (budget.profitPercent = preset)}
			>
				<strong>{preset}%</strong>
				{#if preset === RECOMMENDED_PROFIT_PERCENT}
					<span>Recomendado</span>
				{/if}
			</button>
		{/each}
	</div>
</fieldset>

<div class="field custom">
	<label for="profit-percent" class="field-label">O escribe otro porcentaje</label>
	<NumberField id="profit-percent" bind:value={budget.profitPercent} suffix="%" />
	<p class="field-hint">
		El {RECOMMENDED_PROFIT_PERCENT}% es un punto de partida saludable para cubrir imprevistos y
		crecer.
	</p>
</div>

<div class="preview">
	<div>
		<span>Ganas por unidad</span>
		<strong class="profit">+{money.format(budget.calculation.profit)}</strong>
	</div>
	<div>
		<span>Precio de venta</span>
		<strong>{money.format(budget.calculation.total)}</strong>
	</div>
</div>

<style>
	legend.field-label {
		margin-bottom: 8px;
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
	}

	.preset {
		min-height: 64px;
		padding: 8px 4px;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-control);
		background: var(--color-surface);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		transition:
			border-color 150ms ease,
			background-color 150ms ease,
			transform 100ms ease;
	}

	.preset:hover {
		border-color: var(--color-brand);
	}

	.preset:active {
		transform: scale(0.97);
	}

	.preset strong {
		font-size: 18px;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.preset span {
		color: var(--color-profit);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.preset[aria-pressed='true'] {
		border-color: var(--color-brand-strong);
		background: var(--color-brand-soft);
		box-shadow: inset 0 0 0 1px var(--color-brand-strong);
		color: var(--color-brand-strong);
	}

	.custom {
		max-width: 320px;
		margin-top: 24px;
	}

	.preview {
		margin-top: 24px;
		border-radius: var(--radius-control);
		background: var(--color-surface-muted);
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.preview div {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.preview div + div {
		border-left: 1px solid var(--color-border);
	}

	.preview span {
		color: var(--color-text-muted);
		font-size: 14px;
	}

	.preview strong {
		font-family: var(--font-display);
		font-size: 22px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		overflow-wrap: anywhere;
	}

	.preview .profit {
		color: var(--color-profit);
	}
</style>

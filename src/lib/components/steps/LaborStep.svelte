<script lang="ts">
	import { money, TIME_UNIT_SUFFIX, type Budget, type TimeUnit } from '#lib/budget.svelte.ts';
	import NumberField from '../NumberField.svelte';

	let { budget }: { budget: Budget } = $props();

	const timeUnits: { value: TimeUnit; label: string }[] = [
		{ value: 'hours', label: 'Horas' },
		{ value: 'minutes', label: 'Minutos' }
	];

	const hoursFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });

	const showsHoursEquivalent = $derived(budget.timeUnit === 'minutes' && budget.laborHours > 0);
	const hoursEquivalent = $derived(
		`${hoursFormat.format(budget.laborHours)} ${budget.laborHours === 1 ? 'hora' : 'horas'}`
	);
</script>

<div class="inputs">
	<div class="field">
		<label for="labor-time" class="field-label">
			{budget.isBatch ? 'Tiempo para todo el lote' : 'Tiempo por pieza'}
		</label>
		<div class="time-control">
			<NumberField
				id="labor-time"
				bind:value={budget.laborTime}
				suffix={TIME_UNIT_SUFFIX[budget.timeUnit]}
				aria-describedby={showsHoursEquivalent ? 'labor-time-hint' : undefined}
			/>
			<fieldset class="unit-switch">
				<legend class="sr-only">Unidad de tiempo</legend>
				{#each timeUnits as unit (unit.value)}
					<label>
						<input type="radio" name="time-unit" value={unit.value} bind:group={budget.timeUnit} />
						<span>{unit.label}</span>
					</label>
				{/each}
			</fieldset>
		</div>
		{#if showsHoursEquivalent}
			<p id="labor-time-hint" class="field-hint">
				Equivale a {hoursEquivalent}
			</p>
		{/if}
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
		grid-template-columns: minmax(0, 1fr);
		gap: 20px;
		align-items: start;
	}

	.time-control {
		display: flex;
		gap: 8px;
	}

	.time-control > :global(.number-control) {
		flex: 1;
	}

	.unit-switch {
		height: var(--control-height);
		flex: none;
		padding: 4px;
		border-radius: var(--radius-control);
		background: var(--color-brand-soft);
		display: flex;
		gap: 4px;
	}

	.unit-switch label {
		position: relative;
		display: flex;
	}

	.unit-switch input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.unit-switch span {
		padding: 0 12px;
		border-radius: 7px;
		color: var(--color-text-muted);
		display: grid;
		place-items: center;
		font-size: 14px;
		font-weight: 500;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}

	.unit-switch input:checked + span {
		background: var(--color-surface-raised);
		color: var(--color-brand-strong);
		box-shadow: var(--shadow-segment);
	}

	.unit-switch input:focus-visible + span {
		outline: 2px solid var(--color-brand-strong);
		outline-offset: 1px;
	}

	@media (min-width: 560px) {
		.inputs {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
			gap: 12px;
		}
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

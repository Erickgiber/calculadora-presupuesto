<script lang="ts">
	import type { Budget, InvestmentMode } from '#lib/budget.svelte.ts';
	import NumberField from '../NumberField.svelte';

	let { budget }: { budget: Budget } = $props();

	const modeOptions: { value: InvestmentMode; title: string; description: string }[] = [
		{
			value: 'unit',
			title: 'Una pieza a la vez',
			description: 'Registras lo que cuesta hacer una sola unidad.'
		},
		{
			value: 'batch',
			title: 'Por lote',
			description: 'Produces varias unidades juntas y dividimos los costos entre ellas.'
		}
	];
</script>

<div class="stack">
	<div class="field">
		<label for="project" class="field-label">
			Nombre del producto <span class="optional">(opcional)</span>
		</label>
		<input
			id="project"
			class="control"
			bind:value={budget.project}
			placeholder="Ej. Velas artesanales"
			autocomplete="off"
			autocapitalize="sentences"
			enterkeyhint="next"
		/>
	</div>

	<fieldset class="field">
		<legend class="field-label">¿Cómo lo produces?</legend>
		<div class="options">
			{#each modeOptions as option (option.value)}
				<label class="option">
					<input type="radio" name="mode" value={option.value} bind:group={budget.mode} />
					<span class="option-indicator" aria-hidden="true"></span>
					<span class="option-text">
						<strong>{option.title}</strong>
						<span>{option.description}</span>
					</span>
				</label>
			{/each}
		</div>
	</fieldset>

	{#if budget.isBatch}
		<div class="field batch-field">
			<label for="batch-size" class="field-label">¿Cuántas unidades produce el lote?</label>
			<NumberField
				id="batch-size"
				bind:value={budget.batchSize}
				min="1"
				inputmode="numeric"
				placeholder="1"
				suffix="uds."
			/>
		</div>
	{/if}
</div>

<style>
	.stack {
		display: grid;
		gap: 24px;
	}

	.optional {
		color: var(--color-text-subtle);
		font-weight: 400;
	}

	legend.field-label {
		margin-bottom: 8px;
	}

	.options {
		display: grid;
		gap: 10px;
	}

	.option {
		position: relative;
		padding: 16px;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-card);
		background: var(--color-surface);
		display: flex;
		align-items: flex-start;
		gap: 14px;
		cursor: pointer;
		transition:
			border-color 150ms ease,
			background-color 150ms ease,
			box-shadow 150ms ease;
	}

	.option:hover {
		border-color: var(--color-brand);
	}

	.option:has(input:checked) {
		border-color: var(--color-brand-strong);
		background: var(--color-brand-soft);
		box-shadow: inset 0 0 0 1px var(--color-brand-strong);
	}

	.option:has(input:focus-visible) {
		outline: 2px solid var(--color-brand-strong);
		outline-offset: 2px;
	}

	.option input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.option-indicator {
		width: 22px;
		height: 22px;
		flex: none;
		margin-top: 1px;
		border: 2px solid var(--color-border-strong);
		border-radius: var(--radius-pill);
		display: grid;
		place-items: center;
		transition: border-color 150ms ease;
	}

	.option-indicator::after {
		content: '';
		width: 10px;
		height: 10px;
		border-radius: var(--radius-pill);
		background: var(--color-brand-strong);
		transform: scale(0);
		transition: transform 150ms var(--ease-out);
	}

	.option:has(input:checked) .option-indicator {
		border-color: var(--color-brand-strong);
	}

	.option:has(input:checked) .option-indicator::after {
		transform: scale(1);
	}

	.option-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.option-text strong {
		font-size: 16px;
		font-weight: 600;
	}

	.option-text span {
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 1.45;
	}

	.batch-field {
		max-width: 320px;
		animation: reveal 200ms var(--ease-out);
	}

	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
</style>

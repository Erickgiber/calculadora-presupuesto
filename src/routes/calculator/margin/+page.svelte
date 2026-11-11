<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { MARGIN_PRESETS, MAX_MARGIN_PERCENT } from '#lib/calculation/draft.ts';
	import { validateMargin } from '#lib/calculation/validation.ts';
	import StepForm from '#lib/components/calculator/StepForm.svelte';
	import StepHeader from '#lib/components/calculator/StepHeader.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import ToggleChips from '#lib/components/ui/ToggleChips.svelte';
	import { parseNumber } from '#lib/format/number.ts';
	import { calculator } from '#lib/state/calculator.svelte.ts';

	const MARGIN_OPTIONS = MARGIN_PRESETS.map((percent) => ({
		value: percent,
		label: `${percent} %`
	}));

	const draft = $derived(calculator.draft);
	const selectedPreset = $derived(
		MARGIN_PRESETS.find((percent) => percent === parseNumber(draft.marginPercent))
	);
</script>

<Page>
	{#snippet intro()}
		<StepHeader
			step={4}
			backTo="/calculator/labor"
			titleLines={['Haz espacio', 'para tu ganancia.']}
			description="Incluye otros gastos y elige tu margen."
		/>
	{/snippet}

	<StepForm
		submitLabel="Calcular mi precio"
		validate={() => validateMargin(draft)}
		onvalid={() => goto(resolve('/calculator/result'))}
	>
		<FormField
			id="other-expenses"
			label={calculator.byProductionMode(
				`Otros gastos por unidad · ${draft.currency}`,
				`Otros gastos del lote · ${draft.currency}`
			)}
			help="Luz, transporte, comisiones o alquiler correspondiente a {calculator.byProductionMode(
				'una unidad',
				'todo el lote'
			)}."
			bind:value={draft.otherExpenses}
		/>
		<FormField
			id="margin-percent"
			label="Margen sobre el precio de venta · %"
			max={MAX_MARGIN_PERCENT}
			help="Elige un margen entre 0 y {MAX_MARGIN_PERCENT} %."
			bind:value={draft.marginPercent}
		/>
		<ToggleChips
			label="Márgenes sugeridos"
			options={MARGIN_OPTIONS}
			selected={selectedPreset}
			onselect={(percent) => (draft.marginPercent = String(percent))}
		/>
		<div class="card soft">
			<h2>¿Qué significa margen?</h2>
			<p>Con 30 % de margen, de cada $10 que vendes, $3 son ganancia.</p>
			<p class="small">Precio = costo total ÷ (1 − margen / 100).</p>
		</div>
	</StepForm>
</Page>

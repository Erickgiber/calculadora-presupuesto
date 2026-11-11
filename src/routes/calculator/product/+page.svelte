<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PRODUCTION_MODE_OPTIONS } from '#lib/calculation/draft.ts';
	import { validateProduct } from '#lib/calculation/validation.ts';
	import StepForm from '#lib/components/calculator/StepForm.svelte';
	import StepHeader from '#lib/components/calculator/StepHeader.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import ChoiceCards from '#lib/components/ui/ChoiceCards.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import { calculator } from '#lib/state/calculator.svelte.ts';

	const draft = $derived(calculator.draft);
</script>

<Page>
	{#snippet intro()}
		<StepHeader
			step={1}
			backTo="/"
			titleLines={['Cada producto', 'tiene su valor.']}
			description="Empecemos con lo que vas a vender."
		/>
	{/snippet}

	<StepForm
		submitLabel="Continuar a materiales"
		validate={() => validateProduct(draft)}
		onvalid={() => goto(resolve('/calculator/materials'))}
	>
		<FormField
			id="product"
			label="Nombre del producto"
			kind="text"
			placeholder="Ej. Vela aromática"
			bind:value={draft.product}
		/>
		<ChoiceCards
			legend="¿Cómo lo produces?"
			name="production-mode"
			options={PRODUCTION_MODE_OPTIONS}
			value={draft.productionMode}
			onchange={(mode) => (draft.productionMode = mode)}
		/>
		{#if calculator.isBatch}
			<FormField
				id="batch-units"
				label="¿Cuántas unidades produce el lote?"
				kind="integer"
				min={1}
				placeholder="Ej. 12"
				help="Dividiremos los costos del lote entre estas unidades."
				bind:value={draft.batchUnits}
			/>
		{/if}
	</StepForm>
</Page>

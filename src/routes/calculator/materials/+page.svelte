<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		createMaterialItem,
		isMaterialItemBlank,
		MATERIALS_MODE_OPTIONS,
		type MaterialsInputMode
	} from '#lib/calculation/draft.ts';
	import { validateMaterials } from '#lib/calculation/validation.ts';
	import MaterialsTable from '#lib/components/calculator/MaterialsTable.svelte';
	import StepForm from '#lib/components/calculator/StepForm.svelte';
	import StepHeader from '#lib/components/calculator/StepHeader.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import ToggleChips from '#lib/components/ui/ToggleChips.svelte';
	import { calculator } from '#lib/state/calculator.svelte.ts';

	const draft = $derived(calculator.draft);
	const batchContext = $derived(
		calculator.byProductionMode('', ` · Lote de ${calculator.units} uds.`)
	);

	let error = $state('');

	function selectMode(mode: MaterialsInputMode) {
		draft.materialsMode = mode;
		if (mode === 'detail' && !draft.materialItems.length) {
			draft.materialItems.push(createMaterialItem());
		}
	}

	function continueToLabor() {
		if (draft.materialsMode === 'detail') {
			draft.materialItems = draft.materialItems.filter((item) => !isMaterialItemBlank(item));
		}
		goto(resolve('/calculator/labor'));
	}
</script>

<Page>
	{#snippet intro()}
		<StepHeader
			step={2}
			backTo="/calculator/product"
			titleLines={calculator.byProductionMode(
				['¿Cuánto cuesta', 'crear una unidad?'],
				['¿Cuánto cuesta', 'producir el lote?']
			)}
			description="Incluye la materia prima y el empaque."
			context={draft.product + batchContext}
		/>
	{/snippet}

	<StepForm
		submitLabel="Continuar a mi trabajo"
		validate={() => validateMaterials(draft)}
		onvalid={continueToLabor}
		bind:error
	>
		<ToggleChips
			label="Cómo ingresar los materiales"
			options={MATERIALS_MODE_OPTIONS}
			selected={draft.materialsMode}
			onselect={selectMode}
		/>
		{#if draft.materialsMode === 'detail'}
			<MaterialsTable
				bind:items={draft.materialItems}
				currency={draft.currency}
				isBatch={calculator.isBatch}
				onerror={(message) => (error = message)}
			/>
		{:else}
			<FormField
				id="materials-total"
				label="Total gastado en materiales y empaque · {draft.currency}"
				placeholder="0,00"
				help={calculator.byProductionMode(
					'Ingresa el total correspondiente a una unidad de tu producto.',
					'Ingresa el total que gastas para producir todo el lote.'
				)}
				bind:value={draft.materialsTotal}
			/>
		{/if}
		<div class="card">
			<h2>Cuenta solo lo que usas</h2>
			<p>
				{calculator.byProductionMode(
					'Si una compra alcanza para varias unidades, incluye aquí el costo de la parte que usas en una sola.',
					`Anota lo que compras para todo el lote; dividiremos el total entre sus ${calculator.units} unidades.`
				)}
				Tu tiempo y los servicios van en los siguientes pasos.
			</p>
		</div>
	</StepForm>
</Page>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { validateLabor } from '#lib/calculation/validation.ts';
	import StepForm from '#lib/components/calculator/StepForm.svelte';
	import StepHeader from '#lib/components/calculator/StepHeader.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import { calculator } from '#lib/state/calculator.svelte.ts';

	const draft = $derived(calculator.draft);
</script>

<Page>
	{#snippet intro()}
		<StepHeader
			step={3}
			backTo="/calculator/materials"
			titleLines={['Tu tiempo', 'también cuenta.']}
			description="Dale un valor a las horas que dedicas."
		/>
	{/snippet}

	<StepForm
		submitLabel="Continuar a mi ganancia"
		validate={() => validateLabor(draft)}
		onvalid={() => goto(resolve('/calculator/margin'))}
	>
		<FormField
			id="labor-hours"
			label={calculator.byProductionMode('Horas por unidad', 'Horas para todo el lote')}
			max={1000}
			placeholder="0,50"
			help="30 minutos = 0,50 horas. Puedes ingresar cero."
			bind:value={draft.laborHours}
		/>
		<FormField
			id="hourly-rate"
			label="Valor de tu hora · {draft.currency}"
			max={10000}
			placeholder="4,00"
			bind:value={draft.hourlyRate}
		/>
		<div class="card soft">
			<h2>Tu esfuerzo es parte del precio</h2>
			<p>
				Multiplicaremos las horas por el valor de tu hora para incluir tu trabajo{calculator.byProductionMode(
					'',
					` y lo dividiremos entre las ${calculator.units} unidades del lote`
				)}.
			</p>
		</div>
	</StepForm>
</Page>

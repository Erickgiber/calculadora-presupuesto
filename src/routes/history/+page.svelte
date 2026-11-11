<script lang="ts">
	import SavedCalculationCard from '#lib/components/account/SavedCalculationCard.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { openSavedCalculation, startNewCalculation } from '#lib/navigation.ts';
	import { history } from '#lib/state/history.svelte.ts';
	import type { SavedCalculation } from '#lib/storage/saved-calculations.ts';

	const DELETE_ERROR = 'No se pudieron borrar los cálculos. Intenta de nuevo.';
	const IRREVERSIBLE_NOTICE = 'Esta acción no se puede deshacer.';

	let status = $state('');

	const count = $derived(history.items.length);
	const summary = $derived(
		count
			? `${count} cálculo${count === 1 ? '' : 's'} guardado${count === 1 ? '' : 's'} en este navegador.`
			: 'Aquí aparecerán los cálculos que guardes.'
	);

	function deleteCalculation(calculation: SavedCalculation) {
		const question = `¿Borrar el cálculo «${calculation.draft.product}»? ${IRREVERSIBLE_NOTICE}`;
		if (confirm(question) && !history.remove(calculation.id)) status = DELETE_ERROR;
	}

	function deleteAll() {
		const question = `¿Borrar todos tus cálculos guardados? ${IRREVERSIBLE_NOTICE}`;
		if (confirm(question) && !history.clear()) status = DELETE_ERROR;
	}
</script>

<Page layout="stacked">
	{#snippet intro()}
		<BackLink to="/" label="Inicio" />
		<h1>Mis cálculos</h1>
		<p>{summary}</p>
	{/snippet}

	<div class="card-grid">
		{#each history.items as calculation (calculation.id)}
			<SavedCalculationCard
				{calculation}
				onopen={() => openSavedCalculation(calculation)}
				ondelete={() => deleteCalculation(calculation)}
			/>
		{/each}
	</div>
	<div class="history-actions">
		{#if count}
			<Button variant="danger" onclick={deleteAll}>Borrar todos los cálculos</Button>
		{:else}
			<Button onclick={startNewCalculation}>Crear mi primer cálculo</Button>
		{/if}
	</div>
	<StatusMessage message={status} onBackground />
</Page>

<style>
	.history-actions {
		max-width: 420px;
		margin-top: 20px;
	}
</style>

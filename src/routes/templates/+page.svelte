<script lang="ts">
	import TemplateCard from '#lib/components/account/TemplateCard.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { PREFERENCES_SAVE_ERROR, preferences } from '#lib/state/preferences.svelte.ts';
	import { VISUAL_TEMPLATES, type VisualTemplateId } from '#lib/theme/visual-templates.ts';

	let status = $state('');

	function selectTemplate(templateId: VisualTemplateId) {
		status = preferences.update({ templateId })
			? 'Diseño aplicado. Tus cálculos se conservan.'
			: PREFERENCES_SAVE_ERROR;
	}
</script>

<Page layout="stacked">
	{#snippet intro()}
		<BackLink to="/" label="Inicio" />
		<h1>Elige tu estilo</h1>
		<p>
			Personaliza los colores y el fondo de toda tu app. Puedes combinar cada diseño con el modo
			claro u oscuro.
		</p>
	{/snippet}

	<div class="card-grid">
		{#each VISUAL_TEMPLATES as template (template.id)}
			<TemplateCard
				{template}
				isSelected={preferences.current.templateId === template.id}
				onselect={() => selectTemplate(template.id)}
			/>
		{/each}
	</div>
	<StatusMessage message={status} onBackground />
</Page>

<script lang="ts">
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
	import ChoiceCards from '#lib/components/ui/ChoiceCards.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { PREFERENCES_SAVE_ERROR, preferences } from '#lib/state/preferences.svelte.ts';
	import { COLOR_MODES, type ColorMode } from '#lib/theme/color-mode.ts';

	let status = $state('');

	function selectColorMode(colorMode: ColorMode) {
		status = preferences.update({ colorMode }) ? 'Apariencia guardada.' : PREFERENCES_SAVE_ERROR;
	}
</script>

<Page>
	{#snippet intro()}
		<BackLink to="/" label="Inicio" />
		<h1>A tu manera</h1>
		<p>Elige cómo quieres ver Margen.</p>
	{/snippet}

	<div class="surface-form">
		<ChoiceCards
			legend="Modo de apariencia"
			name="color-mode"
			options={COLOR_MODES}
			value={preferences.current.colorMode}
			onchange={selectColorMode}
		/>
		<p class="help">El cambio se aplica al seleccionarlo y se guarda para tu próxima visita.</p>
		<StatusMessage message={status} />
	</div>
</Page>

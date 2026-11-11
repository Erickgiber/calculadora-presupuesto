<script lang="ts">
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { PREFERENCES_SAVE_ERROR, preferences } from '#lib/state/preferences.svelte.ts';

	let name = $state(preferences.current.name);
	let business = $state(preferences.current.business);
	let status = $state('');

	function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		const changes = { name: name.trim(), business: business.trim() };
		status = preferences.update(changes) ? 'Perfil guardado.' : PREFERENCES_SAVE_ERROR;
	}
</script>

<Page>
	{#snippet intro()}
		<BackLink to="/" label="Inicio" />
		<h1>Tu perfil</h1>
		<p>Personaliza tu espacio de trabajo.</p>
	{/snippet}

	<form class="surface-form" onsubmit={saveProfile}>
		<FormField
			id="profile-name"
			label="Tu nombre"
			kind="text"
			autocomplete="given-name"
			placeholder="¿Cómo te llamas?"
			required={false}
			bind:value={name}
		/>
		<FormField
			id="profile-business"
			label="Nombre de tu emprendimiento"
			kind="text"
			autocomplete="organization"
			maxlength={80}
			placeholder="Tu emprendimiento"
			required={false}
			bind:value={business}
		/>
		<p class="help">Este perfil se guarda solo en este navegador. No crea una cuenta en línea.</p>
		<Button type="submit">Guardar perfil</Button>
		<StatusMessage message={status} />
	</form>
</Page>

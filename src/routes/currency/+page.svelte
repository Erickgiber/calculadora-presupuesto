<script lang="ts">
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { CURRENCIES, type CurrencyCode } from '#lib/format/money.ts';
	import { PREFERENCES_SAVE_ERROR, preferences } from '#lib/state/preferences.svelte.ts';

	const currencyOptions = Object.entries(CURRENCIES) as [CurrencyCode, string][];

	let currency = $state(preferences.current.currency);
	let status = $state('');

	function saveCurrency(event: SubmitEvent) {
		event.preventDefault();
		status = preferences.update({ currency })
			? 'Moneda guardada. Se usará en tu próximo cálculo.'
			: PREFERENCES_SAVE_ERROR;
	}
</script>

<Page>
	{#snippet intro()}
		<BackLink to="/" label="Inicio" />
		<h1>Tu moneda</h1>
		<p>Elige la moneda para tus próximos cálculos.</p>
	{/snippet}

	<form class="surface-form" onsubmit={saveCurrency}>
		<label for="currency-select">Moneda de trabajo</label>
		<select id="currency-select" bind:value={currency}>
			{#each currencyOptions as [code, name] (code)}
				<option value={code}>{code} · {name}</option>
			{/each}
		</select>
		<p class="help">
			Se aplicará al iniciar un nuevo cálculo. El cálculo actual y los guardados conservan su
			moneda. No hacemos conversiones de tipo de cambio.
		</p>
		<Button type="submit">Guardar moneda</Button>
		<StatusMessage message={status} />
	</form>
</Page>

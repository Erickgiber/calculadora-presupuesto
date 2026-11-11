<script lang="ts">
	import Page from '#lib/components/layout/Page.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { formatMoney } from '#lib/format/money.ts';
	import { startNewCalculation } from '#lib/navigation.ts';
	import { calculator } from '#lib/state/calculator.svelte.ts';
</script>

<Page>
	{#snippet intro()}
		<span class="badge">✓ Cálculo guardado</span>
		<h1>Listo para vender<br />con confianza.</h1>
		<p>Tu cálculo se guardó en este navegador.</p>
	{/snippet}

	<div class="card soft">
		<h2>{calculator.draft.product}</h2>
		<p>Precio por unidad</p>
		<div class="money">{formatMoney(calculator.pricing.price, calculator.draft.currency)}</div>
	</div>
	<div class="button-stack">
		<Button to="/">Volver al inicio</Button>
		<Button variant="secondary" onclick={startNewCalculation}>Calcular otro producto</Button>
	</div>
	<p class="help page-note">Puedes abrir de nuevo el último desglose desde Inicio.</p>
</Page>

<style>
	.badge {
		display: inline-block;
		padding: 7px 12px;
		border-radius: 40px;
		background: var(--app-success-soft);
		color: var(--app-success);
		font-size: 12px;
	}
</style>

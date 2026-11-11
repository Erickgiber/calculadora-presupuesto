<script lang="ts">
	import { calculatePrice } from '#lib/calculation/pricing.ts';
	import Page from '#lib/components/layout/Page.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { formatMoney } from '#lib/format/money.ts';
	import { openSavedCalculation, startNewCalculation } from '#lib/navigation.ts';
	import { history } from '#lib/state/history.svelte.ts';

	const latest = $derived(history.latest);
	const latestPricing = $derived(latest && calculatePrice(latest.draft));
</script>

<Page>
	{#snippet intro()}
		<div class="eyebrow">HECHO PARA TU EMPRENDIMIENTO</div>
		<h1>Tu próximo precio,<br />con margen.</h1>
		<p>Recupera lo que inviertes, valora tu trabajo y gana lo que mereces.</p>
		<div class="card soft">
			<h2>Un precio justo empieza aquí</h2>
			<p>
				Suma tus materiales, tu tiempo y la ganancia que quieres obtener. Nosotros hacemos las
				cuentas.
			</p>
			<div class="button-stack">
				<Button onclick={startNewCalculation}>Calcular precio de venta</Button>
				<Button variant="secondary" to="/templates">Explorar plantillas</Button>
			</div>
		</div>
	{/snippet}

	{#if latest && latestPricing}
		<h2>Retoma donde lo dejaste</h2>
		<div class="card">
			<div class="eyebrow">TU ÚLTIMO CÁLCULO</div>
			<h2>{latest.draft.product}</h2>
			<p>Precio de venta sugerido</p>
			<div class="money">{formatMoney(latestPricing.price, latest.draft.currency)}</div>
			<p class="small">
				Costo: {formatMoney(latestPricing.totalCost, latest.draft.currency)} · Margen: {latest.draft
					.marginPercent} %
			</p>
			<Button variant="secondary" onclick={() => openSavedCalculation(latest)}>Ver desglose</Button>
		</div>
	{:else}
		<div class="card">
			<h2>Tu primer cálculo te espera</h2>
			<p>Empieza con un producto. Al guardar su cálculo aparecerá aquí.</p>
		</div>
	{/if}
	<h2>Tu tiempo también tiene valor</h2>
	<p>Incluye las horas de trabajo en cada producto. Tu esfuerzo es parte del precio.</p>
	<p class="footer">CRECE A TU RITMO. VENDE CON CONFIANZA.</p>
</Page>

<style>
	.card {
		box-shadow: 0 4px 20px #291c4008;
	}

	.footer {
		margin-top: 30px;
		font-size: 10px;
		letter-spacing: 0.6px;
	}
</style>

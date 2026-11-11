<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PriceBreakdown from '#lib/components/calculator/PriceBreakdown.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { formatMoney } from '#lib/format/money.ts';
	import { parseNumber, roundToCents } from '#lib/format/number.ts';
	import { calculator } from '#lib/state/calculator.svelte.ts';

	const draft = $derived(calculator.draft);
	const pricing = $derived(calculator.pricing);
	const units = $derived(pricing.units);

	function money(amount: number) {
		return formatMoney(amount, draft.currency);
	}

	function saveCalculation() {
		if (calculator.save()) {
			goto(resolve('/calculator/saved'));
			return;
		}
		alert(
			'Este navegador no permite guardar datos locales. El cálculo sigue disponible en esta sesión.'
		);
	}
</script>

<Page>
	{#snippet intro()}
		<BackLink to="/calculator/margin" label="Editar gastos y ganancia" />
		<h1>Un precio justo.<br />Una ganancia clara.</h1>
		<p>
			{calculator.byProductionMode(
				'Este es el precio sugerido para una unidad.',
				`Este es el precio sugerido por unidad de un lote de ${units} uds.`
			)}
		</p>
	{/snippet}

	<div class="card soft">
		<h2>{draft.product}</h2>
		<div class="eyebrow">PRECIO DE VENTA · {draft.currency}</div>
		<div class="money">{money(pricing.price)}</div>
		<p class="small">Margen elegido: {draft.marginPercent} % · Redondeado a centavos</p>
		{#if calculator.isBatch}
			<p class="small">Lote de {units} uds.: {money(roundToCents(pricing.price * units))}</p>
		{/if}
	</div>
	<div class="card">
		<h2>Así se forma tu precio</h2>
		<PriceBreakdown {pricing} currency={draft.currency} />
		<p class="small">
			Tu trabajo: {draft.laborHours} h × {money(
				parseNumber(draft.hourlyRate)
			)}/h{calculator.byProductionMode('', ` ÷ ${units} uds`)}.
		</p>
		{#if calculator.isBatch}
			<p class="small">
				Si vendes las {units} unidades del lote, ganas {money(roundToCents(pricing.profit * units))} en
				total.
			</p>
		{/if}
	</div>
	<div class="button-stack">
		<Button onclick={saveCalculation}>Guardar cálculo</Button>
		<Button variant="secondary" to="/calculator/product">Editar todos los datos</Button>
	</div>
	<p class="help page-note">
		El precio no incluye impuestos. Si tienes comisiones sobre ventas, inclúyelas en tu análisis.
	</p>
</Page>

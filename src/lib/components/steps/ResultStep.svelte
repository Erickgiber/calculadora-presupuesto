<script lang="ts">
	import { resolve } from '$app/paths';
	import { money, type Budget } from '#lib/budget.svelte.ts';
	import PriceBreakdown from '../PriceBreakdown.svelte';

	type Props = {
		budget: Budget;
		savedToHistory: boolean;
		onEdit: (stepIndex: number) => void;
	};

	let { budget, savedToHistory, onEdit }: Props = $props();

	const calculation = $derived(budget.calculation);

	const filledMaterials = $derived(
		budget.materials.filter((item) => Number(item.quantity) > 0 && Number(item.price) > 0).length
	);

	const reviewItems = $derived([
		{
			label: 'Producto',
			value: `${budget.project.trim() || 'Sin nombre'} · ${
				budget.isBatch ? `lote de ${calculation.units} uds.` : 'una pieza'
			}`
		},
		{
			label: 'Materiales',
			value: `${filledMaterials} ${filledMaterials === 1 ? 'material' : 'materiales'} · ${money.format(
				calculation.materialsTotal
			)}`
		},
		{
			label: 'Mano de obra',
			value: `${budget.laborTimeLabel} × ${money.format(Number(budget.hourlyRate) || 0)}/h`
		},
		{ label: 'Ganancia', value: `${calculation.profitRate}% sobre tu inversión` }
	]);
</script>

<section class="hero" aria-label="Precio sugerido">
	{#if budget.project.trim()}
		<p class="project">{budget.project}</p>
	{/if}
	<p class="price">{money.format(calculation.total)}</p>
	<p class="unit">por unidad</p>
	{#if budget.isBatch}
		<p class="batch">
			Lote de {calculation.units} uds.:
			<strong>{money.format(calculation.total * calculation.units)}</strong>
		</p>
	{/if}
</section>

{#if savedToHistory}
	<a class="saved-note" href={resolve('/historial')}>
		<svg viewBox="0 0 20 20" aria-hidden="true">
			<path d="M4.5 10.5l3.5 3.5 7.5-8" />
		</svg>
		<span>Guardado en tu historial</span>
		<span class="saved-link">Ver historial</span>
	</a>
{/if}

<section class="card panel" aria-labelledby="composition-title">
	<h2 id="composition-title" class="panel-title">Así se forma tu precio</h2>
	<PriceBreakdown {calculation} />
</section>

<section class="card panel" aria-labelledby="insights-title">
	<h2 id="insights-title" class="panel-title">Qué significa</h2>
	<ul class="insights">
		<li>
			Con cada venta recuperas <strong>{money.format(calculation.investment)}</strong> de lo que invertiste.
		</li>
		<li>
			Te quedan <strong class="profit">{money.format(calculation.profit)}</strong> de ganancia por unidad.
		</li>
		{#if budget.isBatch}
			<li>
				Si vendes las {calculation.units} unidades del lote, ganas
				<strong class="profit">{money.format(calculation.profit * calculation.units)}</strong> en total.
			</li>
		{/if}
	</ul>
</section>

<section class="card review" aria-labelledby="review-title">
	<h2 id="review-title" class="panel-title">Tus datos</h2>
	<ul>
		{#each reviewItems as item, index (item.label)}
			<li>
				<button type="button" onclick={() => onEdit(index)}>
					<span class="review-text">
						<span class="review-label">{item.label}</span>
						<span class="review-value">{item.value}</span>
					</span>
					<span class="review-action">Editar</span>
				</button>
			</li>
		{/each}
	</ul>
</section>

<style>
	.hero {
		padding: 24px;
		border-radius: var(--radius-card);
		background: var(--color-brand-surface);
		color: var(--color-on-brand);
		animation: pop 320ms var(--ease-out);
	}

	.project {
		color: var(--color-brand-contrast);
		font-size: 15px;
		font-weight: 500;
		overflow-wrap: anywhere;
	}

	.price {
		margin-top: 4px;
		font-family: var(--font-display);
		font-size: clamp(44px, 12vw, 56px);
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1;
		overflow-wrap: anywhere;
	}

	.unit {
		margin-top: 6px;
		color: var(--color-brand-contrast);
		font-size: 15px;
	}

	.batch {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		color: var(--color-brand-contrast);
		font-size: 15px;
	}

	.batch strong {
		color: var(--color-on-brand);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.saved-note {
		margin-top: 12px;
		padding: 10px 14px;
		border-radius: var(--radius-control);
		background: var(--color-surface-muted);
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		text-decoration: none;
		animation: fade 300ms ease;
	}

	.saved-note svg {
		width: 18px;
		height: 18px;
		flex: none;
		fill: none;
		stroke: var(--color-profit);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
	}

	.saved-link {
		margin-left: auto;
		color: var(--color-brand-strong);
		font-weight: 600;
	}

	.saved-note:hover .saved-link {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.panel,
	.review {
		margin-top: 16px;
	}

	.panel {
		padding: 20px;
	}

	.panel-title {
		margin-bottom: 12px;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 500;
	}

	.insights {
		display: grid;
		gap: 10px;
		color: var(--color-text-muted);
		font-size: 15px;
		line-height: 1.5;
	}

	.insights li {
		padding-left: 18px;
		position: relative;
	}

	.insights li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.6em;
		width: 6px;
		height: 6px;
		border-radius: var(--radius-pill);
		background: var(--color-brand);
	}

	.insights strong {
		color: var(--color-text);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.insights .profit {
		color: var(--color-profit);
	}

	.review {
		overflow: hidden;
	}

	.review .panel-title {
		margin: 0;
		padding: 20px 20px 8px;
	}

	.review li + li {
		border-top: 1px solid var(--color-border);
	}

	.review button {
		width: 100%;
		min-height: 64px;
		padding: 12px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		text-align: left;
		transition: background-color 150ms ease;
	}

	.review button:hover {
		background: var(--color-surface-muted);
	}

	.review button:active {
		background: var(--color-brand-soft);
	}

	.review-text {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.review-label {
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.review-value {
		font-size: 15px;
		font-weight: 500;
		overflow-wrap: anywhere;
	}

	.review-action {
		flex: none;
		color: var(--color-brand-strong);
		font-size: 14px;
		font-weight: 600;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
	}
</style>

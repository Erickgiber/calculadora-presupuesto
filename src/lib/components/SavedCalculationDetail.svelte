<script lang="ts">
	import { Budget, materialSubtotal, money } from '#lib/budget.svelte.ts';
	import type { SavedCalculation } from '#lib/calculation-history.ts';
	import PriceBreakdown from './PriceBreakdown.svelte';

	type Props = {
		calculation: SavedCalculation;
		savedAtLabel: string;
		titleId: string;
		onEdit: () => void;
		onShare: () => void;
		onDelete: () => void;
	};

	let { calculation, savedAtLabel, titleId, onEdit, onShare, onDelete }: Props = $props();

	const budget = $derived(new Budget(calculation.draft));
	const usedMaterials = $derived(budget.materials.filter((item) => materialSubtotal(item) > 0));
</script>

<p class="saved-at">{savedAtLabel}</p>
<h2 id={titleId} class="title">{budget.project.trim() || 'Sin nombre'}</h2>
<p class="price">
	{money.format(budget.calculation.total)}
	<span>por unidad</span>
</p>
{#if budget.isBatch}
	<p class="batch">
		Lote de {budget.calculation.units} uds.:
		<strong>{money.format(budget.calculation.total * budget.calculation.units)}</strong>
	</p>
{/if}

<section class="section" aria-label="Composición del precio">
	<PriceBreakdown calculation={budget.calculation} />
</section>

<section class="section">
	<h3>Materiales</h3>
	{#if usedMaterials.length}
		<ul class="lines">
			{#each usedMaterials as item (item.id)}
				<li>
					<span>
						{item.name || 'Material sin nombre'}
						<small>{item.quantity} × {money.format(Number(item.price))}</small>
					</span>
					<strong>{money.format(materialSubtotal(item))}</strong>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="muted">Sin materiales registrados.</p>
	{/if}
</section>

<section class="section">
	<h3>Mano de obra</h3>
	<ul class="lines">
		<li>
			<span>
				{budget.laborTimeLabel}
				<small>{money.format(Number(budget.hourlyRate) || 0)} por hora</small>
			</span>
			<strong>{money.format(budget.laborHours * (Number(budget.hourlyRate) || 0))}</strong>
		</li>
	</ul>
</section>

<div class="actions">
	<button type="button" class="button button-primary" onclick={onEdit}>
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />
		</svg>
		Editar en la calculadora
	</button>
	<div class="secondary-actions">
		<button type="button" class="button button-secondary" onclick={onShare}>Compartir</button>
		<button type="button" class="button delete-button" onclick={onDelete}>Eliminar</button>
	</div>
</div>

<style>
	.saved-at {
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.title {
		margin-top: 2px;
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 500;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.price {
		margin-top: 8px;
		color: var(--color-brand-strong);
		font-family: var(--font-display);
		font-size: 36px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.price span {
		color: var(--color-text-muted);
		font-family: var(--font-body);
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 0;
	}

	.batch {
		margin-top: 4px;
		color: var(--color-text-muted);
		font-size: 14px;
	}

	.batch strong {
		color: var(--color-text);
		font-variant-numeric: tabular-nums;
	}

	.section {
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid var(--color-border);
	}

	h3 {
		margin-bottom: 8px;
		font-size: 15px;
		font-weight: 600;
	}

	.lines {
		display: grid;
		gap: 10px;
	}

	.lines li {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		font-size: 15px;
	}

	.lines span {
		min-width: 0;
		display: flex;
		flex-direction: column;
		overflow-wrap: anywhere;
	}

	.lines small {
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.lines strong {
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		white-space: nowrap;
	}

	.muted {
		color: var(--color-text-muted);
		font-size: 14px;
	}

	.actions {
		margin-top: 24px;
		display: grid;
		gap: 10px;
	}

	.secondary-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.delete-button {
		color: var(--color-danger);
	}

	.delete-button:hover {
		background: var(--color-danger-soft);
	}
</style>

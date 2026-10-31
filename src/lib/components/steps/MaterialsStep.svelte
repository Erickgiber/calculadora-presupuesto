<script lang="ts">
	import { tick } from 'svelte';
	import { materialSubtotal, money, type Budget, type Material } from '#lib/budget.svelte.ts';
	import NumberField from '../NumberField.svelte';

	let { budget }: { budget: Budget } = $props();

	async function addMaterial() {
		const id = budget.addMaterial();
		await tick();
		document.getElementById(materialNameId(id))?.focus();
	}

	function materialNameId(id: number) {
		return `material-name-${id}`;
	}

	function materialLabel(material: Material, index: number) {
		return material.name || `material ${index + 1}`;
	}
</script>

<ul class="materials">
	{#each budget.materials as item, index (item.id)}
		<li class="material card">
			<div class="material-name">
				<input
					id={materialNameId(item.id)}
					class="control"
					bind:value={item.name}
					placeholder="Ej. Cera de soya"
					aria-label={`Material ${index + 1}`}
					autocomplete="off"
					autocapitalize="sentences"
					enterkeyhint="next"
				/>
				<button
					type="button"
					class="icon-button remove-button"
					onclick={() => budget.removeMaterial(item.id)}
					aria-label={`Eliminar ${materialLabel(item, index)}`}
					title={budget.materials.length === 1
						? 'Necesitas al menos un material'
						: 'Eliminar material'}
					disabled={budget.materials.length === 1}
				>
					<svg viewBox="0 0 20 20" aria-hidden="true">
						<path d="M4 6h12M8 6V4.5h4V6M6 6l.7 9.5h6.6L14 6" />
					</svg>
				</button>
			</div>
			<div class="material-values">
				<div class="field">
					<span class="cell-label" aria-hidden="true">Cantidad</span>
					<NumberField
						bind:value={item.quantity}
						aria-label={`Cantidad de ${materialLabel(item, index)}`}
					/>
				</div>
				<div class="field">
					<span class="cell-label" aria-hidden="true">Precio unitario</span>
					<NumberField
						bind:value={item.price}
						aria-label={`Precio de ${materialLabel(item, index)}`}
						placeholder="0.00"
						prefix="$"
					/>
				</div>
				<p class="subtotal">
					<span>Subtotal</span>
					<output aria-label={`Subtotal de ${materialLabel(item, index)}`}>
						{money.format(materialSubtotal(item))}
					</output>
				</p>
			</div>
		</li>
	{/each}
</ul>

<button type="button" class="add-button" onclick={addMaterial}>
	<svg viewBox="0 0 20 20" aria-hidden="true">
		<path d="M10 4v12M4 10h12" />
	</svg>
	Agregar material
</button>

<div class="total">
	<span>{budget.isBatch ? 'Total del lote' : 'Total de materiales'}</span>
	<strong>{money.format(budget.calculation.materialsTotal)}</strong>
</div>
<p class="field-hint">¿Tu producto no lleva materiales? Puedes continuar sin agregarlos.</p>

<style>
	.materials {
		display: grid;
		gap: 12px;
	}

	.material {
		padding: 14px;
		display: grid;
		gap: 12px;
		animation: reveal 200ms var(--ease-out);
	}

	.material-name {
		display: flex;
		gap: 6px;
	}

	.remove-button:hover:not(:disabled) {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.material-values {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1fr);
		gap: 10px;
		align-items: end;
	}

	.cell-label {
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.subtotal {
		height: var(--control-height);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.subtotal output {
		color: var(--color-text);
		font-size: 16px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		overflow-wrap: anywhere;
	}

	.add-button {
		width: 100%;
		min-height: 52px;
		margin-top: 12px;
		border: 1.5px dashed var(--color-border-strong);
		border-radius: var(--radius-card);
		color: var(--color-brand-strong);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-size: 15px;
		font-weight: 600;
		transition:
			border-color 150ms ease,
			background-color 150ms ease;
	}

	.add-button:hover {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}

	.add-button svg {
		width: 20px;
		height: 20px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-width: 1.8;
	}

	.total {
		margin-top: 20px;
		padding: 14px 16px;
		border-radius: var(--radius-control);
		background: var(--color-surface-muted);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		color: var(--color-text-muted);
		font-size: 15px;
	}

	.total strong {
		color: var(--color-text);
		font-size: 18px;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.field-hint {
		margin-top: 10px;
	}

	@media (max-width: 420px) {
		.material-values {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		}

		.subtotal {
			grid-column: 1 / -1;
			height: auto;
			flex-direction: row;
			justify-content: space-between;
			align-items: baseline;
		}
	}

	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
</style>

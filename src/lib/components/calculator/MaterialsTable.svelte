<script lang="ts">
	import { tick } from 'svelte';
	import {
		createMaterialItem,
		isMaterialItemIncomplete,
		type MaterialItem
	} from '#lib/calculation/draft.ts';
	import { materialItemsTotal } from '#lib/calculation/pricing.ts';
	import { isMaterialItemComplete } from '#lib/calculation/validation.ts';
	import ValueRow from '#lib/components/ui/ValueRow.svelte';
	import { formatMoney, type CurrencyCode } from '#lib/format/money.ts';

	type ItemField = keyof MaterialItem;

	const FIELD_ORDER: readonly ItemField[] = ['name', 'quantity', 'price'];

	interface Props {
		items: MaterialItem[];
		currency: CurrencyCode;
		isBatch: boolean;
		onerror: (message: string) => void;
	}

	let { items = $bindable(), currency, isBatch, onerror }: Props = $props();

	const total = $derived(materialItemsTotal(items));
	const usageScope = $derived(isBatch ? 'todo el lote' : 'una unidad');
	const tableScope = $derived(isBatch ? 'el lote' : 'una unidad');
	const priceLabel = $derived(`Precio · ${currency}`);

	function fieldId(index: number, field: ItemField) {
		return `material-${field}-${index}`;
	}

	async function focusField(index: number, field: ItemField) {
		await tick();
		const input = document.getElementById(fieldId(index, field));
		input?.focus();
		return input;
	}

	function handleEnter(event: KeyboardEvent, index: number, field: ItemField) {
		if (event.key !== 'Enter' || event.isComposing) return;
		event.preventDefault();
		const nextField = FIELD_ORDER[FIELD_ORDER.indexOf(field) + 1];
		if (nextField) {
			focusField(index, nextField);
			return;
		}
		if (!isMaterialItemComplete(items[index])) {
			onerror('Completa el nombre, la cantidad y el precio antes de agregar otro producto.');
			return;
		}
		const input = event.currentTarget as HTMLInputElement;
		if (!input.checkValidity()) {
			input.reportValidity();
			return;
		}
		if (index === items.length - 1) items.push(createMaterialItem());
		focusField(index + 1, 'name');
	}

	async function addItem() {
		let index = items.findIndex(isMaterialItemIncomplete);
		if (index < 0) {
			items.push(createMaterialItem());
			index = items.length - 1;
		}
		const input = await focusField(index, 'name');
		input?.scrollIntoView({ block: 'center', behavior: 'smooth' });
	}

	function removeItem(index: number) {
		items.splice(index, 1);
	}
</script>

<p class="help">
	Agrega el nombre y el costo de cada material o producto que utilizas en {usageScope}.
</p>
<div class="materials-card">
	<div class="table-title">
		<strong>Materiales para {tableScope}</strong>
		<p>Registra lo que utilizas en {usageScope}.</p>
	</div>
	<table>
		<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">Producto</th>
				<th scope="col">Cantidad</th>
				<th scope="col">{priceLabel}</th>
				<th scope="col"><span class="sr-only">Acciones</span></th>
			</tr>
		</thead>
		<tbody>
			{#each items as item, index (index)}
				<tr>
					<th scope="row">{index + 1}</th>
					<td>
						<input
							id={fieldId(index, 'name')}
							aria-label="Producto {index + 1}"
							type="text"
							maxlength="80"
							enterkeyhint="next"
							placeholder="Producto"
							bind:value={item.name}
							onkeydown={(event) => handleEnter(event, index, 'name')}
						/>
					</td>
					<td data-label="Cantidad">
						<input
							id={fieldId(index, 'quantity')}
							aria-label="Cantidad del producto {index + 1}"
							type="number"
							inputmode="decimal"
							min="0.001"
							max="100000"
							step="any"
							enterkeyhint="next"
							placeholder="1"
							value={item.quantity}
							oninput={(event) => (item.quantity = event.currentTarget.value)}
							onkeydown={(event) => handleEnter(event, index, 'quantity')}
						/>
					</td>
					<td data-label={priceLabel}>
						<input
							id={fieldId(index, 'price')}
							aria-label="Precio unitario del producto {index + 1} en {currency}"
							type="number"
							inputmode="decimal"
							min="0.01"
							max="100000"
							step="0.01"
							enterkeyhint="done"
							placeholder="0,00"
							value={item.price}
							oninput={(event) => (item.price = event.currentTarget.value)}
							onkeydown={(event) => handleEnter(event, index, 'price')}
						/>
					</td>
					<td>
						<button
							type="button"
							class="remove-item"
							aria-label="Eliminar producto {index + 1}"
							onclick={() => removeItem(index)}
						>
							×
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<p class="table-help">Cantidad utilizada × precio de compra en la misma unidad.</p>
	<div class="material-add">
		<button type="button" class="add-item" onclick={addItem}>
			<span aria-hidden="true">＋</span> Otro producto
		</button>
		<span class="add-hint">También puedes usar Enter</span>
	</div>
</div>
<div aria-live="polite">
	<ValueRow label="Total de materiales" value={formatMoney(total, currency)} variant="highlight" />
</div>

<style>
	.materials-card {
		margin-top: 20px;
		overflow: hidden;
		border: 1px solid var(--app-line);
		border-radius: var(--radius-lg);
		background: var(--app-surface);
	}

	.table-title {
		padding: 16px 12px 8px;
	}

	.table-title strong {
		font-size: 17px;
		font-weight: 500;
	}

	.table-title p {
		margin: 4px 0 0;
		font-size: 12px;
	}

	table {
		display: block;
		width: 100%;
		border-collapse: collapse;
		color: var(--app-text);
	}

	thead {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	tbody {
		display: block;
		padding: 0 12px;
	}

	tbody tr {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 44px;
		gap: 10px 8px;
		padding: 14px 0;
		border-bottom: 1px solid var(--app-line);
	}

	tbody tr:last-child {
		border-bottom: 0;
	}

	tbody th,
	td {
		display: block;
		min-width: 0;
		padding: 0;
		text-align: left;
	}

	tbody th {
		grid-column: 1 / 3;
		align-self: center;
		color: var(--app-muted);
		font-size: 12px;
		font-weight: 400;
	}

	tbody th::before {
		content: 'Producto ';
	}

	td:nth-child(2) {
		grid-column: 1 / -1;
		grid-row: 2;
	}

	td:nth-child(3) {
		grid-column: 1;
		grid-row: 3;
	}

	td:nth-child(4) {
		grid-column: 2 / -1;
		grid-row: 3;
	}

	td:last-child {
		grid-column: 3;
		grid-row: 1;
	}

	td[data-label]::before {
		content: attr(data-label);
		display: block;
		margin-bottom: 5px;
		color: var(--app-muted);
		font-size: 12px;
	}

	input {
		min-height: 46px;
		padding: 10px;
		border-radius: var(--radius-sm);
		appearance: textfield;
	}

	input::-webkit-inner-spin-button {
		appearance: none;
	}

	input::placeholder {
		color: var(--app-muted);
		opacity: 0.7;
	}

	.remove-item {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: var(--app-muted);
		font-size: 23px;
		touch-action: manipulation;
	}

	.remove-item:hover {
		background: var(--app-danger-soft);
		color: var(--app-danger);
	}

	.table-help {
		margin: 0;
		padding: 10px 12px 0;
		font-size: 11px;
		line-height: 1.5;
	}

	.material-add {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 12px;
	}

	.add-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 46px;
		padding: 10px 14px;
		border: 1px solid var(--app-line);
		border-radius: var(--radius-md);
		background: var(--app-soft);
		color: var(--app-accent);
		font-size: 14px;
		font-weight: 500;
		touch-action: manipulation;
	}

	.add-item span {
		font-size: 20px;
		line-height: 1;
	}

	.add-hint {
		color: var(--app-muted);
		font-size: 11px;
	}

	@media (max-width: 360px) {
		.material-add {
			flex-direction: column;
			align-items: flex-start;
		}

		.add-item {
			width: 100%;
		}
	}

	@media (min-width: 720px) {
		.table-title,
		.table-help,
		.material-add {
			padding-inline: 16px;
		}

		table {
			display: table;
			table-layout: fixed;
		}

		thead {
			position: static;
			width: auto;
			height: auto;
			overflow: visible;
			clip-path: none;
			display: table-header-group;
		}

		thead th {
			height: 36px;
			padding: 0 6px;
			background: var(--app-soft);
			color: var(--app-muted);
			font-size: 12px;
			font-weight: 400;
			text-align: left;
		}

		thead th:first-child {
			width: 44px;
			text-align: center;
		}

		thead th:nth-child(2) {
			width: 40%;
		}

		thead th:last-child {
			width: 56px;
		}

		tbody {
			display: table-row-group;
			padding: 0;
		}

		tbody tr {
			display: table-row;
		}

		tbody th,
		td {
			display: table-cell;
			padding: 8px 6px;
			border-bottom: 1px solid var(--app-line);
			vertical-align: middle;
		}

		tbody tr:last-child > * {
			border-bottom: 0;
		}

		tbody th {
			text-align: center;
		}

		tbody th::before,
		td[data-label]::before {
			content: none;
		}
	}
</style>

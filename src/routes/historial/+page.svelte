<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { Budget, budgetSummary, money } from '#lib/budget.svelte.ts';
	import {
		clearCalculations,
		deleteCalculation,
		listCalculations,
		type SavedCalculation
	} from '#lib/calculation-history.ts';
	import { saveCurrentDraft } from '#lib/current-draft.ts';
	import { shareSummary } from '#lib/share.ts';
	import { toast } from '#lib/toast.svelte.ts';
	import AppBar from '#lib/components/AppBar.svelte';
	import ConfirmSheet from '#lib/components/ConfirmSheet.svelte';
	import SavedCalculationDetail from '#lib/components/SavedCalculationDetail.svelte';
	import Sheet from '#lib/components/Sheet.svelte';

	type LoadState = 'loading' | 'ready' | 'error';

	const MS_PER_DAY = 86_400_000;
	const SEARCH_THRESHOLD = 4;
	const calculatorHref = resolve('/');
	const timeFormat = new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: '2-digit' });
	const dateFormat = new Intl.DateTimeFormat('es-MX', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	let loadState = $state<LoadState>('loading');
	let calculations = $state.raw<SavedCalculation[]>([]);
	let query = $state('');
	let selected = $state.raw<SavedCalculation | null>(null);
	let detailOpen = $state(false);
	let confirmingDelete = $state(false);
	let confirmingClear = $state(false);
	let cameFromApp = false;

	const normalizedQuery = $derived(normalize(query.trim()));
	const visibleCalculations = $derived(
		normalizedQuery
			? calculations.filter((item) => normalize(item.draft.project).includes(normalizedQuery))
			: calculations
	);

	afterNavigate(({ type }) => {
		cameFromApp = type !== 'enter';
	});

	onMount(loadHistory);

	async function loadHistory() {
		loadState = 'loading';
		try {
			calculations = await listCalculations();
			loadState = 'ready';
		} catch (error) {
			console.warn('No se pudo leer el historial', error);
			loadState = 'error';
		}
	}

	function normalize(text: string) {
		return text
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();
	}

	function startOfDay(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	}

	function formatSavedAt(timestamp: number) {
		const date = new Date(timestamp);
		const daysAgo = Math.round((startOfDay(new Date()) - startOfDay(date)) / MS_PER_DAY);
		const time = timeFormat.format(date);
		if (daysAgo === 0) {
			return `Hoy, ${time}`;
		}
		if (daysAgo === 1) {
			return `Ayer, ${time}`;
		}
		return `${dateFormat.format(date)}, ${time}`;
	}

	function describeMode(item: SavedCalculation) {
		return item.draft.mode === 'batch' ? `Lote de ${item.result.units} uds.` : 'Una pieza';
	}

	function goBack() {
		if (cameFromApp) {
			history.back();
		} else {
			goto(calculatorHref);
		}
	}

	function openDetail(item: SavedCalculation) {
		selected = item;
		detailOpen = true;
	}

	async function editInCalculator() {
		if (!selected) {
			return;
		}
		try {
			await saveCurrentDraft({ calculationId: selected.id, draft: selected.draft });
			detailOpen = false;
			await goto(calculatorHref);
		} catch (error) {
			console.warn('No se pudo abrir el cálculo', error);
			toast.show('No se pudo abrir el cálculo');
		}
	}

	function shareSelected() {
		if (selected) {
			shareSummary('Mi precio de venta', budgetSummary(new Budget(selected.draft)));
		}
	}

	async function deleteSelected() {
		if (!selected) {
			return;
		}
		const { id } = selected;
		try {
			await deleteCalculation(id);
			calculations = calculations.filter((item) => item.id !== id);
			detailOpen = false;
			toast.show('Cálculo eliminado');
		} catch (error) {
			console.warn('No se pudo eliminar el cálculo', error);
			toast.show('No se pudo eliminar el cálculo');
		}
	}

	async function clearHistory() {
		try {
			await clearCalculations();
			calculations = [];
			toast.show('Historial borrado');
		} catch (error) {
			console.warn('No se pudo borrar el historial', error);
			toast.show('No se pudo borrar el historial');
		}
	}
</script>

<svelte:head>
	<title>Historial | MargenKo</title>
</svelte:head>

<div class="app-shell">
	<AppBar title="Historial" onBack={goBack} />

	<main class="history app-container" aria-busy={loadState === 'loading'}>
		<header class="header">
			<h1>Tus cálculos</h1>
			<p>Cada vez que llegas a tu precio final, el cálculo se guarda aquí, en tu dispositivo.</p>
		</header>

		{#if loadState === 'loading'}
			<ul class="list" aria-hidden="true">
				{#each [1, 2, 3] as placeholder (placeholder)}
					<li class="card skeleton"></li>
				{/each}
			</ul>
		{:else if loadState === 'error'}
			<div class="card state">
				<p class="state-title">No pudimos abrir tu historial</p>
				<p>Tu navegador no permitió leer el almacenamiento del dispositivo.</p>
				<button type="button" class="button button-secondary" onclick={loadHistory}>
					Reintentar
				</button>
			</div>
		{:else if calculations.length === 0}
			<div class="card state">
				<p class="state-title">Aún no tienes cálculos guardados</p>
				<p>Completa los pasos de la calculadora y tu resultado aparecerá aquí.</p>
				<a class="button button-primary" href={calculatorHref}>Hacer un cálculo</a>
			</div>
		{:else}
			{#if calculations.length >= SEARCH_THRESHOLD}
				<div class="search">
					<label for="history-search" class="sr-only">Buscar por producto</label>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="11" cy="11" r="6.5" />
						<path d="M16 16l4 4" />
					</svg>
					<input
						id="history-search"
						class="control"
						type="search"
						bind:value={query}
						placeholder="Buscar por producto"
						autocomplete="off"
						enterkeyhint="search"
					/>
				</div>
			{/if}

			<p class="count">
				{visibleCalculations.length}
				{visibleCalculations.length === 1 ? 'cálculo' : 'cálculos'}
			</p>

			{#if visibleCalculations.length}
				<ul class="list">
					{#each visibleCalculations as item (item.id)}
						<li>
							<button type="button" class="card item" onclick={() => openDetail(item)}>
								<span class="item-main">
									<strong class="item-name">{item.draft.project.trim() || 'Sin nombre'}</strong>
									<span class="item-meta">
										{formatSavedAt(item.updatedAt)} · {describeMode(item)}
									</span>
								</span>
								<span class="item-price">
									<strong>{money.format(item.result.total)}</strong>
									<span>por unidad</span>
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="no-results">No hay cálculos que coincidan con “{query.trim()}”.</p>
			{/if}

			<button type="button" class="clear-button" onclick={() => (confirmingClear = true)}>
				Borrar historial
			</button>
		{/if}
	</main>
</div>

<Sheet bind:open={detailOpen} labelledBy="calculation-detail-title">
	{#if selected}
		<SavedCalculationDetail
			calculation={selected}
			savedAtLabel={formatSavedAt(selected.updatedAt)}
			titleId="calculation-detail-title"
			onEdit={editInCalculator}
			onShare={shareSelected}
			onDelete={() => (confirmingDelete = true)}
		/>
	{/if}
</Sheet>

<ConfirmSheet
	bind:open={confirmingDelete}
	title="¿Eliminar este cálculo?"
	message="Se quitará de tu historial. Esta acción no se puede deshacer."
	confirmLabel="Eliminar"
	onConfirm={deleteSelected}
/>

<ConfirmSheet
	bind:open={confirmingClear}
	title="¿Borrar todo el historial?"
	message="Se eliminarán todos tus cálculos guardados. Esta acción no se puede deshacer."
	confirmLabel="Borrar todo"
	onConfirm={clearHistory}
/>

<style>
	.history {
		max-width: 640px;
		padding: 24px 0 calc(32px + env(safe-area-inset-bottom));
	}

	.header {
		margin-bottom: 20px;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(27px, 7vw, 34px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.header p {
		margin-top: 8px;
		color: var(--color-text-muted);
		font-size: 16px;
		line-height: 1.5;
	}

	.search {
		position: relative;
		margin-bottom: 16px;
	}

	.search svg {
		position: absolute;
		left: 14px;
		top: 50%;
		width: 20px;
		height: 20px;
		fill: none;
		stroke: var(--color-text-subtle);
		stroke-linecap: round;
		stroke-width: 1.8;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.search input {
		padding-left: 42px;
	}

	.count {
		margin-bottom: 8px;
		color: var(--color-text-subtle);
		font-size: 13px;
		font-weight: 500;
	}

	.list {
		display: grid;
		gap: 10px;
	}

	.item {
		width: 100%;
		min-height: 76px;
		padding: 14px 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		text-align: left;
		transition:
			border-color 150ms ease,
			transform 100ms ease;
	}

	.item:hover {
		border-color: var(--color-brand);
	}

	.item:active {
		transform: scale(0.99);
	}

	.item-main,
	.item-price {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.item-main {
		min-width: 0;
	}

	.item-name {
		font-size: 16px;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-meta,
	.item-price span {
		color: var(--color-text-subtle);
		font-size: 13px;
	}

	.item-price {
		flex: none;
		align-items: flex-end;
	}

	.item-price strong {
		color: var(--color-brand-strong);
		font-family: var(--font-display);
		font-size: 20px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
	}

	.skeleton {
		height: 76px;
		background: linear-gradient(
			90deg,
			var(--color-surface) 25%,
			var(--color-surface-muted) 50%,
			var(--color-surface) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.2s linear infinite;
	}

	.state {
		padding: 24px;
		display: grid;
		gap: 8px;
		justify-items: start;
		color: var(--color-text-muted);
		font-size: 15px;
		line-height: 1.5;
	}

	.state .button {
		margin-top: 8px;
		text-decoration: none;
	}

	.state-title {
		color: var(--color-text);
		font-family: var(--font-display);
		font-size: 19px;
	}

	.no-results {
		padding: 24px 0;
		color: var(--color-text-muted);
		font-size: 15px;
		text-align: center;
	}

	.clear-button {
		min-height: 44px;
		margin: 24px auto 0;
		padding: 0 16px;
		border-radius: var(--radius-control);
		color: var(--color-danger);
		display: block;
		font-size: 15px;
		font-weight: 600;
	}

	.clear-button:hover {
		background: var(--color-danger-soft);
	}

	@media (min-width: 768px) {
		.history {
			padding-top: 40px;
		}
	}

	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}
</style>

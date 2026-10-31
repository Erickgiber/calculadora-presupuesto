<script lang="ts">
	import { tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import brandMarkBubble from '#lib/assets/brand/brand-mark-bubble.svg';
	import brandMarkK from '#lib/assets/brand/brand-mark-k.svg';
	import brandMarkO from '#lib/assets/brand/brand-mark-o.svg';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';

	type Material = {
		id: number;
		name: string;
		quantity: string;
		price: string;
	};

	type MaterialField = keyof Omit<Material, 'id'>;

	type InvestmentMode = 'unit' | 'batch';

	type NumberFieldProps = {
		value: string;
		onValueChange: (value: string) => void;
		id?: string;
		ariaLabel?: string;
		placeholder?: string;
		prefix?: string;
		suffix?: string;
	};

	const money = new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'MXN',
		maximumFractionDigits: 2
	});

	const recommendedProfitPercent = '30';

	let project = $state('');
	let mode = $state<InvestmentMode>('unit');
	let batchSize = $state('10');
	let materials = $state<Material[]>([
		{ id: 1, name: '', quantity: '', price: '' },
		{ id: 2, name: '', quantity: '', price: '' },
		{ id: 3, name: '', quantity: '', price: '' }
	]);
	let hours = $state('');
	let hourlyRate = $state('');
	let profitPercent = $state(recommendedProfitPercent);
	let resultsInView = $state(false);
	let resultsElement = $state<HTMLElement>();

	const calculation = $derived.by(() => {
		const materialsTotal = materials.reduce((total, item) => total + materialSubtotal(item), 0);
		const units = mode === 'batch' ? Math.max(Number(batchSize) || 1, 1) : 1;
		const materialUnit = materialsTotal / units;
		const laborUnit = ((Number(hours) || 0) * (Number(hourlyRate) || 0)) / units;
		const investment = materialUnit + laborUnit;
		const profit = investment * ((Number(profitPercent) || 0) / 100);

		return {
			units,
			materialsTotal,
			materialUnit,
			laborUnit,
			investment,
			profit,
			total: investment + profit
		};
	});

	const hasData = $derived(calculation.investment > 0);
	const isBatch = $derived(mode === 'batch');
	const isRecommendedProfit = $derived(Number(profitPercent) === Number(recommendedProfitPercent));
	const showPriceBar = $derived(hasData && !resultsInView);

	const priceSegments = $derived([
		{ label: 'Materiales', value: calculation.materialUnit, className: 'materials' },
		{ label: 'Mano de obra', value: calculation.laborUnit, className: 'labor' },
		{ label: 'Ganancia', value: calculation.profit, className: 'profit' }
	]);

	const trackVisibility: Attachment<HTMLElement> = (element) => {
		const observer = new IntersectionObserver(([entry]) => (resultsInView = entry.isIntersecting), {
			threshold: 0.2
		});
		observer.observe(element);
		return () => observer.disconnect();
	};

	function materialSubtotal(material: Material) {
		return (Number(material.quantity) || 0) * (Number(material.price) || 0);
	}

	function updateMaterial(material: Material, field: MaterialField, value: string) {
		material[field] = value;
	}

	async function addMaterial() {
		const id = Math.max(0, ...materials.map((item) => item.id)) + 1;
		materials.push({ id, name: '', quantity: '', price: '' });
		await tick();
		document.getElementById(materialNameId(id))?.focus();
	}

	function removeMaterial(id: number) {
		if (materials.length > 1) {
			materials = materials.filter((item) => item.id !== id);
		}
	}

	function applyRecommendation() {
		profitPercent = recommendedProfitPercent;
	}

	function showPriceDetails() {
		resultsElement?.scrollIntoView({ block: 'start' });
	}

	function materialLabel(material: Material, index: number) {
		return material.name || `material ${index + 1}`;
	}

	function materialNameId(id: number) {
		return `material-name-${id}`;
	}
</script>

<svelte:head>
	<title>Calculadora de precios | MargenKo</title>
	<meta
		name="description"
		content="Calcula el precio justo de tus productos considerando materiales, mano de obra y ganancia."
	/>
</svelte:head>

{#snippet stepHeader(step: number, id: string, title: string, description: string)}
	<header class="step-header">
		<span class="step-number" aria-hidden="true">{step}</span>
		<div>
			<h2 {id} class="step-title"><span class="sr-only">Paso {step}: </span>{title}</h2>
			<p class="step-description">{description}</p>
		</div>
	</header>
{/snippet}

{#snippet numberField({
	value,
	onValueChange,
	id,
	ariaLabel,
	placeholder = '0',
	prefix,
	suffix
}: NumberFieldProps)}
	<div class="control number-control">
		{#if prefix}
			<span class="affix" aria-hidden="true">{prefix}</span>
		{/if}
		<input
			{id}
			type="number"
			inputmode="decimal"
			min="0"
			step="any"
			{value}
			{placeholder}
			aria-label={ariaLabel}
			oninput={(event) => onValueChange(event.currentTarget.value)}
		/>
		{#if suffix}
			<span class="affix" aria-hidden="true">{suffix}</span>
		{/if}
	</div>
{/snippet}

<div class="app-shell">
	<header class="topbar">
		<div class="topbar-inner">
			<div class="brand">
				<span class="sr-only">MargenKo</span>
				<span aria-hidden="true">Margen</span>
				<span class="brand-mark" aria-hidden="true">
					<img src={brandMarkBubble} alt="" />
					<img src={brandMarkK} alt="" />
					<img src={brandMarkO} alt="" />
					<b>Ko</b>
				</span>
			</div>
			<ThemeToggle />
		</div>
	</header>

	<main class="page" class:has-price-bar={hasData}>
		<section class="intro">
			<p class="eyebrow">Fijación de precio de venta</p>
			<h1>Calcula el precio justo de tu producto</h1>
			<p class="intro-copy">
				Completa los cuatro pasos para recuperar tu inversión, pagar tu trabajo y obtener la
				ganancia que deseas. El resultado se actualiza mientras escribes.
			</p>
		</section>

		<div class="workspace">
			<div class="form-column">
				<section class="card" aria-labelledby="step-product">
					{@render stepHeader(
						1,
						'step-product',
						'Tu producto',
						'Ponle nombre y elige cómo lo fabricas.'
					)}
					<div class="product-grid">
						<div class="field">
							<label for="project" class="field-label">
								Nombre del producto <span class="optional">(opcional)</span>
							</label>
							<input
								id="project"
								class="control"
								bind:value={project}
								placeholder="Ej. Velas artesanales"
								autocomplete="off"
							/>
						</div>
						<fieldset class="field">
							<legend class="field-label">¿Cómo lo produces?</legend>
							<div class="segmented">
								<label>
									<input type="radio" name="mode" value="unit" bind:group={mode} />
									<span>Producto individual</span>
								</label>
								<label>
									<input type="radio" name="mode" value="batch" bind:group={mode} />
									<span>Por lote</span>
								</label>
							</div>
						</fieldset>
					</div>
					{#if isBatch}
						<div class="field batch-field">
							<label for="batch-size" class="field-label">¿Cuántas unidades produce el lote?</label>
							{@render numberField({
								id: 'batch-size',
								value: batchSize,
								placeholder: '1',
								suffix: 'uds.',
								onValueChange: (value) => (batchSize = value)
							})}
						</div>
					{/if}
					<p class="hint">
						{isBatch
							? 'Registra los costos de todo el lote; los dividiremos entre las unidades para darte el precio de cada una.'
							: 'Registra los costos de una sola pieza; el resultado será el precio de cada unidad.'}
					</p>
				</section>

				<section class="card" aria-labelledby="step-materials">
					{@render stepHeader(
						2,
						'step-materials',
						isBatch ? 'Materiales del lote' : 'Materiales por unidad',
						isBatch
							? 'Anota la compra completa de cada material: cantidad y precio unitario.'
							: 'Anota cada material, la cantidad que usas y su precio unitario.'
					)}
					<div class="materials-header" aria-hidden="true">
						<span>Material</span>
						<span>Cantidad</span>
						<span>Precio unitario</span>
						<span class="align-end">Subtotal</span>
						<span></span>
					</div>
					<ul class="materials-list">
						{#each materials as item, index (item.id)}
							<li class="material-row">
								<input
									id={materialNameId(item.id)}
									class="control material-name"
									value={item.name}
									oninput={(event) => updateMaterial(item, 'name', event.currentTarget.value)}
									placeholder="Ej. Cera de soya"
									aria-label={`Material ${index + 1}`}
									autocomplete="off"
								/>
								<div class="material-cell">
									<span class="cell-label" aria-hidden="true">Cantidad</span>
									{@render numberField({
										value: item.quantity,
										ariaLabel: `Cantidad de ${materialLabel(item, index)}`,
										onValueChange: (value) => updateMaterial(item, 'quantity', value)
									})}
								</div>
								<div class="material-cell">
									<span class="cell-label" aria-hidden="true">Precio unitario</span>
									{@render numberField({
										value: item.price,
										ariaLabel: `Precio de ${materialLabel(item, index)}`,
										placeholder: '0.00',
										prefix: '$',
										onValueChange: (value) => updateMaterial(item, 'price', value)
									})}
								</div>
								<div class="material-cell material-subtotal">
									<span class="cell-label" aria-hidden="true">Subtotal</span>
									<output aria-label={`Subtotal de ${materialLabel(item, index)}`}>
										{money.format(materialSubtotal(item))}
									</output>
								</div>
								<button
									type="button"
									class="icon-button"
									onclick={() => removeMaterial(item.id)}
									aria-label={`Eliminar ${materialLabel(item, index)}`}
									title={materials.length === 1
										? 'Necesitas al menos un material'
										: 'Eliminar material'}
									disabled={materials.length === 1}
								>
									<svg viewBox="0 0 20 20" aria-hidden="true">
										<path d="M5 5l10 10M15 5L5 15" />
									</svg>
								</button>
							</li>
						{/each}
					</ul>
					<div class="materials-footer">
						<button type="button" class="ghost-button" onclick={addMaterial}>
							<svg viewBox="0 0 20 20" aria-hidden="true">
								<path d="M10 4v12M4 10h12" />
							</svg>
							Agregar material
						</button>
						<p class="materials-total">
							{isBatch ? 'Total del lote' : 'Total de materiales'}
							<strong>{money.format(calculation.materialsTotal)}</strong>
						</p>
					</div>
				</section>

				<section class="card" aria-labelledby="step-labor">
					{@render stepHeader(
						3,
						'step-labor',
						'Mano de obra',
						isBatch
							? 'El tiempo total que te toma producir el lote y cuánto vale tu hora.'
							: 'El tiempo que te toma hacer una unidad y cuánto vale tu hora.'
					)}
					<div class="labor-grid">
						<div class="field">
							<label for="hours" class="field-label">Horas dedicadas</label>
							{@render numberField({
								id: 'hours',
								value: hours,
								suffix: 'h',
								onValueChange: (value) => (hours = value)
							})}
						</div>
						<span class="operator" aria-hidden="true">×</span>
						<div class="field">
							<label for="hourly-rate" class="field-label">Valor de tu hora</label>
							{@render numberField({
								id: 'hourly-rate',
								value: hourlyRate,
								placeholder: '0.00',
								prefix: '$',
								onValueChange: (value) => (hourlyRate = value)
							})}
						</div>
						<span class="operator" aria-hidden="true">=</span>
						<div class="field labor-total">
							<span id="labor-total-label" class="field-label">
								Tu trabajo{isBatch ? ' por unidad' : ''}
							</span>
							<output class="control control-readonly" aria-labelledby="labor-total-label">
								{money.format(calculation.laborUnit)}
							</output>
						</div>
					</div>
				</section>

				<section class="card" aria-labelledby="step-profit">
					{@render stepHeader(
						4,
						'step-profit',
						'Ganancia',
						'El porcentaje que sumas sobre tu inversión para que tu negocio crezca.'
					)}
					<div class="profit-layout">
						<div class="field profit-field">
							<label for="profit-percent" class="field-label">Porcentaje de ganancia</label>
							{@render numberField({
								id: 'profit-percent',
								value: profitPercent,
								suffix: '%',
								onValueChange: (value) => (profitPercent = value)
							})}
						</div>
						<div class="recommendation">
							<p>
								<strong>Recomendado: {recommendedProfitPercent}%</strong>
								Un punto de partida saludable para cubrir imprevistos y crecer.
							</p>
							<button
								type="button"
								class="ghost-button"
								onclick={applyRecommendation}
								disabled={isRecommendedProfit}
							>
								{#if isRecommendedProfit}
									<svg viewBox="0 0 20 20" aria-hidden="true">
										<path d="M4.5 10.5l3.5 3.5 7.5-8" />
									</svg>
									Aplicado
								{:else}
									Usar {recommendedProfitPercent}%
								{/if}
							</button>
						</div>
					</div>
				</section>
			</div>

			<aside
				class="results"
				aria-labelledby="results-title"
				bind:this={resultsElement}
				{@attach trackVisibility}
			>
				<div class="results-hero">
					<h2 id="results-title" class="results-label">Precio de venta sugerido</h2>
					{#if project}
						<p class="results-project">{project}</p>
					{/if}
					<p class="results-price" class:is-empty={!hasData}>
						{money.format(calculation.total)}
					</p>
					<p class="results-unit">
						por unidad
						{#if isBatch && hasData}
							<span class="results-batch">
								Lote de {calculation.units} uds.:
								<strong>{money.format(calculation.total * calculation.units)}</strong>
							</span>
						{/if}
					</p>
				</div>

				{#if hasData}
					<div class="results-body">
						<h3 class="results-subtitle">Así se forma tu precio</h3>
						<div class="composition-bar" aria-hidden="true">
							{#each priceSegments as segment (segment.label)}
								<span
									class="segment {segment.className}"
									style:width="{(segment.value / calculation.total) * 100}%"
								></span>
							{/each}
						</div>
						<dl class="breakdown">
							<div class="breakdown-row">
								<dt><span class="swatch materials"></span>Materiales</dt>
								<dd>{money.format(calculation.materialUnit)}</dd>
							</div>
							<div class="breakdown-row">
								<dt><span class="swatch labor"></span>Mano de obra</dt>
								<dd>{money.format(calculation.laborUnit)}</dd>
							</div>
							<div class="breakdown-row is-subtotal">
								<dt>Inversión por unidad</dt>
								<dd>{money.format(calculation.investment)}</dd>
							</div>
							<div class="breakdown-row">
								<dt>
									<span class="swatch profit"></span>Ganancia ({Number(profitPercent) || 0}%)
								</dt>
								<dd class="is-profit">+{money.format(calculation.profit)}</dd>
							</div>
							<div class="breakdown-row is-total">
								<dt>Precio de venta</dt>
								<dd>{money.format(calculation.total)}</dd>
							</div>
						</dl>
					</div>
				{:else}
					<div class="results-empty">
						<p class="results-empty-title">Tu precio aparecerá aquí</p>
						<p>
							Agrega el costo de al menos un material o de tu mano de obra y verás el resultado al
							instante.
						</p>
					</div>
				{/if}
			</aside>
		</div>
	</main>

	<div class="price-bar" class:is-visible={showPriceBar} inert={!showPriceBar}>
		<div class="price-bar-summary">
			<span>Precio sugerido</span>
			<strong>{money.format(calculation.total)}</strong>
		</div>
		<button type="button" class="primary-button" onclick={showPriceDetails}>Ver desglose</button>
	</div>
</div>

<style>
	.app-shell {
		min-height: 100dvh;
		background: linear-gradient(180deg, var(--color-brand-soft) 0, var(--color-page) 520px);
	}

	.topbar {
		border-radius: 0 0 24px 24px;
		background: var(--color-brand-surface);
	}

	.topbar-inner,
	.page {
		width: min(1180px, 100% - 48px);
		margin-inline: auto;
	}

	.topbar-inner {
		height: 76px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		color: var(--color-brand-contrast);
		display: flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: 34px;
		letter-spacing: -0.06em;
		line-height: 1;
	}

	.brand-mark {
		position: relative;
		width: 1.1em;
		height: 1.05em;
		margin-left: 0.05em;
	}

	.brand-mark img {
		position: absolute;
	}

	.brand-mark img:nth-child(1) {
		width: 0.95em;
		left: 0;
		top: 0.025em;
	}

	.brand-mark img:nth-child(2) {
		width: 0.675em;
		left: 0.325em;
		top: 0;
	}

	.brand-mark img:nth-child(3) {
		width: 0.7em;
		left: 0.125em;
		top: 0.2em;
	}

	.brand-mark b {
		position: absolute;
		inset: 0.6em auto auto 0.53em;
		z-index: 1;
		color: #6b4caf;
		font-size: 0.375em;
		letter-spacing: -0.067em;
	}

	.page {
		padding: 40px 0 80px;
	}

	.intro {
		max-width: 680px;
		margin-bottom: 32px;
	}

	.eyebrow {
		margin-bottom: 8px;
		color: var(--color-brand-strong);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.intro h1 {
		font-family: var(--font-display);
		font-size: clamp(32px, 4.6vw, 52px);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.02;
		text-wrap: balance;
	}

	.intro-copy {
		max-width: 60ch;
		margin-top: 14px;
		color: var(--color-text-muted);
		font-size: 16px;
		line-height: 1.55;
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(340px, 400px);
		gap: 24px;
		align-items: start;
	}

	.form-column {
		display: grid;
		gap: 16px;
	}

	.card {
		padding: 24px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-card);
		background: var(--color-surface);
		box-shadow: var(--shadow-card);
	}

	.step-header {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 20px;
	}

	.step-number {
		width: 28px;
		height: 28px;
		flex: none;
		border-radius: var(--radius-pill);
		background: var(--color-brand-soft);
		color: var(--color-brand-strong);
		display: grid;
		place-items: center;
		font-size: 14px;
		font-weight: 600;
	}

	.step-title {
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 500;
		line-height: 28px;
	}

	.step-description {
		margin-top: 2px;
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 1.45;
	}

	.field {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	legend.field-label {
		margin-bottom: 6px;
	}

	.field-label {
		padding: 0;
		color: var(--color-text);
		font-size: 14px;
		font-weight: 500;
	}

	.optional {
		color: var(--color-text-subtle);
		font-weight: 400;
	}

	.control {
		width: 100%;
		min-width: 0;
		height: var(--control-height);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-control);
		background: var(--color-surface);
		font-size: 16px;
		font-variant-numeric: tabular-nums;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease,
			background-color 150ms ease;
	}

	input.control {
		padding: 0 12px;
	}

	.control::placeholder,
	.control input::placeholder {
		color: var(--color-placeholder);
	}

	.control:hover {
		border-color: var(--color-brand);
	}

	.control:focus-within {
		border-color: var(--color-brand-strong);
		box-shadow: var(--focus-ring);
		outline: none;
	}

	.control:has(:user-invalid),
	input.control:user-invalid {
		border-color: var(--color-danger);
	}

	.number-control {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 12px;
	}

	.number-control input {
		width: 100%;
		min-width: 0;
		height: 100%;
		border: 0;
		background: transparent;
		appearance: textfield;
	}

	.number-control input:focus-visible {
		outline: none;
	}

	.number-control input::-webkit-inner-spin-button,
	.number-control input::-webkit-outer-spin-button {
		margin: 0;
		appearance: none;
	}

	.affix {
		flex: none;
		color: var(--color-text-subtle);
		font-size: 14px;
	}

	.control-readonly {
		padding: 0 12px;
		border-style: dashed;
		background: var(--color-surface-muted);
		color: var(--color-brand-strong);
		display: flex;
		align-items: center;
		font-weight: 600;
	}

	.control-readonly:hover {
		border-color: var(--color-border-strong);
	}

	.hint {
		margin-top: 16px;
		padding: 10px 12px;
		border-radius: var(--radius-control);
		background: var(--color-surface-muted);
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 1.45;
	}

	.product-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 16px;
		align-items: start;
	}

	.segmented {
		height: var(--control-height);
		padding: 4px;
		border-radius: var(--radius-control);
		background: var(--color-brand-soft);
		display: flex;
		gap: 4px;
	}

	.segmented label {
		flex: 1;
		position: relative;
	}

	.segmented input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.segmented span {
		height: 100%;
		padding: 0 16px;
		border-radius: 7px;
		color: var(--color-text-muted);
		display: grid;
		place-items: center;
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			box-shadow 150ms ease;
	}

	.segmented label:hover span {
		color: var(--color-text);
	}

	.segmented input:checked + span {
		background: var(--color-surface-raised);
		color: var(--color-brand-strong);
		box-shadow: var(--shadow-segment);
	}

	.segmented input:focus-visible + span {
		outline: 2px solid var(--color-brand-strong);
		outline-offset: 1px;
	}

	.batch-field {
		max-width: 320px;
		margin-top: 16px;
		animation: reveal 200ms var(--ease-out);
	}

	.materials-header,
	.material-row {
		display: grid;
		grid-template-columns:
			minmax(140px, 1.8fr) minmax(84px, 0.8fr) minmax(108px, 1fr) minmax(96px, 0.9fr)
			40px;
		gap: 8px;
		align-items: center;
	}

	.materials-header {
		padding-bottom: 8px;
		color: var(--color-text-subtle);
		font-size: 13px;
		font-weight: 500;
	}

	.align-end {
		text-align: right;
	}

	.materials-list {
		display: grid;
		gap: 8px;
	}

	.material-row {
		animation: reveal 200ms var(--ease-out);
	}

	.material-cell {
		min-width: 0;
	}

	.cell-label {
		display: none;
	}

	.material-subtotal output {
		display: block;
		color: var(--color-text-muted);
		font-size: 15px;
		font-variant-numeric: tabular-nums;
		text-align: right;
		overflow-wrap: anywhere;
	}

	.icon-button {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-control);
		color: var(--color-text-subtle);
		display: grid;
		place-items: center;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}

	.icon-button svg,
	.ghost-button svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-width: 1.8;
	}

	.icon-button:hover:not(:disabled) {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.icon-button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.materials-footer {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.ghost-button {
		min-height: 40px;
		padding: 0 14px;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-control);
		background: var(--color-surface);
		color: var(--color-brand-strong);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}

	.ghost-button:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}

	.ghost-button:disabled {
		border-color: transparent;
		background: transparent;
		color: var(--color-text-subtle);
		cursor: default;
	}

	.materials-total {
		color: var(--color-text-muted);
		font-size: 14px;
	}

	.materials-total strong {
		margin-left: 8px;
		color: var(--color-text);
		font-size: 17px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.labor-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr) 20px minmax(0, 1fr);
		gap: 8px;
		align-items: end;
	}

	.operator {
		height: var(--control-height);
		color: var(--color-text-subtle);
		display: grid;
		place-items: center;
		font-size: 20px;
	}

	.profit-layout {
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr);
		gap: 16px;
		align-items: end;
	}

	.recommendation {
		min-height: var(--control-height);
		padding: 10px 10px 10px 14px;
		border-radius: var(--radius-control);
		background: var(--color-brand-soft);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.recommendation p {
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 1.45;
	}

	.recommendation strong {
		display: block;
		color: var(--color-brand-stronger);
		font-weight: 600;
	}

	.recommendation .ghost-button {
		flex: none;
	}

	.results {
		position: sticky;
		top: 24px;
		scroll-margin-top: 16px;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-card);
		background: var(--color-surface);
		box-shadow: var(--shadow-card);
	}

	.results-hero {
		padding: 24px;
		background: var(--color-brand-surface);
		color: var(--color-on-brand);
	}

	.results-label {
		color: var(--color-brand-contrast);
		font-size: 14px;
		font-weight: 500;
	}

	.results-project {
		margin-top: 2px;
		color: var(--color-on-brand);
		font-family: var(--font-display);
		font-size: 18px;
		overflow-wrap: anywhere;
	}

	.results-price {
		margin-top: 8px;
		font-family: var(--font-display);
		font-size: clamp(40px, 5vw, 48px);
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1;
		overflow-wrap: anywhere;
	}

	.results-price.is-empty {
		opacity: 0.55;
	}

	.results-unit {
		margin-top: 6px;
		color: var(--color-brand-contrast);
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		font-size: 14px;
	}

	.results-batch strong {
		color: var(--color-on-brand);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.results-body {
		padding: 24px;
		animation: reveal 250ms var(--ease-out);
	}

	.results-subtitle {
		margin-bottom: 12px;
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 500;
	}

	.composition-bar {
		height: 12px;
		border-radius: var(--radius-pill);
		background: var(--color-brand-soft);
		display: flex;
		gap: 2px;
		overflow: hidden;
	}

	.segment {
		height: 100%;
		transition: width 400ms var(--ease-out);
	}

	.segment.materials,
	.swatch.materials {
		background: var(--color-materials-fill);
	}

	.segment.labor,
	.swatch.labor {
		background: var(--color-labor-fill);
	}

	.segment.profit,
	.swatch.profit {
		background: var(--color-profit-fill);
	}

	.breakdown {
		margin-top: 16px;
		font-size: 15px;
	}

	.breakdown-row {
		padding: 8px 0;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	.breakdown-row dt {
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.breakdown-row dd {
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		white-space: nowrap;
	}

	.swatch {
		width: 10px;
		height: 10px;
		flex: none;
		border-radius: 3px;
	}

	.breakdown-row.is-subtotal,
	.breakdown-row.is-total {
		border-top: 1px solid var(--color-border);
	}

	.breakdown-row.is-subtotal dt {
		color: var(--color-text);
		font-weight: 500;
	}

	.breakdown-row.is-subtotal dd {
		font-weight: 600;
	}

	.breakdown-row dd.is-profit {
		color: var(--color-profit);
		font-weight: 600;
	}

	.breakdown-row.is-total {
		margin-top: 4px;
		padding-top: 14px;
		border-top-color: var(--color-text);
	}

	.breakdown-row.is-total dt {
		color: var(--color-text);
		font-weight: 600;
	}

	.breakdown-row.is-total dd {
		color: var(--color-brand-strong);
		font-size: 19px;
		font-weight: 700;
	}

	.results-empty {
		padding: 24px;
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 1.5;
	}

	.results-empty-title {
		margin-bottom: 4px;
		color: var(--color-text);
		font-family: var(--font-display);
		font-size: 17px;
	}

	.price-bar {
		display: none;
	}

	.primary-button {
		min-height: 44px;
		padding: 0 18px;
		border-radius: var(--radius-control);
		background: var(--color-brand-strong);
		color: var(--color-on-accent);
		font-size: 15px;
		font-weight: 600;
		white-space: nowrap;
		transition: background-color 150ms ease;
	}

	.primary-button:hover {
		background: var(--color-brand-stronger);
	}

	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}

	@media (max-width: 960px) {
		.workspace {
			grid-template-columns: minmax(0, 1fr);
		}

		.results {
			position: static;
		}

		.page.has-price-bar {
			padding-bottom: 120px;
		}

		:global(html:has(.price-bar.is-visible)) {
			scroll-padding-bottom: 104px;
		}

		.price-bar {
			position: fixed;
			inset: auto 12px 12px;
			z-index: 10;
			padding: 10px 10px 10px 18px;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-card);
			background: var(--color-surface);
			box-shadow: var(--shadow-raised);
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			visibility: hidden;
			opacity: 0;
			transform: translateY(16px);
			transition:
				opacity 200ms ease,
				transform 200ms var(--ease-out),
				visibility 0s 200ms;
		}

		.price-bar.is-visible {
			visibility: visible;
			opacity: 1;
			transform: none;
			transition:
				opacity 200ms ease,
				transform 200ms var(--ease-out);
		}

		.price-bar-summary {
			min-width: 0;
			display: flex;
			flex-direction: column;
		}

		.price-bar-summary span {
			color: var(--color-text-muted);
			font-size: 13px;
		}

		.price-bar-summary strong {
			color: var(--color-brand-strong);
			font-family: var(--font-display);
			font-size: 22px;
			font-variant-numeric: tabular-nums;
			font-weight: 500;
			line-height: 1.2;
			overflow-wrap: anywhere;
		}
	}

	@media (max-width: 720px) {
		.product-grid,
		.profit-layout {
			grid-template-columns: minmax(0, 1fr);
		}

		.materials-header {
			display: none;
		}

		.materials-list {
			gap: 0;
		}

		.material-row {
			grid-template-columns: repeat(3, minmax(0, 1fr)) 40px;
			grid-template-areas:
				'name name name remove'
				'quantity price subtotal subtotal';
			gap: 8px;
			padding: 14px 0;
			border-bottom: 1px solid var(--color-border);
		}

		.material-row:first-child {
			padding-top: 0;
		}

		.material-row > :nth-child(1) {
			grid-area: name;
		}

		.material-row > :nth-child(2) {
			grid-area: quantity;
		}

		.material-row > :nth-child(3) {
			grid-area: price;
		}

		.material-row > :nth-child(4) {
			grid-area: subtotal;
		}

		.material-row > :nth-child(5) {
			grid-area: remove;
		}

		.cell-label {
			display: block;
			margin-bottom: 4px;
			color: var(--color-text-subtle);
			font-size: 13px;
		}

		.material-subtotal {
			align-self: stretch;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}

		.material-subtotal output {
			flex: 1;
			display: flex;
			align-items: center;
		}

		.materials-footer {
			margin-top: 0;
			border-top: 0;
		}

		.labor-grid {
			grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr);
		}

		.labor-grid > .operator:nth-of-type(2) {
			display: none;
		}

		.labor-total {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 480px) {
		.topbar-inner,
		.page {
			width: calc(100% - 32px);
		}

		.topbar {
			border-radius: 0 0 20px 20px;
		}

		.topbar-inner {
			height: 64px;
		}

		.brand {
			font-size: 30px;
		}

		.page {
			padding-top: 28px;
		}

		.intro {
			margin-bottom: 24px;
		}

		.intro-copy {
			font-size: 15px;
		}

		.card {
			padding: 18px 16px;
		}

		.step-header {
			margin-bottom: 16px;
		}

		.segmented span {
			padding: 0 8px;
		}

		.material-row {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) 40px;
			grid-template-areas:
				'name name remove'
				'quantity price price'
				'subtotal subtotal subtotal';
		}

		.material-subtotal {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.material-subtotal .cell-label {
			margin: 0;
		}

		.material-subtotal output {
			flex: none;
		}

		.materials-footer {
			flex-direction: column-reverse;
			align-items: stretch;
		}

		.materials-total {
			display: flex;
			justify-content: space-between;
		}

		.recommendation {
			flex-direction: column;
			align-items: stretch;
			padding: 12px;
		}

		.results-hero,
		.results-body,
		.results-empty {
			padding: 20px;
		}
	}
</style>

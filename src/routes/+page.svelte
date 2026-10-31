<script lang="ts">
	import brandMarkBubble from '#lib/assets/brand/brand-mark-bubble.svg';
	import brandMarkK from '#lib/assets/brand/brand-mark-k.svg';
	import brandMarkO from '#lib/assets/brand/brand-mark-o.svg';
	import clockIcon from '#lib/assets/icons/clock.svg';
	import lightbulbIcon from '#lib/assets/icons/lightbulb.svg';
	import menuIcon from '#lib/assets/icons/menu.svg';
	import moreInformationIcon from '#lib/assets/icons/more-information.svg';
	import piggyBankIcon from '#lib/assets/icons/piggy-bank.svg';
	import stepBadge from '#lib/assets/icons/step-badge.svg';

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
		ariaLabel: string;
		onValueChange: (value: string) => void;
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
	let showResult = $state(false);

	const calculation = $derived.by(() => {
		const materialsTotal = materials.reduce(
			(total, item) => total + (Number(item.quantity) || 0) * (Number(item.price) || 0),
			0
		);
		const units = mode === 'batch' ? Math.max(Number(batchSize) || 1, 1) : 1;
		const materialUnit = materialsTotal / units;
		const laborUnit = ((Number(hours) || 0) * (Number(hourlyRate) || 0)) / units;
		const investment = materialUnit + laborUnit;
		const profit = investment * ((Number(profitPercent) || 0) / 100);

		return {
			laborUnit,
			investment,
			profit,
			total: investment + profit
		};
	});

	const hasData = $derived(calculation.investment > 0);
	const chartMax = $derived(Math.max(calculation.total, 1));

	const priceBars = $derived([
		{ label: 'Inversión', value: calculation.investment, className: 'investment' },
		{ label: 'Ganancia', value: calculation.profit, className: 'profit' },
		{ label: 'Precio total', value: calculation.total, className: 'total' }
	]);

	function invalidateResult() {
		showResult = false;
	}

	function formatResult(value: number) {
		return money.format(showResult ? value : 0);
	}

	function selectMode(nextMode: InvestmentMode) {
		mode = nextMode;
		invalidateResult();
	}

	function updateMaterial(material: Material, field: MaterialField, value: string) {
		material[field] = value;
		invalidateResult();
	}

	function addMaterial() {
		materials.push({
			id: Math.max(0, ...materials.map((item) => item.id)) + 1,
			name: '',
			quantity: '',
			price: ''
		});
	}

	function removeMaterial(id: number) {
		if (materials.length > 1) {
			materials = materials.filter((item) => item.id !== id);
		}
	}

	function applyRecommendation() {
		profitPercent = recommendedProfitPercent;
		invalidateResult();
	}

	function materialLabel(material: Material, index: number) {
		return material.name || `material ${index + 1}`;
	}
</script>

<svelte:head>
	<title>Calculadora de precios | MargenKo</title>
	<meta
		name="description"
		content="Calcula el precio justo de tus productos considerando materiales, mano de obra y ganancia."
	/>
</svelte:head>

{#snippet stepTitle(step: number, title: string, subtitle?: string)}
	<div class="step-title">
		<span class="step-number">
			<img src={stepBadge} alt="" />
			<b>{step}</b>
		</span>
		<span>
			<strong>{title}</strong>
			{#if subtitle}
				<small>{subtitle}</small>
			{/if}
		</span>
	</div>
{/snippet}

{#snippet numberField({
	value,
	ariaLabel,
	onValueChange,
	placeholder = '0',
	prefix,
	suffix
}: NumberFieldProps)}
	<label class="number-field">
		{#if prefix}
			<span>{prefix}</span>
		{/if}
		<input
			type="number"
			min="0"
			step="0.01"
			{value}
			{placeholder}
			aria-label={ariaLabel}
			oninput={(event) => {
				onValueChange(event.currentTarget.value);
				invalidateResult();
			}}
		/>
		{#if suffix}
			<span>{suffix}</span>
		{/if}
	</label>
{/snippet}

<main class="app-shell">
	<header class="topbar">
		<div class="brand" aria-label="MargenKo">
			<span>Margen</span>
			<span class="brand-mark">
				<img src={brandMarkBubble} alt="" />
				<img src={brandMarkK} alt="" />
				<img src={brandMarkO} alt="" />
				<b>Ko</b>
			</span>
		</div>
		<button type="button" class="menu-button" aria-label="Abrir menú">
			<img src={menuIcon} alt="" />
		</button>
	</header>

	<div class="page">
		<section class="intro">
			<p class="eyebrow">Fijación de precio de venta</p>
			<h1>Calcula el precio justo de tu producto</h1>
			<p class="intro-copy">
				Sigue los pasos para recuperar tu inversión, pagar tu trabajo y obtener la ganancia que
				deseas.
			</p>
		</section>

		<div class="workspace">
			<div class="form-column">
				<section class="card investment-card">
					<div class="investment-heading">
						<label for="project">¿En qué vas a invertir?</label>
						<span class="tip">
							Consejo <img src={lightbulbIcon} alt="" />
						</span>
					</div>
					<div class="investment-controls">
						<input id="project" bind:value={project} placeholder="Ej. Velas artesanales" />
						<div class="mode-switch" aria-label="Tipo de inversión">
							<button
								type="button"
								class:active={mode === 'unit'}
								onclick={() => selectMode('unit')}
							>
								Producto individual
							</button>
							<button
								type="button"
								class:active={mode === 'batch'}
								onclick={() => selectMode('batch')}
							>
								Por lote
							</button>
						</div>
					</div>
					<p class="helper">Calcula siempre el precio de una unidad.</p>
					{#if mode === 'batch'}
						<label class="batch-field">
							¿Cuántas unidades produce el lote?
							{@render numberField({
								value: batchSize,
								ariaLabel: 'Unidades producidas por lote',
								suffix: 'uds.',
								onValueChange: (value) => (batchSize = value)
							})}
						</label>
					{/if}
				</section>

				<section class="card materials-card">
					{@render stepTitle(
						1,
						'Materiales para una unidad',
						mode === 'batch'
							? 'Registra la compra completa; dividiremos el costo entre las unidades'
							: 'Agrega cada material, la cantidad que usas y su precio'
					)}
					<div class="materials-header" aria-hidden="true">
						<span>#</span>
						<span>Material</span>
						<span>Cantidad</span>
						<span>Precio</span>
						<span></span>
					</div>
					<div class="materials-list">
						{#each materials as item, index (item.id)}
							<div class="material-row">
								<b>{index + 1}</b>
								<input
									value={item.name}
									oninput={(event) => updateMaterial(item, 'name', event.currentTarget.value)}
									placeholder="Ej. Cera"
									aria-label={`Material ${index + 1}`}
								/>
								<input
									type="number"
									min="0"
									step="0.01"
									value={item.quantity}
									oninput={(event) => updateMaterial(item, 'quantity', event.currentTarget.value)}
									placeholder="0"
									aria-label={`Cantidad de ${materialLabel(item, index)}`}
								/>
								<label class="price-input">
									<span>$</span>
									<input
										type="number"
										min="0"
										step="0.01"
										value={item.price}
										oninput={(event) => updateMaterial(item, 'price', event.currentTarget.value)}
										placeholder="0.00"
										aria-label={`Precio de ${materialLabel(item, index)}`}
									/>
								</label>
								<button
									type="button"
									class="remove-button"
									onclick={() => removeMaterial(item.id)}
									aria-label={`Eliminar material ${index + 1}`}
									disabled={materials.length === 1}
								>
									×
								</button>
							</div>
						{/each}
					</div>
					<button type="button" class="secondary-button" onclick={addMaterial}>
						<span>+</span> Agregar material
					</button>
				</section>

				<section class="card labor-card">
					{@render stepTitle(2, 'Mano de obra (tu trabajo)')}
					<div class="labor-grid">
						<label>
							<span>
								Horas dedicadas <img src={clockIcon} alt="" />
							</span>
							{@render numberField({
								value: hours,
								ariaLabel: 'Horas dedicadas',
								suffix: 'h',
								onValueChange: (value) => (hours = value)
							})}
						</label>
						<span class="operator">×</span>
						<label>
							<span>Valor de tu hora</span>
							{@render numberField({
								value: hourlyRate,
								ariaLabel: 'Valor por hora',
								prefix: '$',
								onValueChange: (value) => (hourlyRate = value)
							})}
						</label>
						<span class="operator">=</span>
						<div class="calculated-field">
							<span>Tu trabajo</span>
							<strong>{money.format(calculation.laborUnit)}</strong>
						</div>
					</div>
				</section>

				<section class="card profit-card">
					{@render stepTitle(3, 'Define tu ganancia')}
					<div class="recommendation">
						<div>
							<strong>Margen recomendado: {recommendedProfitPercent}%</strong>
							<p>Un punto de partida saludable para cubrir imprevistos y crecer.</p>
						</div>
						<button type="button" onclick={applyRecommendation}>
							Usar {recommendedProfitPercent}%
						</button>
					</div>
					<label class="profit-field">
						Porcentaje de ganancia
						{@render numberField({
							value: profitPercent,
							ariaLabel: 'Porcentaje de ganancia',
							suffix: '%',
							onValueChange: (value) => (profitPercent = value)
						})}
					</label>
					<button
						type="button"
						class="primary-button"
						onclick={() => (showResult = true)}
						disabled={!hasData}
					>
						Calcular mi precio
					</button>
					{#if !hasData}
						<small class="empty-note">Agrega al menos un costo para calcular.</small>
					{/if}
				</section>
			</div>

			<aside class="results-card" class:is-ready={showResult}>
				<div class="results-heading">
					<div>
						<p>Tu precio sugerido</p>
						<h2>{formatResult(calculation.total)}</h2>
						<span>por unidad</span>
					</div>
					<img src={piggyBankIcon} alt="" />
				</div>

				<div class="summary">
					<div>
						<span>Inversión por unidad</span>
						<strong>{formatResult(calculation.investment)}</strong>
					</div>
					<div>
						<span>Tu ganancia</span>
						<strong>{formatResult(calculation.profit)}</strong>
					</div>
				</div>

				<div class="chart">
					<div class="chart-title">
						<div>
							<h3>Así se forma tu precio</h3>
							<p>Comparación por unidad</p>
						</div>
						<img src={moreInformationIcon} alt="" />
					</div>
					{#each priceBars as bar (bar.label)}
						<div class="bar-row">
							<span>{bar.label}</span>
							<div class="bar-track">
								<div
									class="bar-fill {bar.className}"
									style:width="{showResult ? (bar.value / chartMax) * 100 : 0}%"
								></div>
							</div>
							<strong>{formatResult(bar.value)}</strong>
						</div>
					{/each}
				</div>

				<div class="formula">
					<span>{formatResult(calculation.investment)}</span>
					<b>+</b>
					<span>{formatResult(calculation.profit)}</span>
					<b>=</b>
					<strong>{formatResult(calculation.total)}</strong>
					<small>Inversión</small>
					<i></i>
					<small>Ganancia</small>
					<i></i>
					<small>Precio final</small>
				</div>
				{#if project && showResult}
					<p class="result-project">
						Presupuesto para: <strong>{project}</strong>
					</p>
				{/if}
			</aside>
		</div>
	</div>
</main>

<style>
	.app-shell {
		min-height: 100dvh;
		background:
			radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.52), transparent 24rem),
			linear-gradient(180deg, #eee8ff 0%, #d8caf6 34%, #8063c0 100%);
	}

	.topbar {
		height: 110px;
		padding: 0 clamp(18px, 5vw, 52px);
		border-radius: 0 0 30px 30px;
		background: #7157b1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		color: #e8ddff;
		display: flex;
		align-items: center;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 40px;
		letter-spacing: -2.4px;
		line-height: 1;
	}

	.brand-mark {
		position: relative;
		width: 44px;
		height: 42px;
		margin-left: 2px;
	}

	.brand-mark img {
		position: absolute;
	}

	.brand-mark img:nth-child(1) {
		width: 38px;
		left: 0;
		top: 1px;
	}

	.brand-mark img:nth-child(2) {
		width: 27px;
		left: 13px;
		top: 0;
	}

	.brand-mark img:nth-child(3) {
		width: 28px;
		left: 5px;
		top: 8px;
	}

	.brand-mark b {
		position: absolute;
		inset: 9px auto auto 8px;
		color: #6b4caf;
		font-size: 15px;
		letter-spacing: -1px;
		z-index: 1;
	}

	.menu-button {
		width: 44px;
		height: 44px;
		border: 0;
		background: transparent;
		display: grid;
		place-items: center;
	}

	.menu-button img {
		width: 33px;
		height: 33px;
	}

	.page {
		width: min(1180px, calc(100% - 32px));
		margin: 0 auto;
		padding: 32px 0 72px;
	}

	.intro {
		max-width: 650px;
		margin-bottom: 32px;
	}

	.eyebrow {
		color: #563ac7;
		font-family: 'Instrument Sans:Medium', sans-serif;
		font-size: 16px;
		font-variation-settings: 'wdth' 100;
		margin-bottom: 6px;
	}

	.intro h1 {
		max-width: 590px;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: clamp(36px, 5.5vw, 60px);
		font-weight: 400;
		letter-spacing: -0.03em;
		line-height: 0.95;
	}

	.intro-copy {
		max-width: 600px;
		margin-top: 14px;
		color: #6f6b73;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 15px;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.85fr);
		gap: 24px;
		align-items: start;
	}

	.form-column {
		display: grid;
		gap: 16px;
	}

	.card,
	.results-card {
		border: 1px solid rgba(57, 35, 97, 0.14);
		border-radius: 16px;
		background: rgba(235, 226, 255, 0.91);
		box-shadow: 0 14px 34px rgba(49, 33, 84, 0.1);
	}

	.card {
		padding: 18px;
	}

	.investment-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 10px;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 15px;
	}

	.tip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		white-space: nowrap;
	}

	.tip img {
		width: 15px;
		height: 15px;
	}

	.investment-controls {
		display: grid;
		grid-template-columns: minmax(160px, 1fr) auto;
		gap: 10px;
	}

	.investment-controls > input,
	.material-row > input,
	.price-input,
	.number-field {
		min-width: 0;
		border: 1px solid rgba(69, 49, 99, 0.2);
		border-radius: 9px;
		background: rgba(255, 255, 255, 0.3);
		transition:
			border-color 160ms ease,
			background 160ms ease;
	}

	.investment-controls > input {
		height: 44px;
		padding: 0 13px;
	}

	.investment-controls input:focus,
	.material-row input:focus {
		border-color: #7157b1;
		background: rgba(255, 255, 255, 0.6);
	}

	.mode-switch {
		display: flex;
		padding: 3px;
		border-radius: 10px;
		background: #cbb9ed;
	}

	.mode-switch button {
		padding: 0 14px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: #594b68;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 13px;
	}

	.mode-switch button.active {
		background: #fff;
		color: #4c269f;
		box-shadow: 0 2px 9px rgba(47, 25, 89, 0.12);
	}

	.helper {
		margin-top: 8px;
		color: #563ac7;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 12px;
		text-align: right;
	}

	.batch-field {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 10px;
		color: #5e5668;
		font-size: 12px;
	}

	.batch-field .number-field {
		width: 110px;
	}

	.step-title {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		margin-bottom: 14px;
		font-family: 'Kanit:Regular', sans-serif;
	}

	.step-title > span:last-child {
		display: flex;
		flex-direction: column;
	}

	.step-title strong {
		font-size: 15px;
		font-weight: 400;
		line-height: 1.1;
	}

	.step-title small {
		margin-top: 2px;
		color: #8c8791;
		font-size: 11px;
		line-height: 1.15;
	}

	.step-number {
		position: relative;
		width: 22px;
		height: 22px;
		flex: 0 0 22px;
		display: grid;
		place-items: center;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 12px;
	}

	.step-number img {
		position: absolute;
		width: 22px;
		height: 22px;
	}

	.step-number b {
		position: relative;
		z-index: 1;
		font-weight: 400;
	}

	.materials-header,
	.material-row {
		display: grid;
		grid-template-columns: 34px minmax(125px, 1.6fr) minmax(82px, 0.7fr) minmax(100px, 0.8fr) 30px;
		gap: 8px;
		align-items: center;
	}

	.materials-header {
		padding: 0 4px 7px;
		color: #554a62;
		font-family: 'Inter:Semi Bold', sans-serif;
		font-size: 11px;
		text-align: center;
	}

	.materials-list {
		display: grid;
		gap: 7px;
	}

	.material-row {
		min-height: 44px;
	}

	.material-row > b {
		text-align: center;
		font-family: 'Inter:Black', sans-serif;
		font-size: 12px;
	}

	.material-row > input,
	.price-input {
		height: 42px;
	}

	.material-row > input {
		padding: 0 10px;
	}

	.material-row > input[type='number'] {
		text-align: center;
	}

	.price-input,
	.number-field {
		display: flex;
		align-items: center;
		padding: 0 10px;
	}

	.price-input span,
	.number-field span {
		color: #655a70;
		font-size: 12px;
	}

	.price-input input,
	.number-field input {
		width: 100%;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
	}

	.price-input input {
		height: 40px;
	}

	.remove-button {
		width: 28px;
		height: 28px;
		border: 0;
		border-radius: 50%;
		background: rgba(113, 87, 177, 0.1);
		color: #7157b1;
		font-size: 20px;
		line-height: 1;
	}

	.remove-button:hover:not(:disabled) {
		background: #7157b1;
		color: white;
	}

	.remove-button:disabled {
		cursor: not-allowed;
		opacity: 0.3;
	}

	.secondary-button {
		min-height: 38px;
		margin: 16px auto 0;
		padding: 0 18px;
		border: 0;
		border-radius: 10px;
		background: #c4acff;
		color: #3c07ad;
		display: flex;
		align-items: center;
		gap: 7px;
		box-shadow: 0 4px 8px rgba(52, 27, 105, 0.18);
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 12px;
		text-transform: uppercase;
	}

	.secondary-button span {
		font-size: 20px;
	}

	.labor-grid {
		display: grid;
		grid-template-columns: 1fr 18px 1fr 18px 1fr;
		gap: 8px;
		align-items: end;
	}

	.labor-grid > label,
	.calculated-field {
		min-width: 0;
	}

	.labor-grid > label > span,
	.calculated-field > span,
	.profit-field {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-bottom: 6px;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 13px;
	}

	.labor-grid img {
		width: 16px;
		height: 16px;
	}

	.number-field {
		height: 42px;
	}

	.number-field input {
		height: 100%;
		text-align: center;
	}

	.operator {
		padding-bottom: 10px;
		color: #7457b7;
		font-size: 24px;
		font-weight: 700;
		text-align: center;
	}

	.calculated-field strong {
		height: 42px;
		border: 1px solid rgba(69, 49, 99, 0.2);
		border-radius: 9px;
		display: grid;
		place-items: center;
		color: #563ac7;
		font-family: 'Inter:Semi Bold', sans-serif;
		font-size: 13px;
	}

	.recommendation {
		margin-bottom: 14px;
		padding: 12px 14px;
		border: 1px solid rgba(86, 58, 199, 0.15);
		border-radius: 12px;
		background: rgba(196, 172, 255, 0.28);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.recommendation strong {
		color: #49279b;
		font-size: 13px;
	}

	.recommendation p {
		margin-top: 2px;
		color: #71697a;
		font-size: 11px;
	}

	.recommendation button {
		flex: 0 0 auto;
		padding: 8px 11px;
		border: 1px solid #7157b1;
		border-radius: 8px;
		background: transparent;
		color: #563ac7;
		font-size: 11px;
		font-weight: 600;
	}

	.profit-field {
		justify-content: space-between;
	}

	.profit-field .number-field {
		width: 130px;
		margin: 0;
	}

	.primary-button {
		width: 100%;
		min-height: 48px;
		margin-top: 12px;
		border: 0;
		border-radius: 12px;
		background: #5d3bb2;
		color: white;
		box-shadow: 0 8px 18px rgba(67, 36, 135, 0.24);
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 15px;
	}

	.primary-button:hover:not(:disabled) {
		background: #4b299f;
		transform: translateY(-1px);
	}

	.primary-button:disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}

	.empty-note {
		display: block;
		margin-top: 8px;
		color: #756c7e;
		text-align: center;
	}

	.results-card {
		position: sticky;
		top: 20px;
		overflow: hidden;
		background: rgba(242, 236, 255, 0.94);
	}

	.results-heading {
		min-height: 166px;
		padding: 26px;
		background: #7157b1;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.results-heading p {
		color: #dfd3ff;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 14px;
	}

	.results-heading h2 {
		margin-top: 3px;
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 45px;
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.results-heading span {
		color: #d5c8f5;
		font-size: 11px;
	}

	.results-heading > img {
		width: 58px;
		height: 58px;
		filter: invert(1);
		opacity: 0.8;
	}

	.summary {
		padding: 18px 22px;
		border-bottom: 1px solid rgba(74, 52, 112, 0.12);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.summary div {
		display: flex;
		flex-direction: column;
	}

	.summary div + div {
		padding-left: 14px;
		border-left: 1px solid rgba(74, 52, 112, 0.15);
	}

	.summary span {
		color: #746b7c;
		font-size: 11px;
	}

	.summary strong {
		margin-top: 3px;
		color: #40247f;
		font-family: 'Inter:Semi Bold', sans-serif;
		font-size: 16px;
	}

	.chart {
		padding: 22px;
	}

	.chart-title {
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.chart-title h3 {
		font-family: 'Kanit:Regular', sans-serif;
		font-size: 16px;
		font-weight: 400;
	}

	.chart-title p {
		color: #8c8394;
		font-size: 10px;
	}

	.chart-title img {
		width: 21px;
		height: 21px;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 70px 1fr 78px;
		gap: 8px;
		align-items: center;
		margin: 13px 0;
	}

	.bar-row > span {
		color: #645b6c;
		font-size: 11px;
	}

	.bar-row > strong {
		font-size: 11px;
		text-align: right;
	}

	.bar-track {
		height: 12px;
		border-radius: 99px;
		background: #ded3f1;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		min-width: 0;
		border-radius: inherit;
		transition: width 650ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.bar-fill.investment {
		background: #9d83d9;
	}

	.bar-fill.profit {
		background: #49cfa6;
	}

	.bar-fill.total {
		background: #563ac7;
	}

	.formula {
		margin: 2px 22px 22px;
		padding: 14px 10px 10px;
		border-radius: 12px;
		background: #e6dbfb;
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		gap: 5px;
		align-items: center;
		text-align: center;
	}

	.formula > span,
	.formula > strong {
		font-size: 11px;
	}

	.formula > b {
		color: #7559b6;
	}

	.formula > small {
		margin-top: 4px;
		color: #7d7387;
		font-size: 8px;
	}

	.formula > i {
		display: block;
	}

	.result-project {
		margin: -8px 22px 22px;
		color: #6d6475;
		font-size: 11px;
		text-align: center;
	}

	.is-ready .results-heading h2 {
		animation: result-in 420ms ease both;
	}

	@keyframes result-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@media (max-width: 860px) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.results-card {
			position: static;
		}
	}

	@media (max-width: 600px) {
		.topbar {
			height: 109px;
			padding-inline: 18px;
		}

		.brand {
			font-size: 38px;
		}

		.page {
			width: min(100% - 30px, 440px);
			padding-top: 30px;
		}

		.intro {
			margin-bottom: 36px;
		}

		.intro h1 {
			max-width: 390px;
			font-size: 32px;
			line-height: 0.91;
		}

		.intro-copy {
			font-size: 14px;
		}

		.card {
			padding: 14px;
			border-radius: 11px;
		}

		.investment-controls {
			grid-template-columns: 1fr;
		}

		.mode-switch {
			min-height: 42px;
		}

		.mode-switch button {
			flex: 1;
			padding: 0 7px;
		}

		.materials-card {
			padding-inline: 10px;
		}

		.materials-header,
		.material-row {
			grid-template-columns: 24px minmax(88px, 1.45fr) minmax(63px, 0.75fr) minmax(
					78px,
					0.85fr
				) 26px;
			gap: 4px;
		}

		.material-row > input,
		.price-input {
			height: 40px;
		}

		.material-row > input {
			padding-inline: 7px;
		}

		.price-input {
			padding-inline: 6px;
		}

		.remove-button {
			width: 25px;
			height: 25px;
		}

		.labor-grid {
			grid-template-columns: 1fr 14px 1fr;
		}

		.labor-grid > .operator:nth-of-type(2) {
			display: none;
		}

		.calculated-field {
			grid-column: 1 / -1;
			margin-top: 8px;
		}

		.recommendation {
			align-items: flex-start;
		}

		.results-heading {
			min-height: 150px;
			padding: 22px;
		}

		.results-heading h2 {
			font-size: 40px;
		}
	}

	@media (max-width: 380px) {
		.materials-header {
			display: none;
		}

		.material-row {
			grid-template-columns: 22px 1fr 64px 25px;
		}

		.material-row .price-input {
			grid-column: 2 / 4;
		}

		.recommendation {
			flex-direction: column;
		}
	}
</style>

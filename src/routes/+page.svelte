<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount, untrack } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { Attachment } from 'svelte/attachments';
	import { Budget, budgetSummary, money } from '#lib/budget.svelte.ts';
	import { saveCalculation } from '#lib/calculation-history.ts';
	import { loadCurrentDraft, newCalculationId, saveCurrentDraft } from '#lib/current-draft.ts';
	import { shareSummary } from '#lib/share.ts';
	import { INPUT_STEPS, STEPS, validateStep } from '#lib/steps.ts';
	import { toast } from '#lib/toast.svelte.ts';
	import AppBar from '#lib/components/AppBar.svelte';
	import PriceBreakdown from '#lib/components/PriceBreakdown.svelte';
	import LaborStep from '#lib/components/steps/LaborStep.svelte';
	import MaterialsStep from '#lib/components/steps/MaterialsStep.svelte';
	import ProductStep from '#lib/components/steps/ProductStep.svelte';
	import ProfitStep from '#lib/components/steps/ProfitStep.svelte';
	import ResultStep from '#lib/components/steps/ResultStep.svelte';

	const budget = new Budget();
	const resultStepIndex = STEPS.length - 1;
	const materialsStepIndex = STEPS.findIndex((step) => step.id === 'materials');
	const calculatorHref = resolve('/');
	const historyHref = resolve('/historial');

	let isLoaded = $state(false);
	let calculationId = $state(newCalculationId());
	let savedCalculationId = $state<string | null>(null);
	let attemptedStep = $state<number | null>(null);
	let hasRenderedFirstStep = false;

	const stepIndex = $derived(Math.min(Math.max(page.state.step ?? 0, 0), resultStepIndex));
	const currentStep = $derived(STEPS[stepIndex]);
	const isResult = $derived(currentStep.id === 'result');
	const stepError = $derived(
		attemptedStep === stepIndex ? validateStep(budget, currentStep.id) : null
	);
	const nextLabel = $derived(stepIndex === resultStepIndex - 1 ? 'Ver mi precio' : 'Continuar');
	const motionDuration = $derived(prefersReducedMotion.current ? 0 : 260);

	onMount(async () => {
		try {
			const current = await loadCurrentDraft();
			if (current) {
				budget.restore(current.draft);
				calculationId = current.calculationId;
			}
		} catch (error) {
			console.warn('No se pudo leer la base de datos local', error);
			toast.show('No se pudo acceder al almacenamiento; tus datos no se guardarán');
		}
		isLoaded = true;
	});

	$effect(() => {
		if (!isLoaded) {
			return;
		}
		saveCurrentDraft({ calculationId, draft: budget.toDraft() }).catch((error: unknown) =>
			console.warn('No se pudo guardar el borrador', error)
		);
	});

	$effect(() => {
		if (isLoaded && isResult && budget.hasCosts) {
			untrack(recordInHistory);
		}
	});

	async function recordInHistory() {
		try {
			const saved = await saveCalculation(calculationId, budget.toDraft(), budget.calculation);
			savedCalculationId = saved.id;
		} catch (error) {
			console.warn('No se pudo guardar en el historial', error);
			toast.show('No se pudo guardar en el historial');
		}
	}

	const focusOnStepChange: Attachment<HTMLElement> = (heading) => {
		if (!hasRenderedFirstStep) {
			hasRenderedFirstStep = true;
			return;
		}
		window.scrollTo({ top: 0, behavior: 'instant' });
		heading.focus({ preventScroll: true });
	};

	function goNext() {
		if (validateStep(budget, currentStep.id)) {
			attemptedStep = stepIndex;
			return;
		}
		attemptedStep = null;
		goto(calculatorHref, { state: { step: stepIndex + 1 }, shallow: true });
	}

	function goBack() {
		history.back();
	}

	function goToStep(targetIndex: number) {
		if (targetIndex < stepIndex) {
			history.go(targetIndex - stepIndex);
		}
	}

	function startOver() {
		budget.reset();
		calculationId = newCalculationId();
		savedCalculationId = null;
		attemptedStep = null;
		goToStep(0);
	}

	const advanceFieldOnEnter: Attachment<HTMLFormElement> = (form) => {
		const moveToNextField = (event: KeyboardEvent) => {
			const field = event.target;
			if (event.key !== 'Enter' || !(field instanceof HTMLInputElement) || field.type === 'radio') {
				return;
			}
			const fields = [
				...form.querySelectorAll<HTMLInputElement>('input:not([type="radio"]):not(:disabled)')
			];
			const nextField = fields[fields.indexOf(field) + 1];
			if (nextField) {
				event.preventDefault();
				nextField.focus();
			}
		};
		form.addEventListener('keydown', moveToNextField);
		return () => form.removeEventListener('keydown', moveToNextField);
	};
</script>

<svelte:head>
	<title>Calculadora de precios | MargenKo</title>
	<meta
		name="description"
		content="Calcula el precio justo de tus productos considerando materiales, mano de obra y ganancia."
	/>
</svelte:head>

<div class="app-shell">
	<AppBar
		title={stepIndex > 0 ? currentStep.label : undefined}
		onBack={stepIndex > 0 ? goBack : undefined}
	>
		{#snippet actions()}
			<a
				class="icon-button history-link"
				href={historyHref}
				aria-label="Historial de cálculos"
				title="Historial"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4M12 7.5V12l3 2" />
				</svg>
			</a>
		{/snippet}
		<nav class="progress" aria-label="Progreso">
			<ol class="app-container">
				{#each INPUT_STEPS as step, index (step.id)}
					<li>
						<button
							type="button"
							class="progress-step"
							class:is-reached={index <= stepIndex}
							class:is-current={index === stepIndex}
							aria-current={index === stepIndex ? 'step' : undefined}
							aria-label={index < stepIndex ? `${step.label}, completado` : step.label}
							disabled={index >= stepIndex}
							onclick={() => goToStep(index)}
						>
							<span class="progress-bar"></span>
							<span class="progress-label">{step.label}</span>
						</button>
					</li>
				{/each}
			</ol>
		</nav>
	</AppBar>

	{#if isLoaded}
		<div class="app-body app-container" class:has-summary={!isResult}>
			<main class="screen">
				<form
					id="step-form"
					class="screen-form"
					novalidate
					onsubmit={(event) => {
						event.preventDefault();
						goNext();
					}}
					{@attach advanceFieldOnEnter}
				>
					{#key stepIndex}
						<div in:fly={{ y: 16, duration: motionDuration, easing: cubicOut }}>
							<header class="screen-header">
								<p class="screen-kicker">
									{isResult ? 'Listo' : `Paso ${stepIndex + 1} de ${INPUT_STEPS.length}`}
								</p>
								<h1 class="screen-title" tabindex="-1" {@attach focusOnStepChange}>
									{currentStep.title}
								</h1>
								<p class="screen-description">{currentStep.description(budget)}</p>
							</header>

							{#if currentStep.id === 'product'}
								<ProductStep {budget} />
							{:else if currentStep.id === 'materials'}
								<MaterialsStep {budget} />
							{:else if currentStep.id === 'labor'}
								<LaborStep {budget} />
							{:else if currentStep.id === 'profit'}
								<ProfitStep {budget} />
							{:else if budget.hasCosts}
								<ResultStep
									{budget}
									savedToHistory={savedCalculationId === calculationId}
									onEdit={goToStep}
								/>
							{:else}
								<div class="card empty-result">
									<p>Todavía no hay costos para calcular tu precio.</p>
									<button
										type="button"
										class="button button-secondary"
										onclick={() => goToStep(materialsStepIndex)}
									>
										Agregar costos
									</button>
								</div>
							{/if}
						</div>
					{/key}

					{#if stepError}
						<p class="form-error" role="alert">
							<svg viewBox="0 0 20 20" aria-hidden="true">
								<circle cx="10" cy="10" r="7.5" />
								<path d="M10 6.5v4M10 13.5v.01" />
							</svg>
							{stepError}
						</p>
					{/if}
				</form>

				<div class="action-bar">
					{#if isResult}
						<button type="button" class="button button-secondary" onclick={startOver}>
							Nuevo cálculo
						</button>
						<button
							type="button"
							class="button button-primary"
							onclick={() => shareSummary('Mi precio de venta', budgetSummary(budget))}
							disabled={!budget.hasCosts}
						>
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M12 15V4M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
							</svg>
							Compartir
						</button>
					{:else}
						{#if stepIndex > 0 && budget.hasCosts}
							<div class="running-total">
								<span>Precio estimado</span>
								<strong>{money.format(budget.calculation.total)}</strong>
							</div>
						{/if}
						<button type="submit" form="step-form" class="button button-primary next-button">
							{nextLabel}
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M9 5l7 7-7 7" />
							</svg>
						</button>
					{/if}
				</div>
			</main>

			{#if !isResult}
				<aside class="card live-summary" aria-labelledby="live-summary-title">
					<h2 id="live-summary-title" class="live-title">Tu precio hasta ahora</h2>
					{#if budget.hasCosts}
						<p class="live-price">{money.format(budget.calculation.total)}</p>
						<p class="live-unit">por unidad</p>
						<PriceBreakdown calculation={budget.calculation} />
					{:else}
						<p class="live-empty">
							Cuando agregues materiales o mano de obra, aquí verás cómo se forma tu precio.
						</p>
					{/if}
				</aside>
			{/if}
		</div>
	{/if}
</div>

<style>
	.history-link {
		color: var(--color-brand-contrast);
	}

	.history-link:hover {
		background: rgba(255, 255, 255, 0.14);
	}

	.history-link svg {
		width: 22px;
		height: 22px;
	}

	.progress ol {
		padding-bottom: 12px;
		display: flex;
		gap: 6px;
	}

	.progress li {
		flex: 1;
		min-width: 0;
	}

	.progress-step {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		color: rgba(232, 221, 255, 0.65);
		font-size: 12px;
		font-weight: 500;
		text-align: left;
	}

	.progress-step:disabled {
		cursor: default;
	}

	.progress-bar {
		position: relative;
		height: 4px;
		border-radius: var(--radius-pill);
		background: rgba(255, 255, 255, 0.22);
		overflow: hidden;
	}

	.progress-bar::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--color-on-brand);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 320ms var(--ease-out);
	}

	.is-reached .progress-bar::after {
		transform: scaleX(1);
	}

	.is-reached {
		color: var(--color-brand-contrast);
	}

	.is-current {
		color: var(--color-on-brand);
		font-weight: 600;
	}

	.progress-step:not(:disabled):hover .progress-label {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.progress-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.app-body {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 640px);
		justify-content: center;
		column-gap: 40px;
	}

	.screen {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.screen-form {
		flex: 1;
		padding: 24px 0 32px;
	}

	.screen-header {
		margin-bottom: 24px;
	}

	.screen-kicker {
		color: var(--color-brand-strong);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.screen-title {
		margin-top: 6px;
		font-family: var(--font-display);
		font-size: clamp(27px, 7vw, 34px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.1;
		text-wrap: balance;
	}

	.screen-title:focus {
		outline: none;
	}

	.screen-description {
		max-width: 56ch;
		margin-top: 8px;
		color: var(--color-text-muted);
		font-size: 16px;
		line-height: 1.5;
	}

	.form-error {
		margin-top: 20px;
		padding: 12px 14px;
		border-radius: var(--radius-control);
		background: var(--color-danger-soft);
		color: var(--color-danger);
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.4;
		animation: shake 320ms ease;
	}

	.form-error svg {
		width: 20px;
		height: 20px;
		flex: none;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-width: 1.8;
	}

	.empty-result {
		padding: 20px;
		display: grid;
		gap: 16px;
		justify-items: start;
		color: var(--color-text-muted);
		font-size: 15px;
	}

	.action-bar {
		position: sticky;
		bottom: 0;
		z-index: 10;
		margin-inline: calc(var(--gutter) * -1);
		padding: 12px var(--gutter) calc(12px + env(safe-area-inset-bottom));
		border-top: 1px solid var(--color-border);
		background: color-mix(in srgb, var(--color-page) 86%, transparent);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.action-bar > .button {
		flex: 1;
	}

	.running-total {
		min-width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.running-total span {
		color: var(--color-text-muted);
		font-size: 13px;
	}

	.running-total strong {
		color: var(--color-brand-strong);
		font-family: var(--font-display);
		font-size: 22px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.running-total ~ .next-button {
		flex: none;
		min-width: 148px;
	}

	.live-summary {
		display: none;
	}

	.live-title {
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 500;
	}

	.live-price {
		margin-top: 12px;
		color: var(--color-brand-strong);
		font-family: var(--font-display);
		font-size: 40px;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1;
	}

	.live-unit {
		margin: 4px 0 20px;
		color: var(--color-text-muted);
		font-size: 14px;
	}

	.live-empty {
		margin-top: 8px;
		color: var(--color-text-muted);
		font-size: 15px;
		line-height: 1.5;
	}

	@media (max-width: 559px) {
		.progress-label {
			position: absolute;
			width: 1px;
			height: 1px;
			clip-path: inset(50%);
		}
	}

	@media (min-width: 768px) {
		.screen-form {
			flex: none;
			padding-top: 40px;
		}

		.action-bar {
			bottom: 16px;
			margin: 0 0 16px;
			padding: 12px;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-card);
			background: color-mix(in srgb, var(--color-surface) 90%, transparent);
			box-shadow: var(--shadow-raised);
		}

		.running-total {
			padding-left: 8px;
		}
	}

	@media (min-width: 1024px) {
		.app-body.has-summary {
			grid-template-columns: minmax(0, 640px) 340px;
		}

		.live-summary {
			position: sticky;
			top: 128px;
			align-self: start;
			margin-top: 40px;
			padding: 24px;
			display: block;
		}

		.running-total {
			display: none;
		}

		.running-total ~ .next-button {
			flex: 1;
		}
	}

	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		50% {
			transform: translateX(4px);
		}
		75% {
			transform: translateX(-2px);
		}
	}
</style>

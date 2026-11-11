<script lang="ts">
	import Button from '#lib/components/ui/Button.svelte';
	import type { VisualTemplate } from '#lib/theme/visual-templates.ts';

	interface Props {
		template: VisualTemplate;
		isSelected: boolean;
		onselect: () => void;
	}

	let { template, isSelected, onselect }: Props = $props();

	const [previewStart, previewEnd] = $derived(template.previewColors);
</script>

<article class="card">
	<div
		class="preview"
		style:--preview-start={previewStart}
		style:--preview-end={previewEnd}
		style:--preview-pattern="var(--pattern-{template.id}, none)"
		aria-hidden="true"
	>
		<span class="preview-card"></span>
		<span class="preview-line"></span>
	</div>
	<h2>{template.name}</h2>
	<p>{template.description}</p>
	<Button variant="secondary" pressed={isSelected} onclick={onselect}>
		{isSelected ? '✓ Diseño seleccionado' : 'Aplicar diseño'}
	</Button>
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
	}

	.card p {
		flex: 1;
	}

	.preview {
		position: relative;
		height: 115px;
		margin-bottom: 16px;
		overflow: hidden;
		border-radius: var(--radius-md);
		background: linear-gradient(135deg, var(--preview-start), var(--preview-end));
	}

	.preview::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: var(--preview-pattern);
		background-size: 120px 105px;
		opacity: 0.16;
	}

	.preview-card {
		position: absolute;
		top: 24px;
		right: 20px;
		left: 20px;
		height: 45px;
		border-radius: 9px;
		background: #ffffffd9;
	}

	.preview-line {
		position: absolute;
		top: 81px;
		left: 20px;
		width: 45%;
		height: 10px;
		border-radius: 5px;
		background: #ffffffb3;
	}

	h2 {
		margin-top: 8px;
	}
</style>

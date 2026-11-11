<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		intro?: Snippet;
		layout?: 'split' | 'stacked';
		children: Snippet;
	}

	let { intro, layout = 'split', children }: Props = $props();
</script>

<section class="page {layout}">
	{#if intro}
		<header class="page-intro">{@render intro()}</header>
	{/if}
	<div class="page-content">{@render children()}</div>
</section>

<style>
	.page {
		padding: clamp(20px, 5.5vw, 32px) var(--gutter) calc(28px + env(safe-area-inset-bottom));
		animation: enter 180ms ease;
	}

	.page > * {
		min-width: 0;
	}

	@media (min-width: 720px) {
		.page {
			padding-bottom: 48px;
		}
	}

	@media (min-width: 1024px) {
		.split {
			display: grid;
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			align-items: start;
			gap: 56px;
		}

		.split .page-intro {
			position: sticky;
			top: 32px;
			padding-top: 8px;
		}
	}

	@keyframes enter {
		from {
			opacity: 0.5;
			transform: translateY(4px);
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import BrandLogo from './BrandLogo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	type Props = {
		title?: string;
		onBack?: () => void;
		actions?: Snippet;
		children?: Snippet;
	};

	let { title, onBack, actions, children }: Props = $props();
</script>

<header class="app-bar">
	<div class="row app-container">
		{#if onBack}
			<button
				type="button"
				class="icon-button back-button"
				onclick={onBack}
				aria-label="Volver"
				title="Volver"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M15 5l-7 7 7 7" />
				</svg>
			</button>
		{/if}
		{#if title}
			<p class="title">{title}</p>
		{:else}
			<BrandLogo />
		{/if}
		<div class="actions">
			{@render actions?.()}
			<ThemeToggle />
		</div>
	</div>
	{@render children?.()}
</header>

<style>
	.app-bar {
		position: sticky;
		top: 0;
		z-index: 20;
		padding-top: env(safe-area-inset-top);
		background: var(--color-brand-surface);
		color: var(--color-brand-contrast);
	}

	.row {
		height: 56px;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.back-button {
		margin-left: -10px;
		color: var(--color-on-brand);
	}

	.back-button:hover {
		background: rgba(255, 255, 255, 0.14);
	}

	.back-button svg {
		width: 24px;
		height: 24px;
		stroke-width: 2;
	}

	.title {
		min-width: 0;
		color: var(--color-on-brand);
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		margin-left: auto;
		margin-right: -10px;
		display: flex;
		align-items: center;
	}
</style>

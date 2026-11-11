<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger';
		to?: RouteId;
		type?: 'button' | 'submit';
		pressed?: boolean;
		onclick?: () => void;
		children: Snippet;
	}

	let { variant = 'primary', to, type = 'button', pressed, onclick, children }: Props = $props();
</script>

{#if to}
	<a class="button {variant}" href={resolve(to)}>{@render children()}</a>
{:else}
	<button class="button {variant}" {type} aria-pressed={pressed} {onclick}>
		{@render children()}
	</button>
{/if}

<style>
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 50px;
		padding: 14px 16px;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		background: var(--app-button);
		color: #fff;
		font-size: 16px;
		font-weight: 500;
		line-height: 1.35;
		text-align: center;
		text-decoration: none;
		touch-action: manipulation;
		transition: filter 150ms ease;
	}

	.button:hover {
		filter: brightness(1.06);
	}

	.secondary {
		border-color: var(--app-line);
		background: var(--app-soft);
		color: var(--app-accent);
	}

	.secondary[aria-pressed='true'] {
		outline: 2px solid var(--app-accent);
		outline-offset: 2px;
	}

	.danger {
		background: var(--app-danger-soft);
		color: var(--app-danger);
	}
</style>

<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { toast } from '#lib/toast.svelte.ts';
</script>

<div class="toast-region" role="status" aria-live="polite">
	{#if toast.message}
		<p
			class="toast"
			transition:fly={{ y: 16, duration: prefersReducedMotion.current ? 0 : 260, easing: cubicOut }}
		>
			{toast.message}
		</p>
	{/if}
</div>

<style>
	.toast-region {
		position: fixed;
		inset: auto 0 calc(96px + env(safe-area-inset-bottom));
		z-index: 60;
		padding-inline: var(--gutter);
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.toast {
		padding: 12px 18px;
		border-radius: var(--radius-pill);
		background: var(--color-text);
		color: var(--color-page);
		box-shadow: var(--shadow-raised);
		font-size: 15px;
		font-weight: 500;
	}
</style>

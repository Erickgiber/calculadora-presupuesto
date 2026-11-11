<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { calculator } from '#lib/state/calculator.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const canShowStep = $derived(calculator.hasStarted || page.route.id === '/calculator/product');

	$effect(() => {
		if (!canShowStep) goto(resolve('/calculator/product'), { replaceState: true });
	});
</script>

{#if canShowStep}
	{@render children()}
{/if}

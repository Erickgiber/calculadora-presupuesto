<script lang="ts">
	import type { RouteId } from '$app/types';
	import BackLink from '#lib/components/ui/BackLink.svelte';

	const STEP_COUNT = 4;

	interface Props {
		step: number;
		backTo: RouteId;
		titleLines: readonly string[];
		description: string;
		context?: string;
	}

	let { step, backTo, titleLines, description, context }: Props = $props();
</script>

<BackLink to={backTo} />
<div class="eyebrow">PASO {step} DE {STEP_COUNT}</div>
<div class="progress" aria-hidden="true">
	{#each { length: STEP_COUNT }, index (index)}
		<i class:reached={index < step}></i>
	{/each}
</div>
<h1>
	{#each titleLines as line, index (index)}
		{#if index > 0}<br />{/if}{line}
	{/each}
</h1>
<p>{description}</p>
{#if context}
	<div class="eyebrow">{context}</div>
{/if}

<style>
	.progress {
		display: flex;
		gap: 8px;
		margin: 12px 0 26px;
	}

	i {
		flex: 1;
		height: 4px;
		border-radius: 4px;
		background: var(--app-progress-track);
	}

	i.reached {
		background: var(--app-accent);
	}
</style>

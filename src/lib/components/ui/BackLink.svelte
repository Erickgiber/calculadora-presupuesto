<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';

	interface Props {
		to: RouteId;
		label?: string;
	}

	let { to, label = 'Volver' }: Props = $props();
</script>

<a class="back-link" href={resolve(to)}>← {label}</a>

<style>
	.back-link {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		margin-bottom: 12px;
		color: var(--app-accent);
		font-size: 15px;
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>

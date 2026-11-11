<script lang="ts">
	import '#lib/styles/app.css';
	import AppHeader from '#lib/components/layout/AppHeader.svelte';
	import AppMenu from '#lib/components/layout/AppMenu.svelte';
	import { preferences } from '#lib/state/preferences.svelte.ts';
	import { applyAppearance } from '#lib/theme/appearance.ts';
	import { onSystemThemeChange } from '#lib/theme/color-mode.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	let isMenuOpen = $state(false);

	function applyCurrentAppearance() {
		applyAppearance(preferences.current.colorMode, preferences.current.templateId);
	}

	$effect(applyCurrentAppearance);
	$effect(() => onSystemThemeChange(applyCurrentAppearance));
</script>

<div class="app-shell">
	<AppHeader {isMenuOpen} onmenu={() => (isMenuOpen = true)} />
	<main>
		{@render children()}
	</main>
</div>
<AppMenu bind:open={isMenuOpen} />

<style>
	.app-shell {
		position: relative;
		isolation: isolate;
		width: 100%;
		max-width: var(--shell-width);
		min-height: 100svh;
		margin: 0 auto;
		background: var(--app-gradient);
		box-shadow: 0 0 80px #291c4010;
	}

	.app-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background-image: var(--app-pattern);
		background-size: 160px 140px;
		opacity: var(--pattern-opacity);
	}

	@media (min-width: 600px) {
		.app-shell {
			width: calc(100% - 48px);
			min-height: calc(100svh - 48px);
			margin-block: 24px;
			overflow: hidden;
			border-radius: var(--radius-xl);
		}
	}
</style>

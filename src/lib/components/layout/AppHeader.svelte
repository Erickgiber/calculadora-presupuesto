<script lang="ts">
	import { resolve } from '$app/paths';
	import BrandLogo from './BrandLogo.svelte';

	interface Props {
		isMenuOpen: boolean;
		onmenu: () => void;
	}

	let { isMenuOpen, onmenu }: Props = $props();
</script>

<header class="app-header">
	<a class="brand" href={resolve('/')} title="Ir al inicio">
		<BrandLogo />
	</a>
	<button
		type="button"
		class="menu-button"
		aria-label="Abrir menú de opciones"
		title="Menú"
		aria-haspopup="dialog"
		aria-controls="app-menu"
		aria-expanded={isMenuOpen}
		onclick={onmenu}
	>
		<svg viewBox="390 66 27 23" aria-hidden="true">
			<path
				d="M391.95 69.25a1.65 1.65 0 0 1 1.65-1.65h19.8a1.65 1.65 0 1 1 0 3.3h-19.8a1.65 1.65 0 0 1-1.65-1.65Zm0 8.25a1.65 1.65 0 0 1 1.65-1.65h19.8a1.65 1.65 0 1 1 0 3.3h-19.8a1.65 1.65 0 0 1-1.65-1.65Zm0 8.25a1.65 1.65 0 0 1 1.65-1.65h19.8a1.65 1.65 0 1 1 0 3.3h-19.8a1.65 1.65 0 0 1-1.65-1.65Z"
			/>
		</svg>
	</button>
</header>

<style>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: calc(env(safe-area-inset-top) + clamp(32px, 12.5vw, 44px)) var(--gutter)
			clamp(8px, 2.6vw, 14px);
		border-radius: 0 0 28px 28px;
		background: var(--app-header);
	}

	.brand {
		display: block;
		height: clamp(36px, 9.8vw, 46px);
		border-radius: 8px;
	}

	.menu-button {
		display: grid;
		flex: none;
		place-items: center;
		width: 48px;
		height: 48px;
		margin-right: -12px;
		padding: 0;
		border: 0;
		border-radius: 8px;
		background: transparent;
		touch-action: manipulation;
	}

	.menu-button:hover {
		background: #ffffff1f;
	}

	.brand:focus-visible,
	.menu-button:focus-visible {
		outline: 3px solid #fff;
		outline-offset: 2px;
	}

	svg {
		width: clamp(22px, 6vw, 27px);
		fill: #fff;
	}
</style>

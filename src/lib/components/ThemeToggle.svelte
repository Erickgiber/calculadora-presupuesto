<script lang="ts">
	type Theme = 'light' | 'dark';

	const darkSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

	let theme = $state<Theme>(currentTheme());

	const nextThemeLabel = $derived(theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');

	$effect(() => {
		const syncWithSystem = () => (theme = currentTheme());
		darkSchemeQuery.addEventListener('change', syncWithSystem);
		return () => darkSchemeQuery.removeEventListener('change', syncWithSystem);
	});

	function currentTheme(): Theme {
		const explicitTheme = document.documentElement.dataset.theme;
		if (explicitTheme === 'light' || explicitTheme === 'dark') {
			return explicitTheme;
		}
		return darkSchemeQuery.matches ? 'dark' : 'light';
	}

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch (error) {
			console.warn('No se pudo guardar la preferencia de tema', error);
		}
	}
</script>

<button
	type="button"
	class="theme-toggle"
	onclick={toggleTheme}
	aria-label={nextThemeLabel}
	title={nextThemeLabel}
>
	{#if theme === 'dark'}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"
			/>
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-control);
		color: var(--color-brand-contrast);
		display: grid;
		place-items: center;
		transition: background-color 150ms ease;
	}

	.theme-toggle:hover {
		background: rgba(255, 255, 255, 0.14);
	}

	.theme-toggle:focus-visible {
		outline-color: var(--color-brand-contrast);
	}

	svg {
		width: 22px;
		height: 22px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}
</style>

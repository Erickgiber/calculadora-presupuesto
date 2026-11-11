export const COLOR_MODES = [
	{ value: 'light', label: 'Claro', description: 'Fondos luminosos y violeta suave' },
	{ value: 'dark', label: 'Oscuro', description: 'Superficies oscuras y texto claro' },
	{ value: 'auto', label: 'Automático', description: 'Sigue la apariencia de tu teléfono' }
] as const;

export type ColorMode = (typeof COLOR_MODES)[number]['value'];

type ResolvedTheme = Exclude<ColorMode, 'auto'>;

export function isColorMode(value: unknown): value is ColorMode {
	return COLOR_MODES.some((mode) => mode.value === value);
}

const darkSchemeQuery = '(prefers-color-scheme: dark)';

export function resolveTheme(mode: ColorMode): ResolvedTheme {
	if (mode !== 'auto') return mode;
	return matchMedia(darkSchemeQuery).matches ? 'dark' : 'light';
}

export function onSystemThemeChange(listener: () => void): () => void {
	const query = matchMedia(darkSchemeQuery);
	query.addEventListener('change', listener);
	return () => query.removeEventListener('change', listener);
}

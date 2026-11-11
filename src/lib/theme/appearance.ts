import { resolveTheme, type ColorMode } from './color-mode.ts';
import type { VisualTemplateId } from './visual-templates.ts';

export function applyAppearance(colorMode: ColorMode, templateId: VisualTemplateId): void {
	const root = document.documentElement;
	const theme = resolveTheme(colorMode);
	root.dataset.theme = theme;
	root.dataset.design = templateId;
	root.style.colorScheme = theme;
}

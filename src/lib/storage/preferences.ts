import { DEFAULT_CURRENCY, isCurrencyCode, type CurrencyCode } from '#lib/format/money.ts';
import { isColorMode, type ColorMode } from '#lib/theme/color-mode.ts';
import { resolveTemplateId, type VisualTemplateId } from '#lib/theme/visual-templates.ts';
import { isRecord, readJson, readString, writeJson } from './local-storage.ts';

const STORAGE_KEY = 'margen-preferencias';

export interface Preferences {
	name: string;
	business: string;
	currency: CurrencyCode;
	colorMode: ColorMode;
	templateId: VisualTemplateId;
}

export function loadPreferences(): Preferences {
	const stored = readJson(STORAGE_KEY);
	const source = isRecord(stored) ? stored : {};
	return {
		name: readString(source.nombre),
		business: readString(source.negocio),
		currency: isCurrencyCode(source.moneda) ? source.moneda : DEFAULT_CURRENCY,
		colorMode: isColorMode(source.tema) ? source.tema : 'auto',
		templateId: resolveTemplateId(source.plantilla)
	};
}

export function storePreferences(preferences: Preferences): boolean {
	return writeJson(STORAGE_KEY, {
		nombre: preferences.name,
		negocio: preferences.business,
		moneda: preferences.currency,
		tema: preferences.colorMode,
		plantilla: preferences.templateId
	});
}

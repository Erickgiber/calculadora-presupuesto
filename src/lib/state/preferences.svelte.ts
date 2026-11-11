import { loadPreferences, storePreferences, type Preferences } from '#lib/storage/preferences.ts';

export const PREFERENCES_SAVE_ERROR = 'No se pudieron guardar los cambios en este navegador.';

class PreferencesStore {
	current = $state<Preferences>(loadPreferences());

	update(changes: Partial<Preferences>): boolean {
		const next = { ...this.current, ...changes };
		if (!storePreferences(next)) return false;
		this.current = next;
		return true;
	}
}

export const preferences = new PreferencesStore();

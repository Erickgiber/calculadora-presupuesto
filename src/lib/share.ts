import { toast } from './toast.svelte';

export async function shareSummary(title: string, text: string) {
	if (navigator.share) {
		try {
			await navigator.share({ title, text });
			return;
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				return;
			}
		}
	}
	try {
		await navigator.clipboard.writeText(text);
		toast.show('Resumen copiado al portapapeles');
	} catch {
		toast.show('No se pudo copiar el resumen');
	}
}

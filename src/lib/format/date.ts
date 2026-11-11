export function formatDate(timestamp: number): string {
	return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(timestamp));
}

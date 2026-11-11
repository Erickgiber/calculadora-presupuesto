export const VISUAL_TEMPLATES = [
	{
		id: 'clasica',
		name: 'Margen clásica',
		description: 'Violeta con monedas y billetes de fondo casi visibles.',
		previewColors: ['#f1ebfb', '#bba6dc']
	},
	{
		id: 'costura',
		name: 'Confección',
		description: 'Naranja cálido con botones, hilos y puntadas.',
		previewColors: ['#faf0e4', '#d6b18d']
	},
	{
		id: 'reposteria',
		name: 'Repostería',
		description: 'Rosa vibrante con cupcakes y utensilios sutiles.',
		previewColors: ['#fcedf6', '#ddb5d5']
	},
	{
		id: 'manualidades',
		name: 'Manualidades',
		description: 'Verde con tijeras, pinceles y papel decorativo.',
		previewColors: ['#eff4e9', '#b4c9ab']
	},
	{
		id: 'arte',
		name: 'Arte',
		description: 'Azul intenso con paletas, pinceles y trazos creativos.',
		previewColors: ['#eef2fc', '#aec2e3']
	},
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Gris neutro y una composición limpia, sin dibujos.',
		previewColors: ['#f4f3f5', '#c4c1c9']
	}
] as const;

export type VisualTemplate = (typeof VISUAL_TEMPLATES)[number];

export type VisualTemplateId = VisualTemplate['id'];

const DEFAULT_TEMPLATE_ID: VisualTemplateId = 'clasica';

const RETIRED_TEMPLATE_REPLACEMENTS: Record<string, VisualTemplateId> = { botanica: 'arte' };

export function resolveTemplateId(value: unknown): VisualTemplateId {
	const match = VISUAL_TEMPLATES.find((template) => template.id === value);
	if (match) return match.id;
	return (typeof value === 'string' && RETIRED_TEMPLATE_REPLACEMENTS[value]) || DEFAULT_TEMPLATE_ID;
}

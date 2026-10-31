import type { Budget } from './budget.svelte';

export type StepId = 'product' | 'materials' | 'labor' | 'profit' | 'result';

export type Step = {
	id: StepId;
	label: string;
	title: string;
	description: (budget: Budget) => string;
};

export const STEPS: Step[] = [
	{
		id: 'product',
		label: 'Producto',
		title: '¿Qué vas a cotizar?',
		description: () =>
			'En cuatro pasos sabrás a cuánto vender para recuperar tu inversión, pagar tu trabajo y ganar.'
	},
	{
		id: 'materials',
		label: 'Materiales',
		title: '¿Qué materiales usas?',
		description: (budget) =>
			budget.isBatch
				? 'Anota lo que compras para todo el lote: la cantidad y el precio unitario de cada material.'
				: 'Anota cada material que usas en una pieza, la cantidad y su precio unitario.'
	},
	{
		id: 'labor',
		label: 'Mano de obra',
		title: '¿Cuánto tiempo le dedicas?',
		description: (budget) =>
			budget.isBatch
				? 'Tu tiempo también cuesta. Indica cuánto tardas en producir todo el lote y cuánto vale tu hora.'
				: 'Tu tiempo también cuesta. Indica cuánto tardas en hacer una pieza y cuánto vale tu hora.'
	},
	{
		id: 'profit',
		label: 'Ganancia',
		title: '¿Cuánto quieres ganar?',
		description: () => 'Es el porcentaje que sumas sobre tu inversión para que tu negocio crezca.'
	},
	{
		id: 'result',
		label: 'Resultado',
		title: 'Tu precio de venta',
		description: () => 'Esto es lo que te recomendamos cobrar por cada unidad.'
	}
];

export const INPUT_STEPS = STEPS.filter((step) => step.id !== 'result');

const negativeValueError = 'Los valores no pueden ser negativos. Revisa los campos marcados.';

function isNegative(value: string) {
	return Number(value) < 0;
}

export function validateStep(budget: Budget, id: StepId): string | null {
	switch (id) {
		case 'product':
			return budget.isBatch && !(Number(budget.batchSize) >= 1)
				? 'Indica cuántas unidades produce el lote (mínimo 1).'
				: null;
		case 'materials':
			return budget.materials.some((item) => isNegative(item.quantity) || isNegative(item.price))
				? negativeValueError
				: null;
		case 'labor':
			if (isNegative(budget.laborTime) || isNegative(budget.hourlyRate)) {
				return negativeValueError;
			}
			return budget.hasCosts
				? null
				: 'Agrega al menos un material o tu mano de obra para poder calcular un precio.';
		case 'profit':
			return isNegative(budget.profitPercent) ? 'La ganancia no puede ser negativa.' : null;
		case 'result':
			return null;
	}
}

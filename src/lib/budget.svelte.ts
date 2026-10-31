export type Material = {
	id: number;
	name: string;
	quantity: string;
	price: string;
};

export type InvestmentMode = 'unit' | 'batch';

export type TimeUnit = 'hours' | 'minutes';

export const TIME_UNIT_SUFFIX: Record<TimeUnit, string> = {
	hours: 'h',
	minutes: 'min'
};

const MINUTES_PER_HOUR = 60;

export type BudgetDraft = {
	project: string;
	mode: InvestmentMode;
	batchSize: string;
	materials: Material[];
	laborTime: string;
	timeUnit: TimeUnit;
	hourlyRate: string;
	profitPercent: string;
};

export const RECOMMENDED_PROFIT_PERCENT = '30';

export const money = new Intl.NumberFormat('es-MX', {
	style: 'currency',
	currency: 'MXN',
	maximumFractionDigits: 2
});

export function materialSubtotal(material: Material) {
	return (Number(material.quantity) || 0) * (Number(material.price) || 0);
}

function emptyMaterial(id: number): Material {
	return { id, name: '', quantity: '', price: '' };
}

function emptyDraft(): BudgetDraft {
	return {
		project: '',
		mode: 'unit',
		batchSize: '10',
		materials: [emptyMaterial(1)],
		laborTime: '',
		timeUnit: 'hours',
		hourlyRate: '',
		profitPercent: RECOMMENDED_PROFIT_PERCENT
	};
}

export class Budget {
	project = $state('');
	mode = $state<InvestmentMode>('unit');
	batchSize = $state('');
	materials = $state<Material[]>([]);
	laborTime = $state('');
	timeUnit = $state<TimeUnit>('hours');
	hourlyRate = $state('');
	profitPercent = $state('');

	laborHours = $derived.by(() => {
		const laborTime = Number(this.laborTime) || 0;
		return this.timeUnit === 'minutes' ? laborTime / MINUTES_PER_HOUR : laborTime;
	});

	calculation = $derived.by(() => {
		const materialsTotal = this.materials.reduce(
			(total, item) => total + materialSubtotal(item),
			0
		);
		const units = this.mode === 'batch' ? Math.max(Number(this.batchSize) || 1, 1) : 1;
		const materialUnit = materialsTotal / units;
		const laborUnit = (this.laborHours * (Number(this.hourlyRate) || 0)) / units;
		const investment = materialUnit + laborUnit;
		const profitRate = Number(this.profitPercent) || 0;
		const profit = investment * (profitRate / 100);

		return {
			units,
			materialsTotal,
			materialUnit,
			laborUnit,
			investment,
			profitRate,
			profit,
			total: investment + profit
		};
	});

	laborTimeLabel = $derived(`${Number(this.laborTime) || 0} ${TIME_UNIT_SUFFIX[this.timeUnit]}`);
	hasCosts = $derived(this.calculation.investment > 0);
	isBatch = $derived(this.mode === 'batch');

	constructor(draft: BudgetDraft = emptyDraft()) {
		this.restore(draft);
	}

	restore(draft: BudgetDraft) {
		this.project = draft.project;
		this.mode = draft.mode;
		this.batchSize = draft.batchSize;
		this.materials = draft.materials.length ? draft.materials : [emptyMaterial(1)];
		this.laborTime = draft.laborTime;
		this.timeUnit = draft.timeUnit;
		this.hourlyRate = draft.hourlyRate;
		this.profitPercent = draft.profitPercent;
	}

	reset() {
		this.restore(emptyDraft());
	}

	toDraft(): BudgetDraft {
		return {
			project: this.project,
			mode: this.mode,
			batchSize: this.batchSize,
			materials: $state.snapshot(this.materials),
			laborTime: this.laborTime,
			timeUnit: this.timeUnit,
			hourlyRate: this.hourlyRate,
			profitPercent: this.profitPercent
		};
	}

	addMaterial() {
		const id = Math.max(0, ...this.materials.map((item) => item.id)) + 1;
		this.materials.push(emptyMaterial(id));
		return id;
	}

	removeMaterial(id: number) {
		if (this.materials.length > 1) {
			this.materials = this.materials.filter((item) => item.id !== id);
		}
	}
}

export type Calculation = Budget['calculation'];

export function budgetSummary(budget: Budget) {
	const { calculation } = budget;
	const lines = [
		budget.project.trim() || 'Mi producto',
		`Precio de venta sugerido: ${money.format(calculation.total)} por unidad`
	];

	if (budget.isBatch) {
		lines.push(
			`Lote de ${calculation.units} uds.: ${money.format(calculation.total * calculation.units)}`
		);
	}

	lines.push(
		'',
		`Materiales: ${money.format(calculation.materialUnit)}`,
		`Mano de obra (${budget.laborTimeLabel}): ${money.format(calculation.laborUnit)}`,
		`Inversión por unidad: ${money.format(calculation.investment)}`,
		`Ganancia (${calculation.profitRate}%): ${money.format(calculation.profit)}`
	);

	return lines.join('\n');
}

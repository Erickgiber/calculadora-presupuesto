<script lang="ts" generics="T extends string">
	interface Choice {
		value: T;
		label: string;
		description: string;
	}

	interface Props {
		legend: string;
		name: string;
		options: readonly Choice[];
		value: T;
		onchange: (value: T) => void;
	}

	let { legend, name, options, value, onchange }: Props = $props();
</script>

<fieldset class="choices">
	<legend>{legend}</legend>
	<div class="choice-list">
		{#each options as option (option.value)}
			<label class="choice">
				<input
					type="radio"
					{name}
					value={option.value}
					checked={value === option.value}
					onchange={() => onchange(option.value)}
				/>
				<span>
					<strong>{option.label}</strong>
					<small>{option.description}</small>
				</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.choices {
		margin: 0;
		padding: 0;
		border: 0;
	}

	.choices:not(:first-child) {
		margin-top: 24px;
	}

	legend {
		margin-bottom: 12px;
		font-weight: 500;
	}

	.choice-list {
		display: grid;
		gap: 10px;
	}

	.choice {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 70px;
		margin: 0;
		padding: 14px;
		border: 1px solid var(--app-line);
		border-radius: var(--radius-md);
		background: var(--app-input);
		cursor: pointer;
	}

	.choice:has(input:checked) {
		border-color: var(--app-accent);
		box-shadow: 0 0 0 1px var(--app-accent);
	}

	.choice:has(input:focus-visible) {
		outline: 3px solid var(--app-focus);
		outline-offset: 2px;
	}

	input {
		flex: none;
		width: 22px;
		height: 22px;
		min-height: 22px;
		padding: 0;
		accent-color: var(--app-accent);
	}

	input:focus {
		box-shadow: none;
	}

	strong {
		font-weight: 500;
	}

	small {
		display: block;
		margin-top: 4px;
		color: var(--app-muted);
		font-size: 12px;
	}

	@media (min-width: 720px) {
		.choice-list {
			grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		}
	}
</style>

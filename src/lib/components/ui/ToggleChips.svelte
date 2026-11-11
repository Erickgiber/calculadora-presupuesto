<script lang="ts" generics="T extends string | number">
	interface Chip {
		value: T;
		label: string;
	}

	interface Props {
		label: string;
		options: readonly Chip[];
		selected: T | undefined;
		onselect: (value: T) => void;
	}

	let { label, options, selected, onselect }: Props = $props();
</script>

<div class="chips" role="group" aria-label={label}>
	{#each options as option (option.value)}
		<button
			type="button"
			aria-pressed={selected === option.value}
			onclick={() => onselect(option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.chips {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	button {
		flex: 1;
		min-width: 0;
		min-height: 48px;
		padding: 10px;
		border: 1px solid var(--app-line);
		border-radius: var(--radius-sm);
		background: var(--app-soft);
		color: var(--app-accent);
		font-size: 15px;
		line-height: 1.3;
		touch-action: manipulation;
	}

	button[aria-pressed='true'] {
		border-color: var(--app-button);
		background: var(--app-button);
		color: #fff;
	}
</style>

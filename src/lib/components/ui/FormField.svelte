<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';

	interface Props {
		id: string;
		label: string;
		value: string;
		kind?: 'text' | 'decimal' | 'integer';
		min?: number;
		max?: number;
		placeholder?: string;
		help?: string;
		maxlength?: number;
		autocomplete?: FullAutoFill;
		required?: boolean;
		disabled?: boolean;
	}

	let {
		id,
		label,
		value = $bindable(),
		kind = 'decimal',
		min = 0,
		max = 100000,
		placeholder,
		help,
		maxlength = 60,
		autocomplete = 'off',
		required = true,
		disabled = false
	}: Props = $props();

	const isInteger = $derived(kind === 'integer');
</script>

<label for={id}>{label}</label>
{#if kind === 'text'}
	<input
		{id}
		name={id}
		type="text"
		bind:value
		{maxlength}
		{autocomplete}
		{placeholder}
		{required}
		{disabled}
	/>
{:else}
	<input
		{id}
		name={id}
		type="number"
		inputmode={isInteger ? 'numeric' : 'decimal'}
		{min}
		{max}
		step={isInteger ? 1 : 0.01}
		{value}
		oninput={(event) => (value = event.currentTarget.value)}
		{placeholder}
		{required}
		{disabled}
	/>
{/if}
{#if help}
	<p class="help">{help}</p>
{/if}

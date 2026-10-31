<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'value' | 'type' | 'prefix'> & {
		value?: string;
		prefix?: string;
		suffix?: string;
	};

	let { value = $bindable(''), prefix, suffix, placeholder = '0', ...inputProps }: Props = $props();
</script>

<div class="control number-control">
	{#if prefix}
		<span class="affix" aria-hidden="true">{prefix}</span>
	{/if}
	<input
		type="number"
		inputmode="decimal"
		min="0"
		step="any"
		enterkeyhint="next"
		{placeholder}
		{...inputProps}
		{value}
		oninput={(event) => (value = event.currentTarget.value)}
	/>
	{#if suffix}
		<span class="affix" aria-hidden="true">{suffix}</span>
	{/if}
</div>

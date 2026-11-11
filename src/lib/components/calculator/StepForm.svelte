<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ValidationResult } from '#lib/calculation/validation.ts';
	import Button from '#lib/components/ui/Button.svelte';

	interface Props {
		submitLabel: string;
		validate: () => ValidationResult;
		onvalid: () => void;
		error?: string;
		children: Snippet;
	}

	let { submitLabel, validate, onvalid, error = $bindable(''), children }: Props = $props();

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const message = validate();
		if (message) {
			error = message;
			return;
		}
		onvalid();
	}
</script>

<form class="surface-form" onsubmit={handleSubmit} oninput={() => (error = '')}>
	{@render children()}
	<p class="error" aria-live="polite">{error}</p>
	<Button type="submit">{submitLabel}</Button>
</form>

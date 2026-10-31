<script lang="ts">
	import Sheet from './Sheet.svelte';

	type Props = {
		open: boolean;
		title: string;
		message: string;
		confirmLabel: string;
		onConfirm: () => void;
	};

	let { open = $bindable(), title, message, confirmLabel, onConfirm }: Props = $props();

	const uid = $props.id();

	function confirm() {
		open = false;
		onConfirm();
	}
</script>

<Sheet bind:open labelledBy="{uid}-title" describedBy="{uid}-message">
	<h2 id="{uid}-title">{title}</h2>
	<p id="{uid}-message">{message}</p>
	<div class="actions">
		<button type="button" class="button button-secondary" onclick={() => (open = false)}>
			Cancelar
		</button>
		<button type="button" class="button button-danger" onclick={confirm}>{confirmLabel}</button>
	</div>
</Sheet>

<style>
	h2 {
		font-family: var(--font-display);
		font-size: 21px;
		font-weight: 500;
	}

	p {
		margin-top: 6px;
		color: var(--color-text-muted);
		font-size: 15px;
		line-height: 1.5;
	}

	.actions {
		margin-top: 24px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
</style>

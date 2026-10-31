<script lang="ts">
	type Props = {
		open: boolean;
		title: string;
		message: string;
		confirmLabel: string;
		onConfirm: () => void;
	};

	let { open = $bindable(), title, message, confirmLabel, onConfirm }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (open && !dialog?.open) {
			dialog?.showModal();
		} else if (!open && dialog?.open) {
			dialog.close();
		}
	});

	function confirm() {
		open = false;
		onConfirm();
	}

	function closeOnBackdrop(event: MouseEvent) {
		if (event.target === dialog) {
			open = false;
		}
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby="confirm-sheet-title"
	aria-describedby="confirm-sheet-message"
	onclose={() => (open = false)}
	onclick={closeOnBackdrop}
>
	<div class="sheet">
		<span class="handle" aria-hidden="true"></span>
		<h2 id="confirm-sheet-title">{title}</h2>
		<p id="confirm-sheet-message">{message}</p>
		<div class="actions">
			<button type="button" class="button button-secondary" onclick={() => (open = false)}>
				Cancelar
			</button>
			<button type="button" class="button button-danger" onclick={confirm}>{confirmLabel}</button>
		</div>
	</div>
</dialog>

<style>
	dialog {
		width: 100%;
		max-width: 100%;
		max-height: 100%;
		margin: auto 0 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
	}

	dialog::backdrop {
		background: rgba(18, 14, 28, 0.5);
	}

	dialog[open] {
		animation: sheet-in 260ms var(--ease-out);
	}

	dialog[open]::backdrop {
		animation: fade-in 200ms ease;
	}

	.sheet {
		padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
		border-radius: 24px 24px 0 0;
		background: var(--color-surface);
		box-shadow: var(--shadow-raised);
	}

	.handle {
		width: 40px;
		height: 4px;
		margin: 0 auto 20px;
		border-radius: var(--radius-pill);
		background: var(--color-border-strong);
		display: block;
	}

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

	.button-danger {
		background: var(--color-danger);
		color: var(--color-on-brand);
	}

	.button-danger:hover {
		filter: brightness(0.95);
	}

	@media (min-width: 640px) {
		dialog {
			width: min(420px, 100% - 32px);
			margin: auto;
		}

		.sheet {
			padding: 24px;
			border-radius: var(--radius-card);
		}

		.handle {
			display: none;
		}

		dialog[open] {
			animation-name: pop-in;
		}
	}

	@keyframes sheet-in {
		from {
			transform: translateY(100%);
		}
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
</style>

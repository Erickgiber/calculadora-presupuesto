<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		labelledBy: string;
		describedBy?: string;
		children: Snippet;
	};

	let { open = $bindable(), labelledBy, describedBy, children }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (open && !dialog?.open) {
			dialog?.showModal();
		} else if (!open && dialog?.open) {
			dialog.close();
		}
	});

	function closeOnBackdrop(event: MouseEvent) {
		if (event.target === dialog) {
			open = false;
		}
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={labelledBy}
	aria-describedby={describedBy}
	onclose={() => (open = false)}
	onclick={closeOnBackdrop}
>
	<div class="sheet">
		<span class="handle" aria-hidden="true"></span>
		{@render children()}
	</div>
</dialog>

<style>
	dialog {
		width: 100%;
		max-width: 100%;
		max-height: 92dvh;
		margin: auto 0 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		overflow: visible;
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
		max-height: 92dvh;
		padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
		border-radius: 24px 24px 0 0;
		background: var(--color-surface);
		box-shadow: var(--shadow-raised);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.handle {
		width: 40px;
		height: 4px;
		margin: 0 auto 20px;
		border-radius: var(--radius-pill);
		background: var(--color-border-strong);
		display: block;
	}

	@media (min-width: 640px) {
		dialog {
			width: min(480px, 100% - 32px);
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

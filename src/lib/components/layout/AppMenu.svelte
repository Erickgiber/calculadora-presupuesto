<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import type { Attachment } from 'svelte/attachments';
	import { CURRENCIES } from '#lib/format/money.ts';
	import { startNewCalculation } from '#lib/navigation.ts';
	import { preferences } from '#lib/state/preferences.svelte.ts';

	interface Props {
		open: boolean;
	}

	interface MenuLink {
		to: RouteId;
		label: string;
		description: string;
	}

	let { open = $bindable() }: Props = $props();

	let dialog: HTMLDialogElement;

	const currency = $derived(preferences.current.currency);
	const primaryLinks: MenuLink[] = $derived([
		{ to: '/', label: 'Inicio', description: 'Tu espacio de trabajo' },
		{ to: '/templates', label: 'Plantillas', description: 'Colores y fondos a tu gusto' },
		{ to: '/appearance', label: 'Apariencia', description: 'Modo claro, oscuro o automático' },
		{ to: '/profile', label: 'Administrar perfil', description: 'Tu nombre y emprendimiento' },
		{
			to: '/currency',
			label: 'Cambiar moneda',
			description: `${currency} · ${CURRENCIES[currency]}`
		},
		{ to: '/history', label: 'Mis cálculos', description: 'Ver, editar o borrar tus cálculos' }
	]);
	const helpLink: MenuLink = {
		to: '/help',
		label: 'Ayuda y datos',
		description: 'Cómo funciona y dónde se guarda'
	};

	$effect(() => {
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	function close() {
		open = false;
	}

	const closeOnBackdropClick: Attachment<HTMLDialogElement> = (node) => {
		const handleClick = (event: MouseEvent) => {
			if (event.target === node) close();
		};
		node.addEventListener('click', handleClick);
		return () => node.removeEventListener('click', handleClick);
	};

	function startCalculation() {
		close();
		startNewCalculation();
	}
</script>

{#snippet menuLink(link: MenuLink)}
	<a href={resolve(link.to)} onclick={close}>
		{link.label}
		<span>{link.description}</span>
	</a>
{/snippet}

<dialog
	id="app-menu"
	bind:this={dialog}
	aria-labelledby="menu-title"
	onclose={close}
	{@attach closeOnBackdropClick}
>
	<div class="menu-panel">
		<div class="menu-top">
			<div>
				<h2 id="menu-title">{preferences.current.name || 'Tu espacio Margen'}</h2>
				<p>{preferences.current.business || 'Crece a tu ritmo'}</p>
			</div>
			<button type="button" class="close-button" aria-label="Cerrar menú" onclick={close}>×</button>
		</div>
		<nav class="menu-options" aria-label="Opciones de la aplicación">
			{#each primaryLinks as link (link.to)}
				{@render menuLink(link)}
			{/each}
			<button type="button" onclick={startCalculation}>
				Nuevo cálculo
				<span>Empezar con otro producto</span>
			</button>
			{@render menuLink(helpLink)}
		</nav>
	</div>
</dialog>

<style>
	dialog {
		width: min(92vw, 420px);
		max-height: 85dvh;
		margin: auto;
		padding: 0;
		overflow-y: auto;
		border: 0;
		border-radius: var(--radius-xl);
		background: var(--app-surface);
		color: var(--app-text);
		box-shadow: 0 20px 80px #291c4040;
	}

	.menu-panel {
		padding: 22px;
	}

	dialog::backdrop {
		background: #20103780;
		backdrop-filter: blur(4px);
	}

	.menu-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.menu-top > div {
		min-width: 0;
	}

	h2 {
		font-size: 22px;
	}

	.menu-top p {
		margin: 0 0 16px;
		font-size: 13px;
	}

	.close-button {
		flex: none;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: var(--radius-md);
		background: var(--app-soft);
		color: var(--app-accent);
		font-size: 28px;
	}

	.menu-options {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.menu-options a,
	.menu-options button {
		display: block;
		width: 100%;
		min-height: 58px;
		padding: 13px 12px;
		border: 0;
		border-radius: var(--radius-md);
		background: transparent;
		color: var(--app-text);
		font-size: 16px;
		text-align: left;
		text-decoration: none;
		touch-action: manipulation;
	}

	.menu-options a:hover,
	.menu-options button:hover,
	.menu-options a:focus-visible,
	.menu-options button:focus-visible {
		background: var(--app-soft);
	}

	span {
		display: block;
		margin-top: 3px;
		color: var(--app-muted);
		font-size: 12px;
	}
</style>

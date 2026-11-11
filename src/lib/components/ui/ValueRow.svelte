<script lang="ts">
	interface Props {
		label: string;
		value: string;
		variant?: 'plain' | 'total' | 'highlight';
	}

	let { label, value, variant = 'plain' }: Props = $props();
</script>

<div class="row {variant}">
	<span>{label}</span>
	<strong>{value}</strong>
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 5px 12px;
		margin: 12px 0;
		color: var(--app-muted);
		font-size: 14px;
	}

	span {
		flex: 1;
		min-width: 120px;
	}

	strong {
		max-width: 100%;
		color: var(--app-text);
		font-weight: 500;
		text-align: right;
		overflow-wrap: anywhere;
	}

	.total {
		padding-top: 14px;
		border-top: 1px solid var(--app-line);
		font-weight: 500;
	}

	.highlight {
		margin-top: 18px;
		padding: 14px;
		border-radius: var(--radius-md);
		background: var(--app-soft);
		font-weight: 500;
	}

	.highlight strong {
		color: var(--app-accent);
	}
</style>

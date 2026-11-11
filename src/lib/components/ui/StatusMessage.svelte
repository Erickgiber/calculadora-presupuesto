<script lang="ts">
	interface Props {
		message: string;
		onBackground?: boolean;
	}

	let { message, onBackground = false }: Props = $props();
</script>

<p class="help status" class:page-note={onBackground} role="status">{message}</p>

<style>
	.status {
		min-height: 20px;
	}

	.status:empty {
		min-height: 0;
		margin: 0;
	}
</style>

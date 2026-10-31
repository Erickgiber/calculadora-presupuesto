<script lang="ts">
	import brandMarkBubble from '#lib/assets/brand/brand-mark-bubble.svg';
	import brandMarkK from '#lib/assets/brand/brand-mark-k.svg';
	import brandMarkO from '#lib/assets/brand/brand-mark-o.svg';
</script>

<div class="brand">
	<span class="sr-only">MargenKo</span>
	<span aria-hidden="true">Margen</span>
	<span class="brand-mark" aria-hidden="true">
		<img src={brandMarkBubble} alt="" />
		<img src={brandMarkK} alt="" />
		<img src={brandMarkO} alt="" />
		<b>Ko</b>
	</span>
</div>

<style>
	.brand {
		color: var(--color-brand-contrast);
		display: flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: 30px;
		letter-spacing: -0.06em;
		line-height: 1;
	}

	.brand-mark {
		position: relative;
		width: 1.1em;
		height: 1.05em;
		margin-left: 0.05em;
	}

	.brand-mark img {
		position: absolute;
	}

	.brand-mark img:nth-child(1) {
		width: 0.95em;
		left: 0;
		top: 0.025em;
	}

	.brand-mark img:nth-child(2) {
		width: 0.675em;
		left: 0.325em;
		top: 0;
	}

	.brand-mark img:nth-child(3) {
		width: 0.7em;
		left: 0.125em;
		top: 0.2em;
	}

	.brand-mark b {
		position: absolute;
		inset: 0.6em auto auto 0.53em;
		z-index: 1;
		color: #6b4caf;
		font-size: 0.375em;
		letter-spacing: -0.067em;
	}
</style>

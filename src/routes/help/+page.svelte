<script lang="ts">
	import Page from '#lib/components/layout/Page.svelte';
	import BackLink from '#lib/components/ui/BackLink.svelte';
</script>

<Page>
	{#snippet intro()}
		<BackLink to="/" label="Inicio" />
		<h1>Ayuda y datos</h1>
	{/snippet}

	<div class="card">
		<h2>Todo queda en tu teléfono</h2>
		<p>
			El perfil, las preferencias y los cálculos se guardan en este navegador. No se sincronizan
			entre dispositivos y pueden perderse si borras los datos del navegador.
		</p>
		<h2>¿Cómo calculamos?</h2>
		<p>Costo total = materiales + horas × tarifa + otros gastos.</p>
		<p>
			En la producción por lote dividimos los costos entre las unidades del lote para obtener el
			costo de cada unidad.
		</p>
		<p>Precio = costo total ÷ (1 − margen / 100). Redondeamos a centavos.</p>
		<h2>Monedas</h2>
		<p>
			Cada cálculo conserva su propia moneda. Cambiar tu preferencia no convierte los importes
			guardados.
		</p>
	</div>
</Page>

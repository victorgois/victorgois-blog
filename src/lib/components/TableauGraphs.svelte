<script>
	import { onMount, afterUpdate } from "svelte";
	let isVisible = false;

	onMount(() => {
		loadTableau();
	});

	afterUpdate(() => {
		if (isVisible) {
			loadTableau();
		}
	});

	function loadTableau() {
		var divElement = document.getElementById("viz1710960301631");
		if (divElement && !divElement.querySelector("object")) {
			var vizElement = document.createElement("object");
			vizElement.style.width = "100%";
			vizElement.style.height = divElement.offsetWidth * 0.75 + "px";
			vizElement.className = "tableauViz";
			vizElement.style.display = "block";

			var scriptElement = document.createElement("script");
			scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
			scriptElement.onload = () => {
				// Aqui você pode adicionar qualquer código necessário após o carregamento do script
			};

			divElement.appendChild(vizElement);
			divElement.appendChild(scriptElement);
		}
	}

	function toggleVisibility() {
		isVisible = !isVisible;
	}
</script>

<h4>Gráficos Tableau</h4>

<!-- Div que funciona como botão -->
<button
	on:click={toggleVisibility}
	style="cursor: pointer; border: none; background: none; padding: 0; font: inherit; color: inherit; text-align: left;"
>
	Trending Topics Twitter | Atravessamentos Política e Pandemia
</button>

<div
	class="tableauPlaceholder {isVisible ? '' : 'hidden'}"
	id="viz1710960301631"
	style="position: relative;"
>
	<noscript>
		<img
			alt="Trending Topics Twitter | Atravessamentos Política e Pandemia |  26/01-21/06/20Hashtags/Tópicos Trending x Tempo "
			src="https://public.tableau.com/static/images/ev/everyHashtagsTrending/Sheet12/1_rss.png"
			style="border: none"
		/>
	</noscript>
	<object class="tableauViz" style="display:none;" aria-label="tableauViz">
		<param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
		<param name="embed_code_version" value="3" />
		<param name="site_root" value="" />
		<param name="name" value="everyHashtagsTrending/Sheet12" />
		<param name="tabs" value="no" />
		<param name="toolbar" value="yes" />
		<param
			name="static_image"
			value="https://public.tableau.com/static/images/ev/everyHashtagsTrending/Sheet12/1.png"
		/>
		<param name="animate_transition" value="yes" />
		<param name="display_static_image" value="yes" />
		<param name="display_spinner" value="yes" />
		<param name="display_overlay" value="yes" />
		<param name="display_count" value="yes" />
		<param name="language" value="pt-BR" />
	</object>
</div>

<style>
	.hidden {
		display: none;
	}
</style>

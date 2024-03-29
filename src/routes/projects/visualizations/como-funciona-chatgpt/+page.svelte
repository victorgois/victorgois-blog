<script lang="ts">
	import AnimatedText from "../../../../lib/components/AnimatedText.svelte";
	import TextCard from "../../../../lib/components/TextCard.svelte";
	import { onMount, onDestroy } from "svelte";
	import * as d3 from "d3";
	import { reveal } from "svelte-reveal";

	function calculateTextPositions(svg: any, words: string[], spacing: number) {
		const textNodes = svg
			.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.text((d: any) => d);

		let positions: any = [];
		let totalWidth = 0;

		// Calcular a largura total dos textos
		textNodes.each(function (d: any) {
			const textLength = d.length;
			const textWidth = textLength * 10; // Ajuste este valor conforme necessário
			totalWidth += textWidth;
		});

		// Calcular as posições horizontais dos textos
		let currentX = 0;
		textNodes.each(function (d: any) {
			const textLength = d.length;
			const textWidth = textLength * 10; // Ajuste este valor conforme necessário
			positions.push(currentX);
			currentX += textWidth + spacing;
		});

		// Remover os nós de texto após o cálculo das posições
		textNodes.remove();

		return positions;
	}
	onMount(() => {
		// Add google fonts
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);

		const svg = d3.select("#pao-de-queijo-svg");

		const words = ["Nós", "gostamos", "de", "pão", "de", "queijo"];
		const wordSpacing = 10;
		const positions = calculateTextPositions(svg, words, wordSpacing);
		// Espaçamento entre as palavras

		svg
			.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.text((d) => d)
			.attr("x", (d, i) => positions[i] + wordSpacing * i) // Posiciona as palavras horizontalmente
			.attr("y", 250) // Altura fixa para todas as palavras
			.style("font-size", "16px")
			.style("fill", "black")
			.style("cy", "105");

		function animateText() {
			svg.append("g").attr("id", "rects");
			svg.append("g").attr("id", "words");

			svg
				.select("#rects")
				.selectAll("rect")
				.data([0, 1, 2, 3, 4])
				.enter()
				.append("rect")
				.attr("x", (d, i) => i)
				.append("use")
				.transition()
				.duration(1000)
				.attr("y", 0)
				.attr("width", 50) // Largura do retângulo
				.attr("height", 250) // Altura do retângulo
				.style("fill", "white")
				.style("stroke", "black")
				.style("stroke-dasharray", "5,5");
		}

		/* svg
			.selectAll("text")
			.transition()
			.duration(1000)
			.attr("x", (d, i) => i * 250 + i * 10) // Adicionar padding horizontal aos textos
			.attr("y", 250) // Manter a posição vertical fixa
			.style("font-size", "20px")
			.style("fill", "black")
			.style("cy", "110"); */
	});
</script>

<main on:scroll={() => console.log("funciona")}>
	<div class="progressBar" />
	<div class="container">
		<h6>Inteligência Artificial</h6>
		<h1>
			<span>A </span><span>matemática </span>por <span>trás </span> <span />do <span />
			<span>ChatGPT </span> <span>e </span> <span>de </span> <span>outros </span> <span>LLMs</span>
		</h1>

		<AnimatedText />

		<p class="authorship" use:reveal={{ transition: "fade", duration: 1000 }}>
			Criado por <a href="https://github.com/victorgois">Victor Góis</a> inspirado nas reportagens
			do
			<a
				href="https://www.theguardian.com/technology/ng-interactive/2023/nov/01/how-ai-chatbots-like-chatgpt-or-bard-work-visual-explainer"
				>The Guardian</a
			>
			e <a href="https://ig.ft.com/generative-ai/">Financial Times</a>
		</p>
		<div class="content" use:reveal={{ transition: "fade", duration: 1000 }}>
			<p class="subhead">
				Você já usou o ChatGPT hoje? Segundo o Traffic Analytics, os brasileiros ficaram em 4º lugar
				no mês de janeiro de 2024, garfando 5,16% do tráfego total da plataforma da OpenAI. Então,
				vamos supor que você faz uso dessa ferramenta diariamente, seja em tarefas do trabalho, seja
				em tarefas do seu cotidiano. A questão é: você realmente tem noção de como essas tecnologias
				funcionam?
			</p>

			<p>
				O ChatGPT, assim como o Bard, o GPT da Google, são os chamados LLMs (Large language models).
				LLMs são modelos treinados usando grandes corpus textuais, gerando textos prevendo a próxima
				palavra em uma sequência. Eles são capazes de gerar texto de um jeito natural e coerente,
				mas não são capazes de entender o contexto das palavras que sugerem. Pelo menos, não da
				mesma forma que nós humanos.
			</p>
		</div>
	</div>
	<div class="longContainer" use:reveal={{ transition: "fade", duration: 1000 }}>
		<TextCard
			content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
		/>
		<div class="animationContent">
			<svg id="pao-de-queijo-svg" width="100%" height="100%" />
		</div>
	</div>
	<div style="height: 500px;" />
</main>

<style>
	.container {
		max-width: 800px;
		margin-left: 2em;
		padding-left: 2em;
		padding-top: 4em;
	}

	.longContainer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1000px;
	}

	.content {
		margin: 2em 4em 0 4em;
	}

	h1 {
		margin: 0.5em 0 1em 0;
		font-size: 62px;
		line-height: 1.25;
		font-family: "Playfair Display", serif;
	}

	.subhead::first-letter {
		-webkit-initial-letter: 2;
		initial-letter: 2;
		color: var(--color);
		font-weight: bold;
		margin-right: 0.75em;
	}

	h6 {
		margin: 0;
	}
	.authorship {
		margin-top: 3rem;
		color: var(--secondaryColor);
		font-size: 12px;
	}

	.authorship a {
		color: var(--secondaryColor);
		font-weight: 600;
	}

	p {
		font-family: Georgia, serif;
		font-size: 18px;
	}

	.animationContent {
		height: 500px;
		align-content: center;
		margin: 1em;
		font-size: 28px;
		width: 365px;
		max-width: 365px;
	}

	.progressBar {
		position: fixed;
		top: 0;
		left: 0;
		width: 0;
		height: 4px;
		background-color: var(--secondaryColor);
		z-index: 1000;
		transition: width 0.3s;
	}
</style>

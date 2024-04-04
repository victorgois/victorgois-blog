<script lang="ts">
	import AnimatedText from "../../../../lib/components/AnimatedText.svelte";
	import TextCard from "../../../../lib/components/TextCard.svelte";
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import { reveal } from "svelte-reveal";
	import ProgressBar from "../../../../lib/components/ProgressBar.svelte";

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
			const textWidth = textLength; // Ajuste este valor conforme necessário
			totalWidth += textWidth;
		});

		// Calcular as posições horizontais dos textos
		let currentX = 0;
		textNodes.each(function (d: any) {
			const textLength = d.length;
			const textWidth = textLength * 21; // Ajuste este valor conforme necessário
			positions.push(currentX);
			currentX += textWidth + spacing;
		});

		// Remover os nós de texto após o cálculo das posições
		textNodes.remove();
		return positions;
	}

	function setElementsOpacity() {
		const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollTop >= 50) {
			const spans = document.querySelectorAll(".container span") as NodeListOf<HTMLSpanElement>;
			spans.forEach((span: HTMLSpanElement, index: number) => {
				span.style.transition = `opacity ${index * 0.2}s`;
				span.style.opacity = "0";
			});
		} else {
			const spans = document.querySelectorAll(".container span") as NodeListOf<HTMLSpanElement>;
			spans.forEach((span: HTMLSpanElement, index: number) => {
				span.style.transition = `opacity ${index * 0.2}s`;
				span.style.opacity = "1";
			});
		}
	}

	function addGoogleFonts() {
		// Add google fonts
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}

	function addDynamicPadding() {
		const scrollWordEmbeddingSection = document.querySelector(
			".scroll-word-embedding"
		) as HTMLElement;
		scrollWordEmbeddingSection.style.opacity = "1";
		const longContainer = document.querySelector(".long-container") as HTMLElement;

		const contentSection = document.querySelector(".content") as HTMLElement;
		const gapSection = document.querySelector(".gap-section") as HTMLElement;

		const viewportHeight = window.innerHeight;
		const mainSectionHeight = contentSection.offsetHeight;
		const leftColumn = document.querySelector(".left-column") as HTMLElement;
		const scrollTop = document.body.scrollTop as number;

		if (leftColumn && contentSection && scrollWordEmbeddingSection && gapSection) {
			gapSection.style.height = `${viewportHeight}px`;
			const gapHeight =
				viewportHeight + (viewportHeight - mainSectionHeight) + (scrollTop - mainSectionHeight);

			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						scrollWordEmbeddingSection.style.overflow = "hidden";
						longContainer.style.overflowY = "auto";
					} else {
						scrollWordEmbeddingSection.style.overflow = "hidden";
						longContainer.style.overflowY = "hidden";
						gapSection.style.height = `${gapHeight}px`;
					}
				});
			});

			observer.observe(contentSection);
		}
	}

	function drawSvg() {
		// add svg to right column
		const svg = d3.select("#first-animated-phrase-svg");

		const words = ["Nós", "vamos", "de", "bicicleta"];
		const wordSpacing = 20;
		const positions = calculateTextPositions(svg, words, wordSpacing);

		// Espaçamento entre as palavras
		svg
			.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.text((d) => d)
			.attr("x", (d, i) => positions[i] + wordSpacing) // Posiciona as palavras horizontalmente
			.attr("y", 250) // Altura fixa para todas as palavras
			.style("font-size", "36px")
			.style("fill", "black")
			.style("cy", "105");

		svg.selectAll("text").each(function () {
			const textElement = this as SVGTextElement;
			const bbox = textElement.getBBox();
			if (bbox) {
				svg
					.insert("rect", ":first-child") // Insere um retângulo antes de cada texto
					.transition()
					.attr("x", bbox.x)
					.attr("y", bbox.y)
					.attr("width", bbox.width)
					.attr("height", bbox.height)

					.style("fill", "white") // Fundo branco
					.style("stroke", "black") // Borda preta
					.style("stroke-dasharray", "3") // Borda pontilhada
					.style("pointer-events", "none") // Evita que os cards bloqueiem eventos do mouse
					.style("padding", "10px") // Evita que os cards bloqueiem eventos do mouse
					.style("display", "none");
			}
		});
	}

	function tokenizeSvg() {
		let currentPosition = 0;
		const svg = d3.select("#first-animated-phrase-svg");

		// Primeira transição para ajustar o estilo dos textos e criar os retângulos (cards)
		svg
			.selectAll("text")
			.transition()
			.duration(2000)
			.style("font-size", "24px")
			.style("font-family", "Arial")
			.attr("x", (d: any, i) => {
				const wordWidth = d.length * 10; // Ajuste o valor conforme necessário
				const position = currentPosition;
				if (d === "vamos") {
					currentPosition += wordWidth + 40;
				} else {
					currentPosition += wordWidth + 25;
				}

				// Criar retângulo (card) na mesma posição do texto
				const bbox = (svg.selectAll("text").nodes()[i] as SVGTextElement).getBBox();
				const spacing = 20;
				svg
					.insert("rect", ":first-child")
					.attr("x", bbox.x)
					.attr("y", bbox.y)
					.attr("width", bbox.width + spacing)
					.style("fill", "white")
					.style("stroke", "black")
					.style("stroke-dasharray", "3")
					.style("pointer-events", "none")
					.transition()
					.duration(2000);

				return position;
			});
	}

	function unTokenizeSvg() {
		const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		let currentPosition = 0;

		if (scrollTop < 50) {
			const svg = d3.select("#first-animated-phrase-svg");

			svg
				.selectAll("text")
				.transition()
				.duration(2000)
				.style("font-size", "36px")
				.style("font-family", "Playfair Display")
				.attr("x", (d: any, i) => {
					const wordWidth = d.length * 10; // Adjust the value as needed
					const position = currentPosition;
					if (d === "vamos") {
						currentPosition += wordWidth + 75;
						return position; // Add spacing between wordse
					}
					currentPosition += wordWidth + 50; // Add spacing between words
					return position;
				});
		}
	}

	function checkCardPosition() {
		const cards = document.querySelectorAll(".text-card");
		cards.forEach((card, index) => {
			const windowHeight = window.innerHeight;

			(card as HTMLElement).style.marginBottom = `${windowHeight}px`;
		});
		const secondCard = document.querySelector("#text-card1") as HTMLElement;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					tokenizeSvg();
				}
			});
		});
		observer.observe(secondCard);
	}

	onMount(() => {
		document.body.addEventListener("scroll", () => {
			addGoogleFonts();
			setElementsOpacity();
			addDynamicPadding();
			drawSvg();
			checkCardPosition();
			unTokenizeSvg();
		});
	});
</script>

<section class="main">
	<ProgressBar />
	<div class="container">
		<h6><span>Inteligência Artificial</span></h6>
		<h1>
			<span>A </span><span>matemática </span><span>por</span> <span>trás </span> <span /><span
				>do</span
			> <span />
			<span>ChatGPT </span> <span>e </span> <span>de </span> <span>outros </span>
			<span>LLMs</span>
		</h1>

		<AnimatedText />
		<p class="authorship" use:reveal={{ transition: "fade", duration: 1000 }}>
			<span>
				Criado por <a href="https://github.com/victorgois">Victor Góis</a> inspirado nas reportagens
				do
				<a
					href="https://www.theguardian.com/technology/ng-interactive/2023/nov/01/how-ai-chatbots-like-chatgpt-or-bard-work-visual-explainer"
					>The Guardian</a
				>
				e <a href="https://ig.ft.com/generative-ai/">Financial Times</a>
			</span>
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
</section>

<section class="scroll-word-embedding">
	<div class="long-container">
		<div class="left-column">
			<div class="gap-section" />

			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem."
				id={"text-card" + "0"}
			/>
			<TextCard
				content="Primeiramente, uma frase é quebrada em pedaços menores, que chamamos de tokens. Geralmente, tokens são parte de palavras, mas vamos considerar nesse exemplo que um token é uma palavra."
				id={"text-card" + "1"}
			/>
			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
				id={"text-card" + "2"}
			/>
			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
				id={"text-card" + "3"}
			/>
			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
				id={"text-card" + "4"}
			/>
			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
				id={"text-card" + "5"}
			/>
			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
				id={"text-card" + "6"}
			/>
		</div>
		<div class="right-column">
			<div class="animationContent">
				<svg id="first-animated-phrase-svg" width="100%" height="100%" />
			</div>
		</div>
	</div>
</section>

<style>
	.main {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.gap-section {
		height: 0px;
	}

	.container {
		max-width: 800px;
		margin-left: 2em;
		padding-left: 2em;
		padding-top: 4em;
	}

	.scroll-word-embedding {
		width: 100%;
		height: 100vh;
		opacity: 0;
	}

	.long-container {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		overflow-y: auto;
		height: inherit;
	}

	.long-container::-webkit-scrollbar {
		display: none;
	}

	.left-column {
		padding-top: 4em;
		margin-left: 4em;
		height: 100vh;
	}

	.right-column {
		min-width: 500px;
		position: sticky;
		top: 0;
	}

	.content {
		margin: 2em 4em 2em 4em;
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
		margin-top: 2rem;
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
	}
</style>

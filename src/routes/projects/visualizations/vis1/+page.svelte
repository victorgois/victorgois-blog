<script>
	import AnimatedText from "../../../../lib/components/AnimatedText.svelte";
	import TextCard from "../../../../lib/components/TextCard.svelte";
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import { reveal } from "svelte-reveal";

	onMount(() => {
		// Add google fonts
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);

		const svg = d3.select("#pao-de-queijo-svg");

		const words = ["Nós", "gostamos", "de", "pão", "de", "queijo"];
		const wordSpacing = 10; // Espaçamento entre as palavras
		const wordSize = 50;

		svg
			.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.text((d) => d)
			.attr("x", (d, i) => i * wordSize + i * wordSpacing) // Posiciona as palavras horizontalmente
			.attr("y", 20) // Altura fixa para todas as palavras
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
				.attr("x", (d, i) => i * wordSize + i * wordSpacing)
				.append("use")
				.transition()
				.duration(1000)
				.attr("y", 0)
				.attr("width", 50) // Largura do retângulo
				.attr("height", 20) // Altura do retângulo
				.style("fill", "white")
				.style("stroke", "black")
				.style("stroke-dasharray", "5,5");
		}
		svg
			.selectAll("text")
			.transition()
			.duration(1000)
			.attr("x", (d, i) => i * 20 + i * 10) // Adicionar padding horizontal aos textos
			.attr("y", 20) // Manter a posição vertical fixa
			.style("font-size", "20px")
			.style("fill", "black")
			.style("cy", "110");

		function handleScroll() {
			const triggerPosition = 0; // Posição do scroll para iniciar a animação
			console.log(window.scrollY);
			if (window.scrollY >= triggerPosition) {
				animateText();
			}
		}

		window.addEventListener("scroll", handleScroll);

		// Chamar a função uma vez para verificar se a animação é acionada corretamente
		handleScroll();

		// Limpar o event listener quando o componente for desmontado
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	});

	function handleUnreveal() {
		const triggerPosition = 1; // Posição do scroll para iniciar a animação
		const element = document.querySelector("#mainPart");
		if (element && window.scrollY >= triggerPosition) {
			// Esconde o elemento
		}
	}
</script>

<main>
	<div
		id="mainPart"
		use:reveal={{ transition: "fade", duration: 1000, onRevealEnd: handleUnreveal }}
	>
		<h6>Inteligência Artificial</h6>
		<h1>
			Você sabe como um chatbot como o ChatGPT
			<span use:reveal={{ transition: "fade", duration: 1000 }}>funciona</span>
		</h1>

		<AnimatedText />
	</div>

	<p class="authorship" use:reveal={{ transition: "fade", duration: 1000 }}>
		Criado por <a href="https://github.com/victorgois">Victor Góis</a> inspirado nas reportagens do
		<a
			href="https://www.theguardian.com/technology/ng-interactive/2023/nov/01/how-ai-chatbots-like-chatgpt-or-bard-work-visual-explainer"
			>The Guardian</a
		>
		e <a href="https://ig.ft.com/generative-ai/">Financial Times</a>
	</p>
	<div class="content" use:reveal={{ transition: "fade", duration: 1000 }}>
		<p class="subhead">
			Você já usou o ChatGPT hoje? Os brasileiros garfaram 5,16% do tráfego total da plataforma da
			OpenAI, segundo o Traffic Analytics, ficando em 4º lugar no mês de janeiro de 2024. Então,
			vamos supor que você, igual a mim, também tem entre 25 e 34 anos (a faixa etária que mais usa
			a ferramenta), mas tem dúvidas de como funciona a ferramenta, tão útil quanto controversa. O
			ChatGPT, assim como o Bard, o GPT da Google, são os chamados LLMs (Large language models).
		</p>

		<p>
			LLMs são modelos treinados usando grandes corpus textuais, gerando textos prevendo a próxima
			palavra em uma sequência. Eles são capazes de gerar texto de um jeito natural e coerente, mas
			não são capazes de entender o contexto das palavras que sugerem. Pelo menos, não da mesma
			forma que nós humanos.
		</p>

		<div class="row" use:reveal={{ transition: "fade", duration: 1000 }}>
			<TextCard
				content="Para escrever texto, LLMs deve primeiramente transformar palavras em uma linguagem que eles entendem"
			/>
			<svg id="pao-de-queijo-svg" width="50%" height="50%" />
		</div>
	</div>
</main>

<style>
	main {
		margin: 2em;
		padding: 1em;
		/*
		text-align: start;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center; */
	}

	.content {
		margin: 2em;
	}

	h1 {
		margin: 0.5em 0 1em 0;
		font-size: 72px;
		line-height: 1.25;
		font-family: "Playfair Display", serif;
	}

	.subhead::first-letter {
		-webkit-initial-letter: 2;
		initial-letter: 2;
		color: white;
		font-weight: bold;
		margin-right: 0.75em;
	}

	h6 {
		margin: 0;
	}
	.authorship {
		margin-top: 3rem;
		color: gray;
		font-size: 12px;
	}

	p {
		font-family: Georgia, serif;
		font-size: 18px;
	}

	.row {
		display: flex;
	}
</style>

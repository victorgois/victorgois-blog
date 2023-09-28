<script>
	let canvasWidth = 350; // Defina a largura inicial
	let canvasHeight = 350;
	// @ts-ignore
	let canvas; // Referência para o elemento canvas
	// @ts-ignore
	let context; // Contexto de renderização 2D

	// Função para inicializar o contexto 2D
	function initCanvas() {
		canvas = document.getElementById("myCanvas");
		// @ts-ignore
		context = canvas.getContext("2d");
	}

	function handleClick() {
		canvasWidth *= 1.2;
		canvasHeight *= 1.2;
		drawCanvas();
	}

	// Função para desenhar no canvas com as dimensões atualizadas
	function drawCanvas() {
		// @ts-ignore

		context.fillStyle = `hsl(${canvasWidth / 40}, 100%, 50%)`;
		// @ts-ignore
		context.clearRect(0, 0, canvas.width, canvas.height);
		// @ts-ignore
		context.fillRect(60, 20, canvasWidth, canvasHeight);
	}

	// Inicializar o contexto quando o componente for montado
	import { onMount } from "svelte";
	onMount(initCanvas);

	// Desenhar o canvas inicialmente
	// @ts-ignore
	$: {
		// @ts-ignore
		if (canvas && context) {
			drawCanvas();
		}
	}
</script>

<svelte:head>
	<title>Victor Góis</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<div class="presentation">
				<h2>Hi! <br /> I'm Victor, a Journalist/FrontEnd Engineer, specializing in JavaScript.</h2>
				<p>
					I am used to work with Js, Es6 and its fullstack environment. I have experience building
					web apps and analying data. Also a big fan of data journalism and digital storytelling,
					studying d3.js and three.js to future projects. As a journalist, I want to tell digital,
					interactive stories (with data) that matter to my community.
				</p>
			</div>
			<canvas
				id="myCanvas"
				style="width: {canvasWidth}px; height: {canvasHeight}px; cursor: pointer;"
				on:click={handleClick}
			/>
		</div>
		<div class="row" />
	</div>
</main>

<style>
	a {
		color: white;
		text-decoration: none;
	}
	main {
		text-align: center;
		padding: 0;
		margin: 0 auto;
		text-align: center;

		display: flex;
		flex-direction: column;
		height: calc(100vh - 80px - 88px);
		justify-content: center;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	h2 {
		font-weight: 700;
	}

	.presentation {
		text-align: start;
		width: 50%;
	}

	.selfImage {
		width: 50%;
		height: 250px;
	}

	.icons {
		display: flex !important;
		align-items: center;
		gap: 20px;
		cursor: pointer;
		justify-content: space-between;
	}

	.icon {
		cursor: pointer;
		transition: color 0.2s ease-in-out;
		width: 40px;
	}
	.icon:hover {
		color: #050424;
	}

	@media (max-width: 900px) {
		main {
			margin-left: 4rem;
		}
	}

	@media (min-width: 600px) {
		main {
			max-width: none;
		}
	}
</style>

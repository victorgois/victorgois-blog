<script>
	let canvasWidth = 350; // Defina a largura inicial
	let canvasHeight = 350;
	// @ts-ignore
	let canvas; // Referência para o elemento canvas
	// @ts-ignore
	let context; // Contexto de renderização 2D

	// Função para desenhar no canvas com as dimensões atualizadas
	function drawCanvas() {
		// @ts-ignore

		context.fillStyle = `hsl(${canvasWidth / 40}, 100%, 50%)`;
		// @ts-ignore
		context.clearRect(0, 0, canvas.width, canvas.height);
		// @ts-ignore
		context.fillRect(60, 20, canvasWidth, canvasHeight);
	}

	// Desenhar o canvas inicialmente
	// @ts-ignore
	$: {
		// @ts-ignore
		if (canvas && context) {
			drawCanvas();
		}
	}

	import Typewriter from "svelte-typewriter";
</script>

<svelte:head>
	<title>Victor Góis</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<div class="presentation">
				<h1>Hi! I'm Victor, a Journalist/FrontEnd Engineer, specializing in JavaScript.</h1>
				<Typewriter>
					<p>
						I work with Es6, nodeJs, react and js fullstack environment. My main experiences are building
						web apps, but I am also a big fan of data journalism and digital storytelling. Currently, I'm
						studyingd3.js and three.js to future projects. As a developer I want to understand deeply the JavaScript language and tools to provide the best user experience. As a journalist, I want to communicate relevant data through,
						interactive stories.
					</p>
				</Typewriter>
			</div>

			<!-- <canvas
				id="myCanvas"
				style="width: {canvasWidth}px; height: {canvasHeight}px; cursor: pointer;"
				on:click={handleClick}
			/> -->
		</div>
		<div class="row" />
	</div>
</main>

<style>
	a {
		color: white;
		text-decoration: underline red;
		text-decoration-thickness: 0.4rem;
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

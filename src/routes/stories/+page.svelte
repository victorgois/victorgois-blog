<script>
	import skills from "$lib/Skills";
	import { customBackground } from "$lib/store";

	customBackground.set("#3E7941");
</script>

<svelte:head>
	<title>Victor Góis — Stories</title>
</svelte:head>

<div class="container">
	<main>
		<h1>Stories</h1>
		<p>
			
		</p>
		<!-- <h2>Skills</h2>
		{#each Object.entries(skills) as [section, technologies]}
			<ul>
				<li>
					<h4>
						{section}:
					</h4>
					<div class="list">
						{#each technologies as technology}
							<div>
								{technology}
							</div>
						{/each}
					</div>
				</li>
			</ul>
		{/each} -->
	</main>
</div>

<style>
	.container {
		max-width: 900px;
		padding: 0;
		display: flex;
		justify-content: center;
	}

	main {
		max-width: 100%;
		min-height: 500px;
		text-align: left;
		margin: 0 auto;
		box-sizing: border-box;
	}

	h1 {
		font-weight: 700;
		margin: 0 0 50px 0;
		font-size: 36px;
		text-align: start;
	}

	h2 {
		margin-top: 50px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
  @media (max-width: 900px) {
    main {
      margin: 20px;
    }
  }

	@media (min-width: 900px) {
		.list {
			flex-direction: row;
		}
    
		main > h1 {
			font-size: 48px;
		}
	}
</style>

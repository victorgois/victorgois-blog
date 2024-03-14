<script>
	import { t } from "../../i18n";
	import Timeline from "../../lib/components/Timeline.svelte";
	import { reveal } from "svelte-reveal";

	const menuItems = [0, 1, 2, 3, 4, 5];
	const menuContent = [
		{
			Title: "Visão geral",
			Content:
				"<p style='font-size: 14px'>Eu sou Victor, jornalista, formado pela <a href='https://ufmg.br/'>Universidade Federal de Minas Gerais</a>. Trabalho com tecnologia há cerca de 7 anos, sendo os ultimos três como desenvolvedor de software em empresas de diversos segmentos.</p>"
		},
		{
			Title: "Formação acadêmica",
			Content:
				"<li style='list-style-type: none; font-size: 12px'><b>2021 - 2023</b>  Mestrado em Comunicação Social. <a href='https://ufmg.br/'>Universidade Federal de Minas Gerais</a>, UFMG, Brasil. Título: <i>A verdade nas Deepfakes. Uma análise semiótica de deepfakes nas eleições 2022</i>, Ano de Obtenção: 2023. Orientador: Geane Carvalho Alzamora. Coorientador: Conrado Mendes.Palavras-chave: semiótica; deepfakes; inteligência artificial</li> <li style='list-style-type: none; font-size: 12px'> <br /><b>2017 - 2021</b> Graduação em Jornalismo. <a href='https://ufmg.br/'>Universidade Federal de Minas Gerais</a>, UFMG, Brasil. Título: <i>PROTOCOLOS, PLATAFORMAS E APIS, Experimentações com dados do Google News, Twitter e YouTube sobre o #BrequeDosApps.</i> Orientador: Carlos Frederico de Brito D'Andréa. Bolsista do(a): Conselho Nacional de Desenvolvimento Científico e Tecnológico, CNPq, Brasil.</li><li style='list-style-type: none; font-size: 12px'> <br /><b>2014 - 2015</b> Intercâmbio acadêmico <a href='https://www.hs-schmalkalden.de/en/'>University Of Applied Sciences Schmalkalden</a>, Alemanha</li></li><li style='list-style-type: none; font-size: 12px'> <br /><b>2011 - 2016</b> Graduação interrompida em 2016 em Sistemas de Informação. <a href='https://ufmg.br/'>Universidade Federal de Minas Gerais</a>, UFMG, Brasil</li>"
		},
		{
			Title: "Trabalho acadêmico publicado",
			Content:
				"<li style='list-style-type: none; font-size: 12px'>GÓIS, V. O. P; ALZAMORA, G. C. . <i>#perguntacorona: procedimentos metodológicos.</i> In: Geane Alzamora, Conrado Moreira Mendes, Daniel Melo Ribeiro. (Org.). Sociedade da desinformação e infodemia. 1ed.Belo Horizonte: Selo PPGCOM/UFMG, 2021, v. , p. 9-231.</li><br/><li style='list-style-type: none; font-size: 12px'>PACHECO, V. G. O.; SILVA, P. I. R. . <i>O ECOSSISTEMA POLÍTICO NO YOUTUBE: UMA ANÁLISE DE REDE DOS YOUTUBERS INDICADOS PELO PRESIDENTE. 2019.</i> (Apresentação de Trabalho/Simpósio).</li><br /><li style='list-style-type: none; font-size: 12px'>PACHECO, V. G. O.; FACHARDO, I. ; TEIXEIRA, G. . <i>Lésbicas no YouTube: análises e visualizações</i>. 2019. (Apresentação de Trabalho/Seminário).</li>"
		},
		{
			Title: "Projetos de software",
			Content: "Explore meus projetos de software no github."
		},
		{
			Title: "Tech blog",
			Content:
				"Descubra nossas publicações mais recentes no blog dev.to, cobrindo uma variedade de tópicos de tecnologia."
		},
		{
			Title: "Outras escritas",
			Content:
				"Descubra nossas publicações mais recentes no blog dev.to, cobrindo uma variedade de tópicos de tecnologia."
		}
	];

	/**
	 * @type {number | null}
	 */
	let selectedMenuItem = null;

	const handleClick = (/** @type {number} */ item) => {
		selectedMenuItem = item;
	};
</script>

<svelte:head>
	<title>Victor Góis — Projects</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<div class="menuWrapper">
				<ul>
					{#each menuItems as item, index (item)}
						<li>
							<button style="animation-delay: {index * 0.3}s;" on:click={() => handleClick(item)}>
								{$t(`project.menu${item}`)}</button
							>
						</li>
					{/each}
				</ul>
			</div>
			<div class="menuContent">
				{#if selectedMenuItem !== null}
					<div use:reveal={{ transition: "fade" }} class="content">
						<h4>{menuContent[selectedMenuItem].Title}</h4>
						<p use:reveal={{ transition: "fade" }}>{@html menuContent[selectedMenuItem].Content}</p>
					</div>
				{:else}
					<div class="content">
						<h4>{menuContent[0].Title}</h4>
						<p use:reveal={{ transition: "fade" }}>{@html menuContent[0].Content}</p>
					</div>
				{/if}
			</div>
		</div>
		{#if selectedMenuItem === null || selectedMenuItem === 0}
			<div class="row">
				<div class="timelineWrapper">
					<h4>Timeline profissional</h4>
					<Timeline />
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	.timelineWrapper {
		text-align: center;
	}

	.timelineWrapper h4 {
		font-size: large;
		text-decoration: underline;
		text-decoration-thickness: 8px;
	}
	main {
		padding: 0;
		text-align: start;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 700px;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.menuWrapper {
		display: flex;
		flex-grow: 0;
		flex-basis: 40%;
	}

	.menuWrapper ul {
		margin-right: 2em;
		list-style-type: none;
		padding: 0;
	}

	.menuContent {
		flex-grow: 0;
		flex-basis: 60%;
	}

	button {
		font-weight: 700;
		text-align: start;
		margin: 0 auto;
		cursor: pointer;
	}
</style>

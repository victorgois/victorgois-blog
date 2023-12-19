<script>
</script>

<svelte:head>
	<title>Victor Góis — Stories</title>
</svelte:head>

<div class="container">
	<main>
		<h1>
			O Mapa da Ilusão Imobiliária: onde jovens de sonham, mas não
			compram
		</h1>

		<h2>Introdução:</h2>
		<p>
			Belo Horizonte, a bela capital das montanhas, terra do pão de queijo e dos horizontes abertos.
			Para muitos jovens adultos, BH representa um sonho, mas infelizmente, também é o local onde
			esse sonho da casa própria parece cada vez mais inatingível. Nossa reportagem guiada por dados
			mergulhará nas complexidades dos preços dos imóveis em cada bairro da cidade, enquanto
			adicionamos uma pitada de sarcasmo e humor ao mostrar como a geração atual está navegando em
			um mar de aluguéis.
		</p>

		<h2>Pauta da Reportagem:</h2>

		<h3>O Sonho vs. A Realidade:</h3>
		<p>
			Começaremos com uma comparação impactante entre o sonho da casa própria e a dura realidade dos
			jovens adultos de BH. Mostraremos como a inflação imobiliária está transformando a casa
			própria em algo mais raro do que uma galinha com dentes.
		</p>

		<h3>Mapa dos Preços:</h3>
		<p>
			Utilizando um mapa interativo, exibiremos os valores médios de imóveis em cada bairro de Belo
			Horizonte. Preparem-se para alguns choques de realidade quando descobrirem que até uma vaga de
			garagem em alguns lugares custa uma fortuna.
		</p>

		<h3>O Custo-Benefício de Cada Bairro:</h3>
		<p>
			Vamos analisar os preços dos imóveis à luz de fatores como áreas verdes, cobertura de
			transporte público, e comércio local. Preparem-se para descobrir que o bairro dos seus sonhos
			talvez não seja tão vantajoso quanto você pensava.
		</p>

		<h3>A Lenda do Bairro Verde:</h3>
		<p>
			Investigaremos os bairros com mais áreas verdes, mostrando como essas zonas "verdes" se
			traduzem em preços "vermelhos" para a geração dos jovens adultos.
		</p>

		<h3>Transporte Público: De Quem é a Culpa?</h3>
		<p>
			Vamos examinar a relação entre a cobertura de transporte público e os preços dos imóveis. Será
			que você deve culpar a falta de metrô pelo preço exorbitante daquele apartamento dos seus
			sonhos?
		</p>

		<h3>Comércio Local e Cafeterias Descoladas:</h3>
		<p>
			Descubra como a proliferação de cafeterias descoladas afeta diretamente os preços dos imóveis
			em certos bairros. Será que o seu amor por café gourmet está custando caro demais?
		</p>

		<h3>A Saga do Aluguel:</h3>
		<p>
			Em meio a risadas, daremos destaque às histórias engraçadas e desesperadas de jovens adultos
			tentando encontrar um lugar para morar que não leve todo o salário. Preparem-se para as
			desventuras no mercado de aluguéis de BH.
		</p>

		<h3>Dicas de Sobrevivência:</h3>
		<p>
			Encerraremos a reportagem com algumas dicas práticas para os jovens que desejam se aventurar
			no mercado imobiliário de BH. Dicas reais, sem sarcasmo, para tornar a busca da casa própria
			um pouco menos assustadora.
		</p>

		<h2>Conclusão:</h2>
		<p>
			Em Belo Horizonte, a geração de jovens adultos enfrenta desafios reais ao buscar sua
			independência no mercado imobiliário. Nossa reportagem irá revelar os detalhes ocultos por
			trás da busca pela casa própria e mostrará que, enquanto o sonho permanece, o caminho para a
			realização desse sonho é cheio de curvas e obstáculos. E lembre-se, um toque de sarcasmo e
			humor pode tornar essa jornada um pouco mais leve.
		</p>
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
		color: #3e7941; /* Verde Montanha */
	}

	h2 {
		margin-top: 50px;
		color: #8b4513; /* Marrom Terra */
	}

	h3 {
		color: #86b404; /* Verde Claro */
	}
	p {
		color: white;
	}
	ol {
		list-style-type: decimal;
		margin-left: 20px;
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

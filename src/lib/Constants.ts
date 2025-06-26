export const ArticleEndPoint = "https://dev.to/api/articles";
export const UserInfoEndpoint = "https://dev.to/api/articles?username=victorgois";
export const MediumFeedEndpoint = "https://medium.com/feed/";
export const Email = "victorgois18@gmail.com";
// Tecnologias organizadas por nível de experiência
export const expertTechList = [
	"React",
	"TypeScript", 
	"JavaScript",
	"Next.js",
	"Node.js",
	"Python"
];

export const experiencedTechList = [
	"GraphQL",
	"Material-UI",
	"D3.js",
	"Java",
	"Django",
	"Jest",
	"Storybook"
];

export const familiarTechList = [
	"AWS",
	"Docker",
	"PostgreSQL",
	"GitHub Actions",
	"Bash"
];

// Lista completa para compatibilidade
export const techList = [
	...expertTechList,
	...experiencedTechList,
	...familiarTechList
];
export const experienciesList = [
	{
		title: "wikimedia",
		employee: "Wikimedia Brasil - Out 2024 - Presente",
		chips: ["React", "Next.js", "TypeScript", "JavaScript", "Python", "Django", "GitHub Actions", "Bash"],
		description: "Tech Lead no projeto Capacity Exchange, liderando equipe de desenvolvimento frontend em aplicação React Next.js complexa. Implementei arquitetura frontend escalável com padrões avançados incluindo pub/sub, gerenciamento de estado global e otimizações de performance. Colaboração em integração frontend-backend com equipe Python/Django.",
		link: "https://wikimedia.org.br/"
	},
	{
		title: "stellantis", 
		employee: "Stellantis - Jun 2024 - Set 2024",
		chips: ["Java", "JavaScript"],
		description: "Desenvolvimento de aplicações Android em Java a partir de layouts Figma e Design Systems. Implementação de protótipos mobile com foco em consistência de interface de usuário e padrões de design modernos.",
		link: "https://www.stellantis.com/"
	},
	{
		title: "3778",
		employee: "3778 Healthcare - Ago 2022 - Fev 2024",
		chips: ["React", "TypeScript", "JavaScript", "GraphQL", "Material-UI", "Jest", "Storybook"],
		description: "Implementei frameworks de testes que preveniram erros críticos, atingindo 85+ de cobertura de código. Otimizei performance de páginas melhorando 90+ métricas Web Vitals. Entreguei documentação de design system usando Storybook. Desenvolvi componentes funcionais usando Material-UI e React. Implementei queries e mutations GraphQL.",
		link: "https://www.3778.care/"
	},
	{
		title: "nexo",
		employee: "Nexo Jornal - Jul 2021 - Jul 2022", 
		chips: ["React", "Next.js", "TypeScript", "JavaScript", "D3.js", "Python", "Bash"],
		description: "Migrei codebase da webapp de React, JavaScript e Sass para Next.js, TypeScript e styled-components. Desenvolvi Progressive Web App com Next.js. Criei histórias interativas de dados usando HTML, CSS e D3.js, contribuindo para projeto premiado 'Best of Digital Design 2022'.",
		link: "https://www.nexojornal.com.br/"
	},
	{
		title: "omnilogic",
		employee: "Omnilogic - Jul 2020 - Jul 2021",
		chips: ["React", "JavaScript", "Java", "GraphQL", "Docker", "PostgreSQL"],
		description: "Desenvolvi scripts de rastreamento de marketplace, infraestrutura de métricas de negócio e templates de showcase. Mantive APIs web baseadas em Java. Criei dashboards orientados a dados usando React e JavaScript. Trabalhei com containers Docker e bancos PostgreSQL.",
		link: "https://www.omnilogic.com.br/"
	},
	{
		title: "freela",
		employee: "Desenvolvedor Freelancer - 2018 - Presente",
		chips: ["Python", "JavaScript", "React", "Next.js", "D3.js", "Node.js", "GitHub Actions", "Bash"],
		description: "Auxiliei candidatos a PhD e estudantes de pós-graduação com formatação, modelagem e visualização de dados de pesquisa usando Python e Tableau. Desenvolvi websites usando WordPress headless com React e Next.js. Criei visualizações de dados e narrativas visuais usando D3.js.",
		link: "https://www.victorgois.dev/"
	}
];

// English translations for experiences list
export const experienciesListEn = [
	{
		title: "wikimedia",
		employee: "Wikimedia Brasil - Oct 2024 - Present",
		chips: ["React", "Next.js", "TypeScript", "JavaScript", "Python", "Django", "GitHub Actions", "Bash"],
		description: "Tech Lead on Capacity Exchange project, leading frontend development team on complex React Next.js application. Implemented scalable frontend architecture using advanced patterns including pub/sub, global state management and performance optimization. Collaborated on frontend-backend integration with Python/Django team.",
		link: "https://wikimedia.org.br/"
	},
	{
		title: "stellantis", 
		employee: "Stellantis - Jun 2024 - Sep 2024",
		chips: ["Java", "JavaScript"],
		description: "Developed Android applications in Java from Figma layouts and Design Systems. Implemented mobile prototypes with focus on user interface consistency and modern design patterns.",
		link: "https://www.stellantis.com/"
	},
	{
		title: "3778",
		employee: "3778 Healthcare - Aug 2022 - Feb 2024",
		chips: ["React", "TypeScript", "JavaScript", "GraphQL", "Material-UI", "Jest", "Storybook"],
		description: "Implemented software testing frameworks that prevented critical errors, achieving 85+ code coverage. Optimized page performance improving 90+ Web Vitals metrics. Delivered design system documentation using Storybook. Developed functional components using Material-UI and React. Implemented GraphQL queries and mutations.",
		link: "https://www.3778.care/"
	},
	{
		title: "nexo",
		employee: "Nexo Jornal - Jul 2021 - Jul 2022", 
		chips: ["React", "Next.js", "TypeScript", "JavaScript", "D3.js", "Python", "Bash"],
		description: "Migrated webapp codebase from React, JavaScript and Sass to Next.js, TypeScript and styled-components. Developed Progressive Web App with Next.js. Created interactive data stories using HTML, CSS and D3.js, contributing to award-winning project 'Best of Digital Design 2022'.",
		link: "https://www.nexojornal.com.br/"
	},
	{
		title: "omnilogic",
		employee: "Omnilogic - Jul 2020 - Jul 2021",
		chips: ["React", "JavaScript", "Java", "GraphQL", "Docker", "PostgreSQL"],
		description: "Developed marketplace tracking scripts, business metrics infrastructure and showcase templates. Maintained Java-based web APIs. Created data-driven dashboards using React and JavaScript. Worked with Docker containers and PostgreSQL databases.",
		link: "https://www.omnilogic.com.br/"
	},
	{
		title: "freela",
		employee: "Freelance Developer - 2018 - Present",
		chips: ["Python", "JavaScript", "React", "Next.js", "D3.js", "Node.js", "GitHub Actions", "Bash"],
		description: "Assisted PhD candidates and graduate students with research data formatting, modeling and visualization using Python and Tableau. Developed websites using headless WordPress with React and Next.js. Created data visualizations and visual narratives using D3.js.",
		link: "https://www.victorgois.dev/"
	}
];

// Mapeamento específico de tecnologias para experiências detalhadas
export const techExperiences = {
	"React": {
		"wikimedia": "Lidero equipe de desenvolvimento frontend em aplicação React complexa para gerenciamento hierárquico de capacidades. Implemento arquitetura escalável com padrões avançados incluindo pub/sub e gerenciamento de estado global.",
		"3778": "Desenvolvi componentes funcionais React para dashboards em tempo real de dados hospitalares. Criei telas estatísticas conectadas via WebSocket com foco em performance e usabilidade.",
		"nexo": "Participei da migração do codebase de React com JavaScript para React com TypeScript. Redesenhei todos os componentes da publicação usando styled-components.",
		"omnilogic": "Criei dashboards orientados a dados usando React para métricas de marketplace e infraestrutura de negócio.",
		"freela": "Desenvolvo websites usando React como frontend para WordPress headless. Crio interfaces modernas e responsivas para diversos clientes."
	},
	"TypeScript": {
		"wikimedia": "Utilizo TypeScript para garantir type safety em aplicação React Next.js complexa, melhorando a manutenibilidade e reduzindo bugs em produção.",
		"3778": "Implementei TypeScript em projeto React para melhorar a qualidade do código e facilitar refatorações. Atingi 85+ de cobertura de código com testes tipados.",
		"nexo": "Liderei a migração completa de JavaScript para TypeScript no Nexo 3.0, melhorando significativamente a developer experience e reduzindo erros de runtime."
	},
	"Next.js": {
		"wikimedia": "Desenvolvo aplicação Next.js complexa com arquitetura escalável, implementando otimizações de performance e renderização server-side.",
		"nexo": "Participei do desenvolvimento do Nexo 3.0 com Next.js. Desenvolvi Progressive Web App (PWA) integrada com Next.js para melhor experiência mobile.",
		"freela": "Utilizo Next.js para criar websites performáticos com WordPress headless, implementando SSG e SSR conforme necessário."
	},
	"Node.js": {
		"freela": "Desenvolvo APIs e scripts de automação usando Node.js. Criei ferramentas para extração e processamento de dados do Twitter para pesquisa acadêmica.",
		"wikimedia": "Trabalho com Node.js no ecossistema de desenvolvimento, integrando ferramentas de build e automação de processos."
	},
	"Python": {
		"wikimedia": "Colaboro em integração frontend-backend com equipe Python/Django através de APIs REST, garantindo comunicação eficiente entre os sistemas.",
		"nexo": "Desenvolvi scripts Python para automatizar processos internos da redação, incluindo processamento de dados e geração de relatórios.",
		"freela": "Auxilio candidatos a PhD com formatação, modelagem e visualização de dados de pesquisa usando Python. Trabalho com bibliotecas como Pandas e Selenium para extração de dados."
	},
	"GraphQL": {
		"3778": "Implementei queries e mutations GraphQL para consumo de dados em aplicação React. Trabalhei na modelagem de schema backend e consumo eficiente no frontend.",
		"omnilogic": "Utilizei GraphQL para APIs de métricas de negócio e infraestrutura, criando queries otimizadas para dashboards em tempo real."
	},
	"AWS": {
		"wikimedia": "Utilizo serviços AWS para deploy e infraestrutura da aplicação React Next.js, garantindo escalabilidade e performance.",
		"freela": "Implemento soluções AWS para hospedagem de websites e APIs, utilizando serviços como S3, CloudFront e EC2."
	},
	"Django": {
		"wikimedia": "Colaboro com equipe backend Django no desenvolvimento de APIs REST para aplicação de gerenciamento de capacidades. Participo do design de endpoints e estrutura de dados."
	},
	"D3.js": {
		"nexo": "Criei histórias interativas de dados usando D3.js, contribuindo para projeto que ganhou prêmio 'Best of Digital Design 2022'. Desenvolvi visualizações complexas e narrativas visuais.",
		"freela": "Crio visualizações de dados e narrativas visuais personalizadas usando D3.js para clientes acadêmicos e projetos de pesquisa."
	},
	"Material-UI": {
		"3778": "Utilizei Material-UI (MUI) para desenvolver componentes customizáveis e consistentes. Entreguei documentação completa de design system para padronização da interface.",
		"freela": "Implemento Material-UI em projetos React para garantir interface moderna e acessível seguindo as diretrizes do Material Design."
	},
	"Storybook": {
		"3778": "Entreguei documentação completa de design system usando Storybook, facilitando a reutilização de componentes e manutenção da consistência visual da aplicação."
	},
	"Jest": {
		"3778": "Implementei frameworks de testes funcionais usando Jest que preveniram erros críticos em produção. Atingi mais de 85% de cobertura de código com testes automatizados."
	},
	"Java": {
		"stellantis": "Desenvolvi aplicações Android nativas em Java a partir de layouts Figma e Design Systems. Implementei protótipos mobile seguindo padrões de interface consistentes.",
		"omnilogic": "Mantive APIs web baseadas em Java para infraestrutura de métricas e templates de showcase. Trabalhei com arquitetura backend robusta e escalável."
	},
	"Docker": {
		"omnilogic": "Trabalhei com containers Docker para padronização de ambiente de desenvolvimento e deploy de aplicações. Implementei pipelines de CI/CD usando Docker."
	},
	"PostgreSQL": {
		"omnilogic": "Utilizei PostgreSQL como banco de dados principal para armazenamento de métricas de negócio e dados de marketplace. Otimizei queries para dashboards em tempo real."
	},
	"JavaScript": {
		"wikimedia": "Utilizo JavaScript moderno (ES6+) como base para desenvolvimento React Next.js, implementando funcionalidades complexas e padrões avançados.",
		"3778": "Desenvolvi funcionalidades em JavaScript para dashboards em tempo real, otimizando performance e implementando lógica de negócio complexa.",
		"nexo": "Trabalhei na migração de JavaScript para TypeScript mantendo toda a base de código funcional. Utilizei JavaScript para scripts de automação e processamento de dados.",
		"omnilogic": "Criei scripts de rastreamento e dashboards usando JavaScript vanilla e integrado com React para interfaces interativas.",
		"freela": "Uso JavaScript para processamento de dados acadêmicos, extração de APIs (Twitter, YouTube) e criação de ferramentas de automação desde 2018."
	},
	"GitHub Actions": {
		"wikimedia": "Implemento pipelines de CI/CD usando GitHub Actions para automatizar deploy e testes da aplicação React Next.js.",
		"freela": "Configuro workflows de GitHub Actions para automação de deploy e integração contínua em projetos de clientes."
	},
	"Bash": {
		"wikimedia": "Escrevo scripts Bash para automação de processos de desenvolvimento e deploy em ambiente Linux.",
		"nexo": "Desenvolvi scripts Bash para automatização de processos internos da redação e deploy de aplicações.",
		"freela": "Uso Bash para automação de tarefas repetitivas, processamento de dados em lote e configuração de servidores desde o início da carreira."
	}
};

// English translations for tech experiences
export const techExperiencesEn = {
	"React": {
		"wikimedia": "Leading frontend development team on complex React application for hierarchical capacity management. Implementing scalable architecture with advanced patterns including pub/sub and global state management.",
		"3778": "Developed functional React components for real-time hospital data dashboards. Created statistical screens connected via WebSocket with focus on performance and usability.",
		"nexo": "Participated in codebase migration from React with JavaScript to React with TypeScript. Redesigned all publication components using styled-components.",
		"omnilogic": "Created data-driven dashboards using React for marketplace metrics and business infrastructure.",
		"freela": "Develop websites using React as frontend for headless WordPress. Create modern and responsive interfaces for various clients."
	},
	"TypeScript": {
		"wikimedia": "Use TypeScript to ensure type safety in complex React Next.js application, improving maintainability and reducing production bugs.",
		"3778": "Implemented TypeScript in React project to improve code quality and facilitate refactoring. Achieved 85+ code coverage with typed tests.",
		"nexo": "Led complete migration from JavaScript to TypeScript in Nexo 3.0, significantly improving developer experience and reducing runtime errors."
	},
	"Next.js": {
		"wikimedia": "Develop complex Next.js application with scalable architecture, implementing performance optimizations and server-side rendering.",
		"nexo": "Participated in Nexo 3.0 development with Next.js. Developed Progressive Web App (PWA) integrated with Next.js for better mobile experience.",
		"freela": "Use Next.js to create performant websites with headless WordPress, implementing SSG and SSR as needed."
	},
	"Node.js": {
		"freela": "Develop APIs and automation scripts using Node.js. Created tools for Twitter data extraction and processing for academic research.",
		"wikimedia": "Work with Node.js in development ecosystem, integrating build tools and process automation."
	},
	"Python": {
		"wikimedia": "Collaborate on frontend-backend integration with Python/Django team through REST APIs, ensuring efficient communication between systems.",
		"nexo": "Developed Python scripts to automate internal newsroom processes, including data processing and report generation.",
		"freela": "Assist PhD candidates with research data formatting, modeling and visualization using Python. Work with libraries like Pandas and Selenium for data extraction."
	},
	"GraphQL": {
		"3778": "Implemented GraphQL queries and mutations for data consumption in React application. Worked on backend schema modeling and efficient frontend consumption.",
		"omnilogic": "Used GraphQL for business metrics and infrastructure APIs, creating optimized queries for real-time dashboards."
	},
	"AWS": {
		"wikimedia": "Use AWS services for React Next.js application deployment and infrastructure, ensuring scalability and performance.",
		"freela": "Implement AWS solutions for website and API hosting, using services like S3, CloudFront and EC2."
	},
	"Django": {
		"wikimedia": "Collaborate with Django backend team on REST API development for capacity management application. Participate in endpoint design and data structure."
	},
	"D3.js": {
		"nexo": "Created interactive data stories using D3.js, contributing to project that won 'Best of Digital Design 2022' award. Developed complex visualizations and visual narratives.",
		"freela": "Create custom data visualizations and visual narratives using D3.js for academic clients and research projects."
	},
	"Material-UI": {
		"3778": "Used Material-UI (MUI) to develop customizable and consistent components. Delivered complete design system documentation for interface standardization.",
		"freela": "Implement Material-UI in React projects to ensure modern and accessible interface following Material Design guidelines."
	},
	"Storybook": {
		"3778": "Delivered complete design system documentation using Storybook, facilitating component reuse and maintaining visual consistency of the application."
	},
	"Jest": {
		"3778": "Implemented functional testing frameworks using Jest that prevented critical errors in production. Achieved over 85% code coverage with automated tests."
	},
	"Java": {
		"stellantis": "Developed native Android applications in Java from Figma layouts and Design Systems. Implemented mobile prototypes following consistent interface patterns.",
		"omnilogic": "Maintained Java-based web APIs for metrics infrastructure and showcase templates. Worked with robust and scalable backend architecture."
	},
	"Docker": {
		"omnilogic": "Worked with Docker containers for development environment standardization and application deployment. Implemented CI/CD pipelines using Docker."
	},
	"PostgreSQL": {
		"omnilogic": "Used PostgreSQL as main database for business metrics and marketplace data storage. Optimized queries for real-time dashboards."
	},
	"JavaScript": {
		"wikimedia": "Use modern JavaScript (ES6+) as base for React Next.js development, implementing complex functionalities and advanced patterns.",
		"3778": "Developed JavaScript functionalities for real-time dashboards, optimizing performance and implementing complex business logic.",
		"nexo": "Worked on JavaScript to TypeScript migration maintaining entire functional codebase. Used JavaScript for automation scripts and data processing.",
		"omnilogic": "Created tracking scripts and dashboards using vanilla JavaScript and integrated with React for interactive interfaces.",
		"freela": "Use JavaScript for academic data processing, API extraction (Twitter, YouTube) and automation tool creation since 2018."
	},
	"GitHub Actions": {
		"wikimedia": "Implement CI/CD pipelines using GitHub Actions to automate React Next.js application deployment and testing.",
		"freela": "Configure GitHub Actions workflows for deployment automation and continuous integration in client projects."
	},
	"Bash": {
		"wikimedia": "Write Bash scripts for development process automation and deployment in Linux environment.",
		"nexo": "Developed Bash scripts for internal newsroom process automation and application deployment.",
		"freela": "Use Bash for repetitive task automation, batch data processing and server configuration since early career."
	}
};

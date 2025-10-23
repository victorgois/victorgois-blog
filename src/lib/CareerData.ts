export interface CareerItem {
	id: string;
	date: string;
	type: 'work' | 'education';
	title: string;
	company: string;
	description: string;
	technologies?: string[];
	period: string;
	icon?: string;
	titleEn?: string;
	descriptionEn?: string;
	periodEn?: string;
}

export const careerData: CareerItem[] = [
	// Educação
	{
		id: 'bachelor-is-2016',
		date: '2011-06',
		type: 'education',
		title: 'Bacharelado em Sistemas de Informação',
		company: 'Universidade Federal de Minas Gerais (UFMG)',
		description: 'Desenvolvimento Web, Business Intelligence, Estruturas de Dados, Programação C e Ruby',
		period: 'Mar 2011 - Jun 2016',
		icon: '🎓',
		titleEn: 'Bachelor of Science in Information Systems',
		descriptionEn: 'Web Development, Business Intelligence, Data Structures, C and Ruby Programming',
		periodEn: 'Mar 2011 - Jun 2016'
	},
	{
		id: 'exchange-2014',
		date: '2014-09',
		type: 'education',
		title: 'Exchange Program - Multimedia Marketing',
		company: 'University of Applied Sciences Schmalkalden, Germany',
		description: 'Programa de intercâmbio em Marketing Multimídia',
		period: 'Set 2014 - Ago 2015',
		icon: '🎓',
		titleEn: 'Exchange Program - Multimedia Marketing',
		descriptionEn: 'Exchange program in Multimedia Marketing',
		periodEn: 'Sep 2014 - Aug 2015'
	},
	{
		id: 'freelance-2018',
		date: '2018-01',
		type: 'work',
		title: 'Desenvolvedor Freelancer & Analista de Dados',
		company: 'Freelancer',
		description: 'Desenvolvimento de sites com WordPress headless, React e Next.js. Visualizações de dados com Python, D3.js e Tableau.',
		technologies: ['Python', 'React', 'Next.js', 'D3.js', 'Tableau', 'WordPress'],
		period: '2018 - Presente',
		icon: '💼',
		titleEn: 'Freelance Developer & Data Analyst',
		descriptionEn: 'Website development with headless WordPress, React and Next.js. Data visualizations with Python, D3.js and Tableau.',
		periodEn: '2018 - Present'
	},
	{
		id: 'bachelor-comm-2020',
		date: '2017-12',
		type: 'education',
		title: 'Bacharelado em Comunicação Social',
		company: 'Universidade Federal de Minas Gerais (UFMG)',
		description: 'Projeto Final: "Protocolos, Plataformas e APIs: Experimentos com dados do Google News, Twitter e YouTube"',
		period: 'Ago 2016 - Dez 2020',
		icon: '🎓',
		titleEn: 'Bachelor of Science in Social Communication',
		descriptionEn: 'Final Project: "Protocols, Platforms and APIs: Experiments with Google News, Twitter and YouTube data"',
		periodEn: 'Aug 2016 - Dec 2020'
	},
	{
		id: 'omnilogic-2020',
		date: '2020-07',
		type: 'work',
		title: 'Desenvolvedor Full-Stack',
		company: 'Omnilogic',
		description: 'Desenvolvimento de APIs em Java, dashboards em React, scripts de tracking para marketplaces.',
		technologies: ['Java', 'React', 'JavaScript', 'Docker', 'PostgreSQL'],
		period: 'Jul 2020 - Jul 2021',
		icon: '💼',
		titleEn: 'Full-Stack Software Developer',
		descriptionEn: 'Development of Java APIs, React dashboards, marketplace tracking scripts.',
		periodEn: 'Jul 2020 - Jul 2021'
	},
	{
		id: 'nexo-2021',
		date: '2021-07',
		type: 'work',
		title: 'Desenvolvedor Frontend',
		company: 'Nexo Jornal/Revista Gama',
		description: 'Migração para Next.js e TypeScript. Desenvolvimento de PWA. Histórias de dados interativas com D3.js - Projeto vencedor "Best of Digital Design 2022".',
		technologies: ['Next.js', 'TypeScript', 'React', 'D3.js', 'PWA'],
		period: 'Jul 2021 - Jul 2022',
		icon: '💼',
		titleEn: 'Frontend Software Developer',
		descriptionEn: 'Migration to Next.js and TypeScript. PWA development. Interactive data stories with D3.js - Winner of "Best of Digital Design 2022".',
		periodEn: 'Jul 2021 - Jul 2022'
	},
	{
		id: 'master-2021',
		date: '2021-01',
		type: 'education',
		title: 'Mestrado em Comunicação Social',
		company: 'Universidade Federal de Minas Gerais (UFMG)',
		description: 'Tese: "Truth in Deep Fake: A Semiotic Study on Deepfakes in Brazilian 2022 Presidential Elections"',
		technologies: ['Node.js', 'JavaScript', 'Twitter API', 'Tableau'],
		period: 'Jan 2021 - Mai 2023',
		icon: '🎓',
		titleEn: 'Master of Science in Social Communication',
		descriptionEn: 'Thesis: "Truth in Deep Fake: A Semiotic Study on Deepfakes in Brazilian 2022 Presidential Elections"',
		periodEn: 'Jan 2021 - May 2023'
	},
	{
		id: '3778-2022',
		date: '2022-08',
		type: 'work',
		title: 'Desenvolvedor Full-Stack',
		company: '3778 Healthcare',
		description: 'Implementação de frameworks de testes (85+ cobertura). Otimização de performance. Documentação de design system com Storybook.',
		technologies: ['React', 'TypeScript', 'GraphQL', 'Material-UI', 'Jest', 'Storybook'],
		period: 'Ago 2022 - Fev 2024',
		icon: '💼',
		titleEn: 'Full-Stack Software Developer',
		descriptionEn: 'Implementation of testing frameworks (85+ coverage). Performance optimization. Design system documentation with Storybook.',
		periodEn: 'Aug 2022 - Feb 2024'
	},
	{
		id: 'stellantis-2024',
		date: '2024-06',
		type: 'work',
		title: 'Desenvolvedor Mobile',
		company: 'Stellantis',
		description: 'Desenvolvimento de aplicações Android em Java a partir de layouts Figma e Design Systems.',
		technologies: ['Android', 'Java', 'Figma', 'Design Systems'],
		period: 'Jun 2024 - Set 2024',
		icon: '💼',
		titleEn: 'Mobile Software Developer',
		descriptionEn: 'Android application development in Java from Figma layouts and Design Systems.',
		periodEn: 'Jun 2024 - Sep 2024'
	},
	{
		id: 'wikimedia-2024',
		date: '2024-10',
		type: 'work',
		title: 'Frontend Engineer',
		company: 'Wikimedia Brasil',
		description: 'Liderança de equipe frontend no projeto Capacity Exchange. Arquitetura escalável em React Next.js com otimizações de performance.',
		technologies: ['React', 'Next.js', 'Python', 'Django', 'TypeScript'],
		period: 'Out 2024 - Presente',
		icon: '💼',
		titleEn: 'Frontend Engineer',
		descriptionEn: 'Frontend team leadership on Capacity Exchange project. Scalable React Next.js architecture with performance optimizations.',
		periodEn: 'Oct 2024 - Present'
	}
];

// Função para ordenar os dados por data
export const getSortedCareerData = () => {
	return [...careerData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Função para obter apenas experiências profissionais
export const getWorkExperience = () => {
	return careerData.filter(item => item.type === 'work').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Função para obter apenas educação
export const getEducation = () => {
	return careerData.filter(item => item.type === 'education').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}; 
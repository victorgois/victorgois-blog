<script>
	import {
		Timeline,
		TimelineItem,
		TimelineSeparator,
		TimelineDot,
		TimelineConnector,
		TimelineContent,
		TimelineOppositeContent
	} from 'svelte-vertical-timeline';
	import { getSortedCareerData } from '../CareerData';
	import { t, locale } from '../../i18n';

	const careerItems = getSortedCareerData();

	// Função para obter o texto correto baseado no idioma
	const getText = (item, field) => {
		const isEnglish = $locale === 'en';
		const englishField = field + 'En';
		
		if (isEnglish && item[englishField]) {
			return item[englishField];
		}
		return item[field];
	};
</script>

<div class="career-timeline">
	<h3>{$t('careerTimeline.title')}</h3>
	<Timeline position="alternate">
		{#each careerItems as item, index (item.id)}
			<TimelineItem>
				<TimelineOppositeContent slot="opposite-content">
					<div class="timeline-date">
						<span class="period">{getText(item, 'period')}</span>
					</div>
				</TimelineOppositeContent>
				<TimelineSeparator>
					<TimelineDot
						style={`
							width: 40px; 
							height: 40px; 
							background: transparent; 
							display: flex; 
							justify-content: center; 
							align-items: center;
							border: none;
							padding: 0;
						`}
					>
						{#if item.type === 'work'}
							<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="color: var(--mainColor)">
								<path d="M20 6h-2.5l-1.1-1.4c-.3-.4-.8-.6-1.3-.6H8.9c-.5 0-1 .2-1.3.6L6.5 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 13H4V8h16v11zM8 13h8v2H8v-2z"/>
							</svg>
						{:else}
							<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="color: var(--secondaryColor)">
								<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
							</svg>
						{/if}
					</TimelineDot>
					{#if index < careerItems.length - 1}
						<TimelineConnector 
							style="background-color: var(--mainColor); opacity: 0.3;" 
						/>
					{/if}
				</TimelineSeparator>
				<TimelineContent>
					<div class="timeline-card">
						<h4 class="job-title">{getText(item, 'title')}</h4>
						<h5 class="company">{item.company}</h5>
					</div>
				</TimelineContent>
			</TimelineItem>
		{/each}
	</Timeline>
</div>

<style>
	.career-timeline {
		width: 100%;
		padding: 20px 0;
	}

	.career-timeline h3 {
		text-align: center;
		color: var(--mainColor);
		margin-bottom: 30px;
		font-size: 1.5rem;
	}

	.timeline-date {
		text-align: center;
		padding: 10px;
	}

	.period {
		font-size: 0.9rem;
		color: var(--secondaryColor);
		font-weight: 600;
		background: var(--backgroundColor);
		padding: 4px 8px;
		border-radius: 12px;
		opacity: 0.8;
	}

	.timeline-card {
		background: var(--backgroundColor);
		border-radius: 12px;
		padding: 20px;
		margin: 10px 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.timeline-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.job-title {
		color: var(--mainColor);
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 5px;
		line-height: 1.3;
	}

	.company {
		color: var(--secondaryColor);
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 15px;
		opacity: 0.9;
	}



	/* Responsivo para mobile */
	@media (max-width: 768px) {
		.career-timeline {
			padding: 15px 0;
		}

		.timeline-card {
			padding: 15px;
			margin: 8px 0;
		}

		.job-title {
			font-size: 1rem;
		}

		.company {
			font-size: 0.9rem;
		}

		.period {
			font-size: 0.8rem;
		}
	}
</style> 
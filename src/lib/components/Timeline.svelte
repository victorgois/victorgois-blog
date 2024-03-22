<script lang="ts">
	import {
		Timeline,
		TimelineItem,
		TimelineSeparator,
		TimelineDot,
		TimelineConnector,
		TimelineContent,
		TimelineOppositeContent
	} from "svelte-vertical-timeline";

	const options = [
		{
			year: "2011",
			description: "Start BSc Information Systems at Universidade Federal de Minas Gerais (UFMG)",
			image: "https://seeklogo.com/images/U/UFMG-logo-7B1478CE80-seeklogo.com.png"
		},
		{
			year: "2014",
			description: "Academic Exchange at Faschoschule Schmalkalden (Germany)",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/1280px-Flag_of_Germany.svg.png"
		},
		{
			year: "2016",
			description: "Back to Brazil. Switched major to journalism",
			image:
				"https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png"
		},
		{
			year: "2018",
			description: "Start to work as freelancer web developer"
		},
		{
			year: "2019",
			description: "Wordpress Developer - 8dpro"
		},
		{
			year: "2020",
			description: "Fullstack Developer - Omnilogic"
		},
		{
			year: "2021",
			description: "Graduated in journalism. Also started the MA in Communications",
			image: "https://seeklogo.com/images/U/UFMG-logo-7B1478CE80-seeklogo.com.png"
		},
		{
			year: "2021",
			description: "Fullstack Developer/Journalist Engineer - Nexo Jornal"
		},
		{
			year: "2022",
			description: "Fullstack Developer - 3778 healthcare"
		},
		{
			year: "2023",
			description: "Finnished the master degree and get more experience with software engineering"
		},
		{
			year: "2024",
			description: "..."
		}
	];
</script>

<Timeline position="alternate" style="text-align: justify;">
	{#each options as option}
		<TimelineItem style="text-align: left">
			<TimelineOppositeContent slot="opposite-content">
				<h3>{option.year}</h3>
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineDot
					style={"background-color: #fff; display: flex; justify-content: center; border-color: transparent; "}
				/>
				<TimelineConnector />
			</TimelineSeparator>
			<TimelineContent>
				<p>{option.description}</p>
				{#if option.image}
					<img alt="teste" src={option.image} style="width: 60px;" />
				{/if}
			</TimelineContent>
		</TimelineItem>
	{/each}
</Timeline>

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
			description: "Freshman BA Information Systems at Universidade Federal de Minas Gerais (UFMG)"
		},
		{ year: "2013", description: "Internship as developer (first xp with web development)" },
		{
			year: "2014",
			description: "Interchange BA Multimedia Marketing at Faschoschule Schmalkalden (Germany)"
		},
		{ year: "2016", description: "Back to Brazil. Switched major to journalism" },
		{
			year: "2018",
			description: "Started to work as freelancer dev working with python and wordpress (yeeeah)"
		},
		{
			year: "2020",
			description:
				"First and second fulltime jobs as a developer. First at 8dpro, as wordpress developer and then, at Omnilogic as a fullstack developer"
		},
		{
			year: "2021",
			description: "Graduated in journalism. Also started the MA in Communications at UFMG"
		},
		{
			year: "2021",
			description: "Started to work in Nexo Jornal as fullstack developer/journalist engineer"
		},
		{
			year: "2022",
			description: "Started to work at 3778 healthcare as javascript fullstack developer"
		},
		{ year: "2023", description: "Finnished the master degree and dive into frontend development" },
		{
			year: "2024",
			description: "Starting projects related to data journalism and digital storytelling"
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
			</TimelineContent>
		</TimelineItem>
	{/each}
</Timeline>

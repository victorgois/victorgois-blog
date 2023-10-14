<script>
  export let techName = "";
  import TechChips from "$lib/components/TechChips.svelte";

  let techList = ["JavaScript", "React", "Typescript"];

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleBackClick() {
    dispatch("backclick");
  }
</script>

<div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="back" on:click={handleBackClick} role="button" tabindex="0">
    &larr; Back
  </div>
  <h2>{techName}</h2>
  <p>potatoes</p>
  <TechChips {techList} />
</div>

<style>
  .back {
    cursor: pointer;
    margin-bottom: 1rem;
		margin-top: 1rem;
    color: #007bff;
    text-decoration: underline;
  }

  h2 {
    text-align: left;
    padding-right: 1rem;
  }

  p {
    text-align: left;
    padding-right: 1rem;
  }
</style>

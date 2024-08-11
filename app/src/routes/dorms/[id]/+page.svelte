<script lang="ts">
	import { showMenu } from '$lib';
	import { Image } from '@unpic/svelte';
	import {page} from "$app/stores"
	let id=$derived($page.url.searchParams.get('id'))
</script>

<button
	onclick={() => showMenu.set(!$showMenu)}
	class="absolute z-[1] m-2 hidden rounded-3xl bg-teal-950 p-2 sm:block"
>
	{#if !$showMenu}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-menu stroke-teal-100"
			><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
				x1="4"
				x2="20"
				y1="18"
				y2="18"
			/></svg
		>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-x stroke-teal-100"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
		>
	{/if}
</button>

<main class=" flex min-h-svh w-full justify-center">
	<div class="flex min-h-full w-[75%] flex-col">
		<div style:--carousel="carousel-{id}" class="carousel">
			<Image src="https://picsum.photos/id/42/750/300" layout="fullWidth" />
		</div>
		<div class="info-body h-[60%]">
			<h1 class="font-[CG] text-3xl">Dorm Heading goes here</h1>
		</div>
	</div>
</main>

<style>
	main {
		view-transition-name: dorms;
	}
	.carousel {
		view-transition-name: var(--carousel);
		view-transition-class: carousel;
	}
</style>

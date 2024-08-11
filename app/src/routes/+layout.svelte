<script lang="ts">
	import '../global.css';
	import '../app.css';
	import '$lib/assets/fonts/fonts.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import { onNavigate } from '$app/navigation';
	onNavigate((navigation) => {
		//@ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			//@ts-ignore

			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<NavBar />
{@render children()}

<style>
	
</style>

<script lang="ts">
	import { MediaQuery } from 'runed';
	import { showMenu } from '$lib';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	const screen = new MediaQuery('(min-width: 640px)');
	//$inspect(screen)
</script>

<!-- content here -->
{#if screen.matches}
	{#if $showMenu}
		<nav
			transition:scale|global={{ duration: 300, start: 0.5 }}
			class="fixed left-[50%] top-3 z-[1] w-[65%] translate-x-[-50%] rounded-xl border-2 border-teal-500 bg-teal-100/95 p-2"
		>
			<ul class="flex justify-around font-[CG] text-xl font-medium text-teal-950">
				<li>
					<a href="/" class="flex items-center justify-center gap-x-2"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="19"
							height="19"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mb-[0.85px] shrink-0"
							><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path
								d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
							/></svg
						>Home</a
					>
				</li>
				<li>
					<a href="/search" class="flex items-center justify-center gap-x-2"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="19"
							height="19"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mb-[0.85px] shrink-0"
							><path
								d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
							/><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line
								x1="12"
								x2="12"
								y1="22"
								y2="12"
							/><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg
						>Explore</a
					>
				</li>
				<li>
					<a href="/profile" class="flex items-center justify-center gap-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="19"
							height="19"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mb-[0.85px] shrink-0"
							><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle
								cx="12"
								cy="12"
								r="10"
							/></svg
						>Profile</a
					>
				</li>
			</ul>
		</nav>
	{/if}
{:else}
	<nav
		class="fixed z-[1] bottom-0 left-[50%] w-full translate-x-[-50%] border-t-2 border-t-teal-500 bg-teal-100 p-[0.095rem]"
	>
		<ul class="flex items-center justify-around font-[CG] text-lg font-medium text-teal-950">
			<li>
				<a href="/" class="flex flex-col items-center justify-center"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="21"
						height="21"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class=" shrink-0"
						><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path
							d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
						/></svg
					>Home</a
				>
			</li>
			<li>
				<a href="/search" class="flex flex-col items-center justify-center"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="21"
						height="21"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class=" shrink-0"
						><path
							d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
						/><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line
							x1="12"
							x2="12"
							y1="22"
							y2="12"
						/><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg
					>Explore</a
				>
			</li>
			<li>
				<a href="/profile" class="flex flex-col items-center justify-center"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="21"
						height="21"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class=" shrink-0"
						><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle
							cx="12"
							cy="12"
							r="10"
						/></svg
					>Profile</a
				>
			</li>
		</ul>
	</nav>
{/if}

<style>
	nav {
		view-transition-name: navbar;
	}
</style>

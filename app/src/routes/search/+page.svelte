<script lang="ts">
	import { showMenu } from '$lib';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { Image } from '@unpic/svelte';

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected }
	} = createCombobox({
		forceVisible: true
	});

	let Options = ["PG's", 'Hostels', 'Rooms', 'Flats'];
	const toOption = (option: string) => ({
		value: option,
		label: option,
		disabled: false
	});
	$effect(() => {
		if (!$open) {
			$inputValue = $selected?.label ?? '';
		}
		showMenu.set(false);
	});
	let filtered = $derived.by(() => {
		let filtered = $touchedInput
			? Options.filter((x) => {
					const normalizedInput = $inputValue.toLowerCase();
					return x.toLowerCase().includes(normalizedInput);
				})
			: Options;
		return filtered;
	});
</script>

<button
	onclick={() => showMenu.set(!$showMenu)}
	class="absolute m-2 hidden rounded-3xl bg-teal-950 p-2 sm:block"
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
<main class="flex min-h-svh w-full flex-col divide-y divide-gray-300">
	<div class="flex h-[25svh] w-full items-center justify-center md:h-[20svh]">
		<div
			class="flex h-[75%] w-[90%] flex-col items-center justify-center gap-2 md:flex-row lg:w-[80%]"
		>
			<input
				type="text"
				placeholder="Start searching"
				class="h-fit w-full rounded-2xl border-none bg-[#021f1e] p-3 font-[CG] text-stone-100 outline-none placeholder:text-stone-300/90"
			/>
			<div class="flex flex-col gap-1 self-start md:self-center">
				<!-- $label contains the 'for' attribute -->
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<!-- <label use:melt={$label} class="absolute lg:bottom-10 -bottom-6">
					<span class="text-magnum-900 text-sm font-medium">Choose your favorite manga:</span>
				</label> -->

				<div class="relative">
					<input
						use:melt={$input}
						class="flex h-10 items-center justify-between rounded-2xl
						border border-teal-600 bg-teal-200 px-3 py-6 font-[CG] text-teal-900 outline-none placeholder:text-teal-900 lg:pr-20"
						placeholder="Select type"
					/>
					<div class="text-magnum-900 absolute right-2 top-1/2 z-10 -translate-y-1/2">
						{#if $open}
							<ChevronUp class="size-4 stroke-teal-900" />
						{:else}
							<ChevronDown class="size-4 stroke-teal-900" />
						{/if}
					</div>
				</div>
			</div>
			{#if $open}
				<ul
					class=" z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
					use:melt={$menu}
					transition:fly={{ duration: 150, y: -5 }}
				>
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<div
						class="flex max-h-full flex-col gap-0 overflow-y-auto rounded-xl bg-teal-200 px-2 py-2 font-[CG] text-teal-900"
						tabindex="0"
					>
						{#each filtered as value, index (index)}
							<li
								use:melt={$option(toOption(value))}
								class="hover:bg-magnum-100 data-[highlighted]:text-magnum-900 relative cursor-pointer scroll-my-2 rounded-2xl py-2
					  pl-4
					  pr-4 data-[highlighted]:bg-teal-400
						data-[disabled]:opacity-50"
							>
								{#if $isSelected(value)}
									<div class="check absolute left-2 top-3 z-10 text-teal-900">
										<Check class="size-4" />
									</div>
								{/if}
								<div class="pl-4">
									<span class="font-medium">{value}</span>
									<!-- {#if value === "PG's"}
										<span class="block text-sm opacity-75">Paying guests </span>
									{/if} -->
								</div>
							</li>
						{:else}
							<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">No results found</li>
						{/each}
					</div>
				</ul>
			{/if}
		</div>
	</div>
	<div class="grid min-h-[75svh] w-full grid-cols-[1fr] md:min-h-[80svh] md:grid-cols-[25%_75%]">
		<div class=" border-gray-80 sticky top-0 hidden h-svh border-r border-gray-400 md:block">
			filters
		</div>
		<div class="mt-2 flex min-h-full flex-col items-center gap-y-4">
			{#each [0, 1, 2, 3, 4, 5, 6, 7] as item}
				<!-- content here -->
				<a class="contents" href={`/dorms/id?id=${item}`}>
					<div
						class="card flex min-h-[325px] w-[95%] flex-col justify-between rounded-[calc(0.5rem+0.75rem)] border-2 border-teal-800 bg-[#e2e9e6] p-2 font-[Expose] text-gray-950 md:min-h-[400px] md:w-[60%]"
						id="card"
					>
						<div
							style:--carousel="carousel-{item}"
							class=" carousel flex w-full snap-x snap-mandatory overflow-x-auto rounded-[calc(1.25rem-0.5rem)]"
						>
							<Image
								class=""
								background="auto"
								src="https://picsum.photos/id/42/750/300"
								alt="A lovely bath"
								layout="fullWidth"
							/>
						</div>
						<div class=" info-body">
							<h1 class=" text-xl">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ullam esse
								necessitatibus beatae possimus similique delectus saepe qui harum in? Harum fugit
								placeat maiores, hic neque asperiores nostrum atque alias?
							</h1>
						</div>
						<div class="flex w-full flex-wrap items-center justify-between">
							<p class="text-xl">&#x20B9; 8000/month</p>
							<button class="rounded-xl bg-teal-300 p-4 font-[CG]"> See more </button>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</main>

<style>
	.carousel::-webkit-scrollbar {
		display: none; /* Safari and Chrome */
	}
	.carousel {
		view-transition-name: var(--carousel);
		view-transition-class: carousel;
	}
</style>

<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import Logo from '$lib/components/LogoWithName.svelte';
	import { goto } from '$app/navigation';
	import { gsap } from 'gsap';
	import { tick } from 'svelte';

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selectedLabel, open, selected },
		helpers: { isSelected }
	} = createSelect<string>({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	});

	const options = ['Hostel', 'Rooms', 'Flats', "PG's"];
	let inputFocused = $state(false);
	function handleClick(event: any) {
		let clickedOutside = !event.target.closest('#input, #dropdown');
		if (clickedOutside) {
			inputFocused = false;
		}
	}

	let selectedLocation = $state();
	let selectedOption = $derived($selected?.value);
	

	$effect(() => {
		let tl = gsap.timeline();
		tl.fromTo(
			'.D-shape',
			{
				x: 500
			},
			{
				x: 0,
				duration: 1.1,
				delay: 1.5
			}
		);
		tl.fromTo(
			'.slideIn',
			{
				x: -500,

				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				duration: 1
			}
		);
		tl.fromTo(
			'.motto',
			{
				y: 50,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.7
			}
		);
		tl.fromTo(
			'.pointer',
			{
				opacity: 0,
				scale: 0.5
			},
			{
				opacity: 1,
				scale:1,
				duration:1,
				rotate:'7deg'
			}
		);
	});
</script>

<svelte:body onclick={handleClick} />
<!-- <div class="absolute z-[10] bg-gray-800 h-svh top-[50%] left-[50%] [transform:translate(-50%,-50%)]">
	<svg
		width="300"
		height="215"
		viewBox="0 0 1021 236"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_d_44_35)">
			<path
				d="M132.918 133.168C132.918 170.778 94.4329 201.268 46.9588 201.268C-0.515282 201.268 24.6797 170.778 24.6797 133.168C24.6797 95.5573 -0.515282 65.068 46.9588 65.068C94.4329 65.068 132.918 95.5573 132.918 133.168Z"
				fill="#282F2D"
			/>
		</g>
	</svg>
</div> -->
<main class=" flex min-h-svh w-full items-center justify-center">
	<div
		class="flex w-full -translate-y-8 flex-col items-center justify-between space-y-6 sm:w-[95%] sm:space-y-8 lg:w-[85%] lg:-translate-y-10"
	>
		<div class="flex w-full flex-col items-center justify-center">
			<Logo />

			<span
				class="motto m-1 text-wrap text-center font-[GS] text-3xl font-medium text-[#282F2D] sm:text-5xl"
			>
				Your perfect space. A <span class="relative">
					click
					<svg
						width="55"
						height="55"
						class="pointer absolute md:-bottom-6 -bottom-8 right-0"
						viewBox="0 0 171 75"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g filter="url(#filter0_d_1_4)">
							<path d="M6.00005 64C6.00005 64 94.0001 3 167 3" stroke="#84CC16" stroke-width="5" />
						</g>
						<defs>
							<filter
								id="filter0_d_1_4"
								x="0.577545"
								y="0.5"
								width="170.422"
								height="73.5545"
								filterUnits="userSpaceOnUse"
								color-interpolation-filters="sRGB"
							>
								<feFlood flood-opacity="0" result="BackgroundImageFix" />
								<feColorMatrix
									in="SourceAlpha"
									type="matrix"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
									result="hardAlpha"
								/>
								<feOffset dy="4" />
								<feGaussianBlur stdDeviation="2" />
								<feComposite in2="hardAlpha" operator="out" />
								<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_4" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_dropShadow_1_4"
									result="shape"
								/>
							</filter>
						</defs>
					</svg>
				</span> away.
			</span>
		</div>
		<div class="flex w-full flex-col items-center justify-between gap-y-3 sm:flex-row sm:gap-x-2">
			<div class="relative flex w-[95%] flex-col sm:w-[65%] lg:w-[75%]">
				<label class="font-[GS] text-base text-teal-900 sm:text-lg" for="input">Get started</label>
				<input
					bind:value={selectedLocation}
					autocomplete="off"
					onfocus={() => (inputFocused = true)}
					id="input"
					placeholder="Start searching for your locality or college"
					type="text"
					class="w-full shrink-0 {inputFocused
						? 'rounded-t-xl'
						: 'rounded-xl'} bg-[#021f1e] px-[10px] py-[12px] font-[CG] text-lg text-stone-100 transition-all duration-500 placeholder:text-sm placeholder:text-stone-300/80 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent sm:placeholder:text-base"
				/>
				{#if inputFocused}
					<div
						id="dropdown"
						in:fade|local={{ duration: 200 }}
						class="scrollBar absolute top-full mt-1 max-h-[12rem] min-h-fit min-w-[calc(100%+5px)] self-center overflow-auto border-2 border-teal-400 bg-teal-100 p-1"
					>
						<ul class=" space-y-3 p-1 font-[Expose]">
							{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as item, i}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									onclick={() => {
										selectedLocation = 'Modern college of engineering, Shivaji nagar, 411031';
									}}
									class="cursor-pointer border-b-2 border-b-teal-600"
								>
									Modern college of engineering, Shivaji nagar, 411031
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			<div class="flex w-[80%] flex-col sm:w-[40%] lg:w-[45%]">
				<!-- svelte-ignore a11y_label_has_associated_control - $label contains the 'for' attribute -->
				<label class="font-[GS] text-base text-teal-900 sm:text-lg" use:melt={$label}
					>Select type</label
				>

				<div class=" flex h-full w-full flex-col gap-y-[5px]">
					<button
						id=""
						class="flex items-center justify-between rounded-xl border border-teal-600 bg-teal-200 bg-opacity-40 px-[11px] py-[10px] font-[CG] text-lg font-normal text-teal-900 hover:bg-teal-100"
						use:melt={$trigger}
						aria-label="Place Type"
					>
						{$selectedLabel || 'Choose from Hostels, rooms...'}
						<ChevronDown class="size-5 shrink-0" />
					</button>
					{#if $open}
						<div
							class=" flex min-h-fit flex-col gap-y-1 rounded-xl bg-teal-200 p-2 font-[CG] text-lg"
							use:melt={$menu}
							transition:fade={{ duration: 150 }}
						>
							{#each options as item}
								<div use:melt={$group(item)}>
									<div
										class="hover:bg-magnum-100 focus:text-magnum-700 relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-1 text-neutral-800 focus:z-10
							data-[highlighted]:rounded-xl data-[highlighted]:bg-teal-400
							data-[disabled]:opacity-50"
										use:melt={$option({ value: item, label: item })}
									>
										{item}
										<div class="check {$isSelected(item) ? 'block' : 'hidden'}">
											<Check class="size-4 shrink-0" />
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<button
				onclick={() => {
					goto(`/search?loc=${selectedLocation}&type=${selectedOption}`);
				}}
				class=" search-btn relative gap-x-2 rounded-xl border border-teal-600 bg-teal-200 stroke-teal-800 px-[22px] py-[8px] text-center font-[CG] text-lg font-normal text-teal-900 sm:self-center sm:px-[25px] sm:py-[10px] md:self-end lg:self-end"
			>
				Search
			</button>
		</div>
	</div>
</main>

<style>
	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}
	.scrollBar {
		scrollbar-color: #082f27 #99f6e4;
		scrollbar-width: thin;
	}
	/* @media (879px >= width >=768px) {
		.search-btn {
			transform: translateY(-15px);
		}
	} */
	.search-btn::after,
	.search-btn::before {
		--angle: 0deg;
		content: '';
		position: absolute;
		inset: -3px;
		background-image: conic-gradient(
			from var(--angle),
			transparent 60%,
			#2b81cdff 14%,
			#16c5c7ff 46%,
			#5dd6d9ff 72%,
			#2b81cdff 88%
		);
		z-index: -1;
		border-radius: 15px;
		animation: spin 4s linear infinite;
	}
	.search-btn::before {
		filter: blur(1.5rem);
		opacity: 0.6;
	}
	@keyframes spin {
		from {
			--angle: 0deg;
		}
		to {
			--angle: 360deg;
		}
	}
</style>

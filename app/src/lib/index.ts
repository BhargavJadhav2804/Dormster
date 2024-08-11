import { writable } from 'svelte/store';
import { page } from '$app/stores';

// place files you want to import through the `$lib` alias in this folder.
export let showMenu = writable(true);
export const sleep = (delay: number) =>
	new Promise((resolve) =>
		setTimeout(() => {
			resolve('resolved....');
		}, delay)
	);

<!--
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
-->
<script lang="ts">
	import { currentUser } from '../../lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';

	onMount(async () => {
		if (!currentUser) {
			goto('/login');
		}
	});

	let seconds: number = 60;
	let minutes: number = 0;
	let sets: number = 3;
	let totalTime: number = 0;
	let time: number = 0;
	let interval: number;

	let isPaused: boolean = false;
	let isRunning: boolean = false;
	let completedSets: number = 0;

	$: checkIfSetComplete(time);

	function handleButtonClick(): void {
		if (!isRunning && !isPaused) {
			start();
		} else if (isRunning) {
			pause();
		} else if (isPaused) {
			resume();
		}
	}

	function start(): void {
		interval = setInterval(() => {
			time += 1;
			checkIfSetComplete(time);
		}, 1000);
		totalTime = seconds;
		totalTime += minutes * 60;
		completedSets = 0;
		isRunning = true;
		isPaused = false;
	}

	function checkIfSetComplete(time: number): void {
		if (time == 0) return;
		if (time >= totalTime) {
			completeSet();
		}
	}

	function completeSet(): void {
		time = 0;
		completedSets += 1;
		if (completedSets >= sets) {
			reset();
			alert('Workout complete!');
		} else {
			pause();
		}
	}

	function pause(): void {
		clearInterval(interval);
		isPaused = true;
		isRunning = false;
	}

	function resume(): void {
		interval = setInterval(() => {
			time += 1;
			checkIfSetComplete(time);
		}, 1000);
		isPaused = false;
		isRunning = true;
	}

	function reset(): void {
		time = 0;
		clearInterval(interval);
		isRunning = false;
		isPaused = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle class="text-center text-2xl font-bold">Workout Set Timer</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<div class="flex justify-between">
					<span class="text-lg font-semibold">Time left:</span>
					<span class="text-lg font-bold">{totalTime - time}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-lg font-semibold">Completed sets:</span>
					<span class="text-lg font-bold">{completedSets} / {sets}</span>
				</div>
				<div class="grid grid-cols-3 gap-4">
					<div class="space-y-2">
						<Label for="minutes">Minutes</Label>
						<Input id="minutes" type="number" min="0" step="1" bind:value={minutes} />
					</div>
					<div class="space-y-2">
						<Label for="seconds">Seconds</Label>
						<Input id="seconds" type="number" min="0" step="1" bind:value={seconds} />
					</div>
					<div class="space-y-2">
						<Label for="sets">Sets</Label>
						<Input id="sets" type="number" min="1" step="1" bind:value={sets} />
					</div>
				</div>
			</div>
		</CardContent>
		<CardFooter class="flex justify-between">
			<Button on:click={handleButtonClick} variant="default">
				{#if !isRunning && !isPaused}
					Start
				{:else if isRunning}
					Pause
				{:else if isPaused}
					Resume
				{/if}
			</Button>
			<Button on:click={reset} variant="destructive">Reset</Button>
			<Button variant="outline" href="/dashboard">Back to Dashboard</Button>
		</CardFooter>
	</Card>
</div>

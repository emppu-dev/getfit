<!--
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
-->
<script lang="ts">
	import { currentUser, pb } from '../../lib/pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as StartWorkout from '../../lib/StartWorkout';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Command, CommandInput } from '$lib/components/ui/command';
	import { Plus, ArrowLeft, Save, Trash2 } from 'lucide-svelte';

	let exercises: StartWorkout.Exercise[] = [];
	let newExercise: StartWorkout.Exercise = {
		name: '',
		level: '',
		sets: 0,
		reps: 0,
		weight: 0
	};
	let error = '';
	let availableExercises: StartWorkout.Exercise[] = [];
	let searchTerm = '';
	let filteredExercises: StartWorkout.Exercise[] = [];
	let filteredCache: { [key: string]: StartWorkout.Exercise[] } = {};
	onMount(async () => {
		if (!$currentUser) {
			goto('/login');
		} else {
			availableExercises = await StartWorkout.getAvailableExercises();
		}
	});

	$: {
		if (filteredCache.hasOwnProperty(searchTerm)) {
			console.log('use cache');
			filteredExercises = filteredCache[searchTerm];
		} else if (searchTerm.length > 0) {
			filteredExercises = availableExercises.filter((exercise) =>
				exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			filteredCache[searchTerm] = filteredExercises;
		} else {
			filteredExercises = [];
		}
	}

	function selectExercise(exercise: StartWorkout.Exercise) {
		newExercise = { ...exercise, sets: 0, reps: 0, weight: 0 };
		searchTerm = '';
	}

	function deleteExercise(index: number) {
		exercises = exercises.filter((_, i) => i !== index);
	}

	function addExercise(exercise: StartWorkout.Exercise) {
		if (exercise.name) {
			exercises = [...exercises, exercise];
			exercise = { name: '', level: '', sets: 0, reps: 0, weight: 0 };
			searchTerm = '';
			error = '';
		} else {
			error = 'Please select a valid exercise from the list.';
		}
	}

	async function saveWorkoutSession() {
		if ($currentUser) {
			try {
				const xpGained = await StartWorkout.saveWorkoutSession(
					$currentUser as StartWorkout.User,
					exercises
				);
				exercises = [];
				error = '';
				alert(`Workout saved! You gained ${xpGained} XP.`);
				goto('/dashboard');
			} catch (e) {
				error = e instanceof Error ? e.message : 'An unknown error occurred';
			}
		}
	}
</script>

{#if $currentUser}
	<div class="container mx-auto p-4">
		<Card>
			<CardHeader>
				<CardTitle>Start a New Workout</CardTitle>
				<CardDescription>Add exercises to your workout session</CardDescription>
			</CardHeader>
			<CardContent>
				<form class="space-y-4">
					<div class="space-y-2">
						<Label for="exercise-search">Search Exercise</Label>
						<Command>
							<CommandInput placeholder="Search exercises" bind:value={searchTerm} />
							{#if searchTerm.length > 0}
								<ul class="max-h-60 overflow-y-auto shadow-md">
									{#each filteredExercises as exercise}
										<li class="md:hover:bg-slate-100 dark:md:hover:bg-zinc-800">
											<button
												class="h-full w-full p-1 text-left"
												on:click={() => selectExercise(exercise)}>{exercise.name}</button
											>
										</li>
									{/each}
								</ul>
							{/if}
						</Command>
						{#if newExercise.name}
							<p>Selected: {newExercise.name}</p>
						{/if}
					</div>
					<div class="grid grid-cols-3 gap-4">
						<div class="space-y-2">
							<Label for="sets">Sets</Label>
							<Input type="number" id="sets" bind:value={newExercise.sets} min="0" max="128" />
						</div>
						<div class="space-y-2">
							<Label for="reps">Reps</Label>
							<Input type="number" id="reps" bind:value={newExercise.reps} min="0" max="128" />
						</div>
						<div class="space-y-2">
							<Label for="weight">Weight</Label>
							<Input
								type="number"
								id="weight"
								bind:value={newExercise.weight}
								min="0"
								max="2048"
								step="0.1"
							/>
						</div>
					</div>
					<Button on:click={() => addExercise(newExercise)}>
						<Plus class="mr-2 h-4 w-4" />
						Add Exercise
					</Button>
				</form>
				<div class="mt-8">
					<h3 class="mb-4 text-lg font-semibold">Current Workout</h3>
					{#each exercises as exercise, index (index)}
						<Card class="mb-4">
							<CardContent class="flex items-center justify-between pt-4">
								<div>
									<h4 class="font-bold">{exercise.name} (Level: {exercise.level})</h4>
									<p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}</p>
								</div>
								<Button variant="destructive" on:click={() => deleteExercise(index)}>
									<Trash2 class="mr-2 h-4 w-4" />
									Delete
								</Button>
							</CardContent>
						</Card>
					{/each}
				</div>

				{#if exercises.length > 0}
					<Button on:click={saveWorkoutSession} variant="secondary">
						<Save class="mr-2 h-4 w-4" />
						Save Workout Session
					</Button>
				{/if}

				{#if error}
					<p class="mt-2 text-red-500">{error}</p>
				{/if}
				<div class="flex justify-end space-x-2">
					<Button variant="outline" href="/dashboard">
						<ArrowLeft class="mr-2 h-4 w-4" />
						Back to Dashboard
					</Button>
				</div>
			</CardContent>
		</Card>
	</div>
{:else}
	<p>Redirecting to login...</p>
{/if}

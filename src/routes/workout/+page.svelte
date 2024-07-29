<!--
GetFit: A gamefied exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
-->
<script lang="ts">
    import { currentUser, pb } from '../../lib/pocketbase';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import * as StartWorkout from '../../lib/StartWorkout';

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

    onMount(async () => {
        if (!$currentUser) {
            goto('/login');
        } else {
            availableExercises = await StartWorkout.getAvailableExercises();
        }
    });

    function addExercise() {
        const selectedExercise = availableExercises.find((e) => e.name === newExercise.name);
        if (selectedExercise) {
            exercises = [...exercises, { ...newExercise, level: selectedExercise.level }];
            newExercise = { name: '', level: '', sets: 0, reps: 0, weight: 0 };
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
            } catch (e) {
                error = e instanceof Error ? e.message : 'An unknown error occurred';
            }
        }
    }
</script>

{#if $currentUser}
    <main>
        <h2>Start a New Workout</h2>
        <form on:submit|preventDefault={addExercise}>
            <select bind:value={newExercise.name} required>
                <option value="">Select an exercise</option>
                {#each availableExercises as exercise}
                    <option value={exercise.name}>{exercise.name}</option>
                {/each}
            </select>
            <input type="number" bind:value={newExercise.sets} placeholder="Sets" min="0" max="128" />
            <input type="number" bind:value={newExercise.reps} placeholder="Reps" min="0" max="128" />
            <input
                type="number"
                bind:value={newExercise.weight}
                placeholder="Weight"
                min="0"
                max="2048"
                step="0.1"
            />
            <button type="submit">Add Exercise</button>
        </form>

        <h3>Current Workout</h3>
        {#each exercises as exercise, index (index)}
            <div>
                <h4>{exercise.name} (Level: {exercise.level})</h4>
                <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}</p>
            </div>
        {/each}

        {#if exercises.length > 0}
            <button on:click={saveWorkoutSession}>Save Workout Session</button>
        {/if}

        {#if error}
            <p style="color: red;">{error}</p>
        {/if}
    </main>
{:else}
    <p>Redirecting to login...</p>
{/if}

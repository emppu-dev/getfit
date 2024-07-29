<script lang="ts">
	import { currentUser, pb } from '../../lib/pocketbase';
	import { calculateLevel } from '../../lib/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as WorkoutTracker from '../../lib/WorkoutTracker';
	import * as WorkoutSessionDetails from '../../lib/WorkoutSessionDetails';
	import * as StartWorkout from '../../lib/StartWorkout';

	let userLevel = 1;
	let workoutSessions: WorkoutTracker.WorkoutSession[] = [];
	let selectedSession: WorkoutTracker.WorkoutSession | null = null;
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
	let sessionExercises: WorkoutSessionDetails.Exercise[] = [];

	$: {
		if ($currentUser) {
			userLevel = calculateLevel($currentUser.xp);
		}
	}

	onMount(async () => {
		if (!$currentUser) {
			goto('/login');
		} else {
			await loadWorkoutSessions();
			availableExercises = await StartWorkout.getAvailableExercises();
		}
	});

	async function loadWorkoutSessions() {
		if ($currentUser) {
			try {
				workoutSessions = await WorkoutTracker.loadWorkoutSessions(
					$currentUser as WorkoutTracker.User
				);
				error = '';
			} catch (e) {
				error = e instanceof Error ? e.message : 'An unknown error occurred';
			}
		}
	}

	async function selectSession(session: WorkoutTracker.WorkoutSession) {
		selectedSession = session;
		try {
			sessionExercises = await WorkoutSessionDetails.loadWorkoutSession(session.id);
			error = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		}
	}

	async function deleteWorkoutSession(id: string) {
		try {
			await WorkoutTracker.deleteWorkoutSession(id);
			await loadWorkoutSessions();
			if (selectedSession?.id === id) {
				selectedSession = null;
			}
			error = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		}
	}

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
				await loadWorkoutSessions();
				alert(`Workout saved! You gained ${xpGained} XP.`);
			} catch (e) {
				error = e instanceof Error ? e.message : 'An unknown error occurred';
			}
		}
	}

	function signOut() {
		pb.authStore.clear();
		goto('/login');
	}
</script>

{#if $currentUser}
	<main>
		<h1>Welcome to your Dashboard, {$currentUser.name}!</h1>
		<p>Your email: {$currentUser.email}</p>
		<p>Your XP: {$currentUser.xp}</p>
		<p>Your Level: {userLevel}</p>

		<div>
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
		</div>

		<div>
			<h2>Your Workout Sessions</h2>
			{#each workoutSessions as session (session.id)}
				<div>
					<h3>Workout on {new Date(session.created).toLocaleString()}</h3>
					<button on:click={() => selectSession(session)}>View Details</button>
					<button on:click={() => deleteWorkoutSession(session.id)}>Delete</button>
				</div>
			{/each}

			{#if selectedSession}
				<div>
					<h3>Workout Details</h3>
					{#if sessionExercises.length > 0}
						{#each sessionExercises as exercise (exercise.id)}
							<div>
								<h4>{exercise.workout}</h4>
								<p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}</p>
							</div>
						{/each}
					{:else}
						<p>No exercises found for this session.</p>
					{/if}
				</div>
			{/if}
		</div>

		{#if error}
			<p style="color: red;">{error}</p>
		{/if}

		<button on:click={signOut}>Sign Out</button>
	</main>
{:else}
	<p>Redirecting to login...</p>
{/if}

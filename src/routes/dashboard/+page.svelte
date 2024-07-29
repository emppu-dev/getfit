<script lang="ts">
	import { currentUser, pb } from '../../lib/pocketbase';
	import { calculateLevel } from '../../lib/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as WorkoutTracker from '../../lib/WorkoutTracker';
	import * as WorkoutSessionDetails from '../../lib/WorkoutSessionDetails';

	let userLevel = 1;
	let workoutSessions: WorkoutTracker.WorkoutSession[] = [];
	let selectedSession: WorkoutTracker.WorkoutSession | null = null;
	let sessionExercises: WorkoutSessionDetails.Exercise[] = [];
	let error = '';

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

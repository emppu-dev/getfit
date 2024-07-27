<script lang="ts">
  import { pb } from './pocketbase';
  import { onMount } from 'svelte';

  export let sessionId: string;

  interface Exercise {
    id: string;
    workout: string;
    sets: number;
    reps: number;
    weight: number;
    created: string;
    updated: string;
  }

  let exercises: Exercise[] = [];
  let error = '';

  async function loadWorkoutSession() {
    console.log('Loading workout session for ID:', sessionId);
    try {
      const session = await pb.collection('workouts').getOne(sessionId);
      console.log('Fetched session:', session);

      const exerciseIds: string[] = session.exercises || [];
      console.log('Exercise IDs:', exerciseIds);

      const fetchedExercises = await Promise.all(
        exerciseIds.map(async (id) => {
          try {
            const exercise = await pb.collection('workout').getOne(id);
            return {
              id: exercise.id,
              workout: exercise.workout,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              created: exercise.created,
              updated: exercise.updated
            };
          } catch (fetchError) {
            console.error(`Error fetching exercise with ID ${id}:`, fetchError);
            return null;
          }
        })
      );

      exercises = fetchedExercises.filter(exercise => exercise !== null) as Exercise[];
      console.log('Fetched exercises:', exercises);
    } catch (e) {
      console.error('Error loading workout session:', e);
      error = 'Failed to load workout session. Please try again.';
    }
  }

  $: if (sessionId) {
    loadWorkoutSession();
  }
</script>

<div>
  <h3>Workout Details</h3>
  {#if exercises.length > 0}
    {#each exercises as exercise (exercise.id)}
      <div>
        <h4>{exercise.workout}</h4>
        <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}</p>
      </div>
    {/each}
  {:else}
    <p>{error}</p>
  {/if}

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
</div>

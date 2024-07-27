<script lang="ts">
    import { pb, currentUser } from './pocketbase';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    interface Exercise {
      workout: string;
      sets: number;
      reps: number;
      weight: number;
    }
    
    let exercises: Exercise[] = [];
    let newExercise: Exercise = {
      workout: '',
      sets: 0,
      reps: 0,
      weight: 0
    };
    let error = '';
    
    function addExercise() {
      exercises = [...exercises, { ...newExercise }];
      newExercise = { workout: '', sets: 0, reps: 0, weight: 0 };
    }
    
    async function saveWorkoutSession() {
    if ($currentUser && exercises.length > 0) {
      try {
        const session = await pb.collection('workouts').create({
          field: $currentUser.id,
          sessionName: 'My Workout',
          notes: 'Notes about the workout',
        });
      console.log('Session ID:', session.id);
      console.log('Exercises:', exercises);


      const exerciseIds = [];

      for (const exercise of exercises) {
        const createdExercise = await pb.collection('workout').create({
          workout: exercise.workout,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          field: $currentUser.id
        });

        exerciseIds.push(createdExercise.id);
      }

      await pb.collection('workouts').update(session.id, {
        exercises: exerciseIds
      });

      exercises = [];
      error = '';
      dispatch('workoutAdded');
    } catch (e) {
      console.error('Error saving workout session:', e);
      error = 'Failed to save workout session. Please try again.';
    }
  } else {
    error = 'Please add at least one exercise before saving.';
  }
}

    </script>
    
    <div>
      <h2>Start a New Workout</h2>
      <form on:submit|preventDefault={addExercise}>
        <input bind:value={newExercise.workout} placeholder="Exercise name" required>
        <input type="number" bind:value={newExercise.sets} placeholder="Sets" min="0" max="128">
        <input type="number" bind:value={newExercise.reps} placeholder="Reps" min="0" max="128">
        <input type="number" bind:value={newExercise.weight} placeholder="Weight" min="0" max="2048" step="0.1">
        <button type="submit">Add Exercise</button>
      </form>
    
      <h3>Current Workout</h3>
      {#each exercises as exercise, index (index)}
        <div>
          <h4>{exercise.workout}</h4>
          <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}</p>
        </div>
      {/each}
    
      {#if exercises.length > 0}
        <button on:click={saveWorkoutSession}>Save Workout Session</button>
      {/if}
    
      {#if error}
        <p style="color: red;">{error}</p>
      {/if}
    </div>
    
<script lang="ts">
  import { pb, currentUser } from "./pocketbase";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  interface Exercise {
    name: string;
    level: string;
    sets: number;
    reps: number;
    weight: number;
  }

  let exercises: Exercise[] = [];
  let newExercise: Exercise = {
    name: "",
    level: "",
    sets: 0,
    reps: 0,
    weight: 0,
  };
  let error = "";
  let availableExercises: Exercise[] = [];

  onMount(async () => {
    const response = await fetch('assets/exercises.json');
    availableExercises = await response.json();
  });

  function addExercise() {
    const selectedExercise = availableExercises.find(e => e.name === newExercise.name);
    if (selectedExercise) {
      exercises = [...exercises, { ...newExercise, level: selectedExercise.level }];
      newExercise = { name: "", level: "", sets: 0, reps: 0, weight: 0 };
    } else {
      error = "Please select a valid exercise from the list.";
    }
  }

  function calculateXP(exercises: Exercise[]): number {
    let totalXP = 0;
    let exerciseCount = 0;

    for (const exercise of exercises) {
      let baseXP = 10;
      switch (exercise.level) {
        case "beginner":
          baseXP = 10;
          break;
        case "intermediate":
          baseXP = 15;
          break;
        case "expert":
          baseXP = 20;
          break;
      }
      const exerciseXPValue = baseXP * exercise.reps * exercise.sets;
      totalXP += exerciseXPValue;
      exerciseCount++;
    }

    if (exerciseCount >= 3) totalXP += 50;
    if (exerciseCount >= 5) totalXP += 100;
    if (exerciseCount >= 7) totalXP += 150;

    return totalXP;
  }

  async function saveWorkoutSession() {
    if ($currentUser && exercises.length > 0) {
      try {
        const session = await pb.collection("workouts").create({
          field: $currentUser.id,
          sessionName: "My Workout",
          notes: "Notes about the workout",
        });

        const exerciseIds = [];

        for (const exercise of exercises) {
          const createdExercise = await pb.collection("workout").create({
            workout: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            field: $currentUser.id,
          });

          exerciseIds.push(createdExercise.id);
        }

        await pb.collection("workouts").update(session.id, {
          exercises: exerciseIds,
        });

        const xpGained = calculateXP(exercises);

        const updatedUser = await pb
          .collection("users")
          .update($currentUser.id, {
            xp: ($currentUser.xp || 0) + xpGained,
          });

        $currentUser = updatedUser;

        exercises = [];
        error = "";
        dispatch("workoutAdded", { xpGained });
      } catch (e) {
        console.error("Error saving workout session:", e);
        error = "Failed to save workout session. Please try again.";
      }
    } else {
      error = "Please add at least one exercise before saving.";
    }
  }
</script>

<div>
  <h2>Start a New Workout</h2>
  <form on:submit|preventDefault={addExercise}>
    <select bind:value={newExercise.name} required>
      <option value="">Select an exercise</option>
      {#each availableExercises as exercise}
        <option value={exercise.name}>{exercise.name}</option>
      {/each}
    </select>
    <input
      type="number"
      bind:value={newExercise.sets}
      placeholder="Sets"
      min="0"
      max="128"
    />
    <input
      type="number"
      bind:value={newExercise.reps}
      placeholder="Reps"
      min="0"
      max="128"
    />
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
      <p>
        Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}
      </p>
    </div>
  {/each}

  {#if exercises.length > 0}
    <button on:click={saveWorkoutSession}>Save Workout Session</button>
  {/if}

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
</div>

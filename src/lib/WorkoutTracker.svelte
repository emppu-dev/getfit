<script lang="ts">
    import { pb, currentUser } from './pocketbase';
    import { onMount } from 'svelte';
    import StartWorkout from './StartWorkout.svelte';
    import WorkoutSessionDetails from './WorkoutSessionDetails.svelte';
    
    interface WorkoutSession {
      id: string;
      created: string;
      updated: string;
      field: string;
    }
    
    let workoutSessions: WorkoutSession[] = [];
    let selectedSession: WorkoutSession | null = null;
    let error = '';
    
    onMount(async () => {
      if ($currentUser) {
        await loadWorkoutSessions();
      }
    });
    
    async function loadWorkoutSessions() {
      if ($currentUser) {
        try {
          const result = await pb.collection('workouts').getList<WorkoutSession>(1, 50, {
            sort: '-created',
            filter: `field = "${$currentUser.id}"`,
          });
          workoutSessions = result.items;
          error = '';
        } catch (e) {
          console.error('Error loading workout sessions:', e);
          error = 'Failed to load workout sessions. Please try again.';
        }
      }
    }
    
    async function selectSession(session: WorkoutSession) {
      selectedSession = session;
    }
    
    async function deleteWorkoutSession(id: string) {
      try {
        await pb.collection('workouts').delete(id);
        await loadWorkoutSessions();
        if (selectedSession?.id === id) {
          selectedSession = null;
        }
        error = '';
      } catch (e) {
        console.error('Error deleting workout session:', e);
        error = 'Failed to delete workout session. Please try again.';
      }
    }
    </script>
    
    {#if $currentUser}
      <div>
        <StartWorkout on:workoutAdded={loadWorkoutSessions} />
    
        <h2>Your Workout Sessions</h2>
        {#each workoutSessions as session (session.id)}
          <div>
            <h3>Workout on {new Date(session.created).toLocaleString()}</h3>
            <button on:click={() => selectSession(session)}>View Details</button>
            <button on:click={() => deleteWorkoutSession(session.id)}>Delete</button>
          </div>
        {/each}
    
        {#if selectedSession}
          <WorkoutSessionDetails sessionId={selectedSession.id} />
        {/if}
    
        {#if error}
          <p style="color: red;">{error}</p>
        {/if}
      </div>
    {:else}
      <p>Please log in to view your workouts.</p>
    {/if}
    
<script lang="ts">
  import { currentUser, pb } from './pocketbase';
  import { navigate } from './utils';
  import { onMount } from 'svelte';
  import WorkoutTracker from './WorkoutTracker.svelte';
  
  onMount(() => {
    if (!$currentUser) {
      navigate('/login');
    }
  });
  
  function signOut() {
    pb.authStore.clear();
    navigate('/login');
  }
  </script>
  
  {#if $currentUser}
    <main>
      <h1>Welcome to your Dashboard, {$currentUser.name}!</h1>
      <p>Your email: {$currentUser.email}</p>
      
      <WorkoutTracker />
      
      <button on:click={signOut}>Sign Out</button>
    </main>
  {:else}
    <p>Redirecting to login...</p>
  {/if}
  
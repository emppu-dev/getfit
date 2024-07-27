<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser } from './lib/pocketbase';
  import Login from './lib/Login.svelte';
  import Register from './lib/Register.svelte';
  import Dashboard from './lib/Dashboard.svelte';
  import { navigate } from './lib/utils';

  let currentRoute = '/';

  onMount(() => {
    window.addEventListener('popstate', () => {
      currentRoute = window.location.pathname;
    });
    checkRouteAccess();
  });

  $: {
    checkRouteAccess();
  }

  function checkRouteAccess() {
    if (!$currentUser && currentRoute !== '/register') {
      navigate('/login');
    } else if ($currentUser && (currentRoute === '/login' || currentRoute === '/register')) {
      navigate('/');
    }
  }
</script>

<main>
  {#if currentRoute === '/login'}
    <Login />
    <p>
      Don't have an account? 
      <a href="/register" on:click|preventDefault={() => navigate('/register')}>Register</a>
    </p>
  {:else if currentRoute === '/register'}
    <Register />
    <p>
      Already have an account? 
      <a href="/login" on:click|preventDefault={() => navigate('/login')}>Login</a>
    </p>
  {:else}
    <Dashboard />
  {/if}
</main>

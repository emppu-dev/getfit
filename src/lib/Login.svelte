<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  import { navigate } from "./utils";

  let email: string = "";
  let password: string = "";
  let message: string = "";

  async function login() {
    try {
      const user = await pb
        .collection("users")
        .authWithPassword(email, password);
      if (!user.record.verified) {
        message = "Please verify your email before logging in.";
        pb.authStore.clear();
      } else {
        message = "Logged in successfully!";
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      message = "Login failed. Please check your credentials.";
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <input placeholder="Email" type="email" bind:value={email} required />

  <input
    placeholder="Password"
    type="password"
    bind:value={password}
    required
  />

  <button type="submit">Login</button>
</form>

{#if message}
  <p>{message}</p>
{/if}

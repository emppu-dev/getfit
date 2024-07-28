<script lang="ts">
  import { pb } from "./pocketbase";
  import { navigate } from "./utils";

  let email: string = "";
  let password: string = "";
  let displayName: string = "";
  let message: string = "";

  async function signUp() {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name: displayName,
      };
      await pb.collection("users").create(data);
      await pb.collection("users").requestVerification(email);
      message =
        "Sign up successful! Please check your email to verify your account.";
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      message = "Sign up failed. Please try again.";
    }
  }
</script>

<form on:submit|preventDefault={signUp}>
  <input placeholder="Email" type="email" bind:value={email} required />

  <input
    placeholder="Password"
    type="password"
    bind:value={password}
    required
  />

  <input
    placeholder="Display Name"
    type="text"
    bind:value={displayName}
    required
  />

  <button type="submit">Sign Up</button>
</form>

{#if message}
  <p>{message}</p>
{/if}

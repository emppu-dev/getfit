<!--
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
-->
<script lang="ts">
	import { pb } from '../../lib/pocketbase';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';

	let email: string = '';
	let password: string = '';
	let message: string = '';

	async function login() {
		try {
			const user = await pb.collection('users').authWithPassword(email, password);
			if (!user.record.verified) {
				message = 'Please verify your email before logging in.';
				pb.authStore.clear();
			} else {
				message = 'Logged in successfully!';
				goto('/dashboard');
			}
		} catch (err) {
			console.error(err);
			message = 'Login failed. Please check your credentials.';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<form on:submit|preventDefault={login}>
		<Card.Root class="mx-auto max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Login</Card.Title>
				<Card.Description>Enter your email below to login to your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="mail@example.com"
							bind:value={email}
							required
						/>
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a href="##" class="ml-auto inline-block text-sm underline">
								Forgot your password?
							</a>
						</div>
						<Input id="password" type="password" bind:value={password} required />
					</div>
					<Button type="submit" class="w-full">Login</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Don&apos;t have an account?
					<a href="register" class="underline">Sign up</a>
				</div>
				{#if message}
					<div class="mt-4 text-center text-sm">{message}</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</form>
</div>

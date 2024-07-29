<script lang="ts">
	import { pb } from '../../lib/pocketbase';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';

	let email: string = '';
	let password: string = '';
	let displayName: string = '';
	let message: string = '';

	async function signUp() {
		try {
			const data = {
				email,
				password,
				passwordConfirm: password,
				name: displayName
			};
			await pb.collection('users').create(data);
			await pb.collection('users').requestVerification(email);
			message = 'Sign up successful! Please check your email to verify your account.';
			setTimeout(() => goto('/login'), 3000);
		} catch (err) {
			console.error(err);
			message = 'Sign up failed. Please try again.';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<form on:submit|preventDefault={signUp}>
		<Card.Root class="mx-auto max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Sign Up</Card.Title>
				<Card.Description>Enter your information to create an account</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="name">Display Name</Label>
						<Input id="name" type="text" placeholder="John Doe" bind:value={displayName} required />
					</div>
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
						</div>
						<Input id="password" type="password" bind:value={password} required />
					</div>
					<Button type="submit" class="w-full">Create an account</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Already have an account?
					<a href="/login" class="underline">Sign in</a>
				</div>
				{#if message}
					<div class="mt-4 text-center text-sm">{message}</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</form>
</div>

{#if message}
	<p>{message}</p>
{/if}

<!--
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Github } from 'lucide-svelte';
</script>

<div class="flex h-screen flex-col items-center justify-center p-4">
	<Card class="mx-auto max-w-md shadow-lg">
		<CardHeader>
			<CardTitle class="text-center text-4xl font-bold">Welcome to GetFit</CardTitle>
			<CardDescription class="mt-2 text-center text-lg">
				A gamified exercise tracker that makes fitness fun and engaging.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p class="mb-4 text-center">
				Track your workouts, earn rewards, and level up your fitness journey!
			</p>
			<div class="flex justify-center space-x-4">
				<Button variant="default" href="/login">Login</Button>
				<Button variant="outline" href="/register">Register</Button>
			</div>
		</CardContent>
	</Card>

	<div class="mt-8 flex items-center">
		<a href="https://github.com/emppu-dev/getfit" class="flex items-center hover:underline">
			<Github class="mr-2 h-6 w-6" />
			View on GitHub
		</a>
	</div>
</div>

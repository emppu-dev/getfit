<!--
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
-->
<script lang="ts">
    import { currentUser } from '../../lib/pocketbase';
    import { goto } from '$app/navigation';
    import { onMount } from "svelte"

    onMount(async () => {
		if (!$currentUser) {
			goto('/login');
		}
	});

    let seconds: number = 0
    let minutes: number = 0
    let sets: number = 1
    let totalTime: number = 0
    let time: number = 0
    let interval: number

    let isPaused: boolean = false

    let completedSets: number = 0

    $: checkIfSetComplete(time)

    function start(): void {
        interval = setInterval(() => {
            time += 1
        }, 1000)
        totalTime = seconds
        totalTime += minutes * 60
        completedSets = 0
    }

    function checkIfSetComplete(time: number): void {
        if (time == 0) return
        if (time >= totalTime) {
            completeSet()
        }
    }

    function completeSet(): void {
        time = 0
        completedSets += 1
        if (completedSets >= sets) {
            reset()
            alert('Workout complete!')
        }
    }

    function pause(): void {
        clearInterval(interval)
        isPaused = true
    }

    function resume(): void {
        interval = setInterval(() => {
            time += 1
        }, 1000)
        isPaused = false
    }

    function reset(): void {
        time = 0
        clearInterval(interval)
    }

</script>

<h2>Time left: {totalTime - time}</h2>
<h2>Completed sets: {completedSets} / {sets}</h2>

<input type="number" min=0 step=1 placeholder="minutes" bind:value={minutes} />
<input type="number" min=0 step=1 placeholder="seconds" bind:value={seconds} />

<input type="number" min=1 step=1 placeholder="sets" bind:value={sets} />
<button on:click={start}>Start</button>
{#if isPaused}
    <button on:click={resume}>Resume</button>
{:else}
    <button on:click={pause}>Pause</button>
{/if}
<button on:click={reset}>Reset</button>
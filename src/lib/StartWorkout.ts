/* 
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
*/
import { pb } from './pocketbase';

export interface Exercise {
	name: string;
	level: string;
	sets: number;
	reps: number;
	weight: number;
}

export interface User {
	id: string;
	xp?: number;
	[key: string]: any;
}

export async function getAvailableExercises(): Promise<Exercise[]> {
	const response = await fetch('assets/exercises.json');
	return await response.json();
}

export function calculateXP(exercises: Exercise[]): number {
	let totalXP = 0;
	let exerciseCount = 0;

	for (const exercise of exercises) {
		let baseXP = 10;
		switch (exercise.level) {
			case 'beginner':
				baseXP = 10;
				break;
			case 'intermediate':
				baseXP = 15;
				break;
			case 'expert':
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

export async function saveWorkoutSession(
	currentUser: User | null,
	exercises: Exercise[]
): Promise<number> {
	if (currentUser && exercises.length > 0) {
		try {
			const session = await pb.collection('workouts').create({
				field: currentUser.id,
				sessionName: 'My Workout',
				notes: 'Notes about the workout'
			});

			const exerciseIds = [];

			for (const exercise of exercises) {
				const createdExercise = await pb.collection('workout').create({
					workout: exercise.name,
					sets: exercise.sets,
					reps: exercise.reps,
					weight: exercise.weight,
					field: currentUser.id
				});

				exerciseIds.push(createdExercise.id);
			}

			await pb.collection('workouts').update(session.id, {
				exercises: exerciseIds
			});

			const xpGained = calculateXP(exercises);

			const updatedUser = await pb.collection('users').update(currentUser.id, {
				xp: (currentUser.xp || 0) + xpGained
			});

			return xpGained;
		} catch (e) {
			console.error('Error saving workout session:', e);
			throw new Error('Failed to save workout session. Please try again.');
		}
	} else {
		throw new Error('Please add at least one exercise before saving.');
	}
}

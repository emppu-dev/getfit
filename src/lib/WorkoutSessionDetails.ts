/* 
GetFit: A gamefied exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
*/
import { pb } from './pocketbase';

export interface Exercise {
	id: string;
	workout: string;
	sets: number;
	reps: number;
	weight: number;
	created: string;
	updated: string;
}

export async function loadWorkoutSession(sessionId: string): Promise<Exercise[]> {
	try {
		const session = await pb.collection('workouts').getOne(sessionId);
		const exerciseIds: string[] = session.exercises || [];

		const fetchedExercises = await Promise.all(
			exerciseIds.map(async (id) => {
				try {
					const exercise = await pb.collection('workout').getOne(id);
					return {
						id: exercise.id,
						workout: exercise.workout,
						sets: exercise.sets,
						reps: exercise.reps,
						weight: exercise.weight,
						created: exercise.created,
						updated: exercise.updated
					};
				} catch (fetchError) {
					console.error(`Error fetching exercise with ID ${id}:`, fetchError);
					return null;
				}
			})
		);

		return fetchedExercises.filter((exercise) => exercise !== null) as Exercise[];
	} catch (e) {
		console.error('Error loading workout session:', e);
		throw new Error('Failed to load workout session. Please try again.');
	}
}

import { pb } from './pocketbase';

export interface WorkoutSession {
	id: string;
	created: string;
	updated: string;
	field: string;
}

export interface User {
	id: string;
	[key: string]: any;
}

export async function loadWorkoutSessions(currentUser: User | null): Promise<WorkoutSession[]> {
	if (currentUser) {
		try {
			const result = await pb.collection('workouts').getList<WorkoutSession>(1, 50, {
				sort: '-created',
				filter: `field = "${currentUser.id}"`
			});
			return result.items;
		} catch (e) {
			console.error('Error loading workout sessions:', e);
			throw new Error('Failed to load workout sessions. Please try again.');
		}
	}
	return [];
}

export async function deleteWorkoutSession(id: string): Promise<void> {
	try {
		await pb.collection('workouts').delete(id);
	} catch (e) {
		console.error('Error deleting workout session:', e);
		throw new Error('Failed to delete workout session. Please try again.');
	}
}

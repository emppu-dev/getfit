/* 
GetFit: A gamified exercise tracker
Copyright (C) 2024 emppu-dev
Licensed under the GNU AGPLv3
https://raw.githubusercontent.com/emppu-dev/getfit/main/LICENSE
*/

import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { PUBLIC_API_URL } from '$env/static/public';

export const pb = new PocketBase(PUBLIC_API_URL);

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    currentUser.set(pb.authStore.model);
});
import { initializeApp } from 'firebase/app'; //Firebase imports
import { getDatabase} from 'firebase/database';
import {getAuth,signOut} from 'firebase/auth';
import config from './config';

//initializing firebase and setting up db and auth
const app = initializeApp(config);
export const db = getDatabase(app); 
export const auth=getAuth(app);
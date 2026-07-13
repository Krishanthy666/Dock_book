// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB1BnuFGysR4AnQmeBJvX7EF5cbGrb3zzA",
  authDomain: "mediq-a34e2.firebaseapp.com",
  databaseURL: "https://mediq-a34e2-default-rtdb.firebaseio.com",
  projectId: "mediq-a34e2",
  storageBucket: "mediq-a34e2.firebasestorage.app",
  messagingSenderId: "253690051194",
  appId: "1:253690051194:web:fb6be9f866d9dbffb959c3",
  measurementId: "G-451GKZ9S5L"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

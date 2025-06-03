
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDt0CTq2JvJPBSx0JzGLdCWbjYOCDidURg",
  authDomain: "project-om-c0c6e.firebaseapp.com",
  databaseURL: "https://project-om-c0c6e-default-rtdb.firebaseio.com/",
  projectId: "project-om-c0c6e",
  storageBucket: "project-om-c0c6e.firebasestorage.app",
  messagingSenderId: "250167357713",
  appId: "1:250167357713:web:dee22e46f08f9598b0dcb0",
  measurementId: "G-HVZ590S9VH"
};

let app;
let auth;
let database;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.log('Please replace the Firebase config with your actual project credentials from Firebase Console');
}

export { auth, database };

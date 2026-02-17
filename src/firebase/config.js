import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCowDfSEJJ2pCYrzIxKmhtkwVjJtXiAMkQ",
  authDomain: "agriculture-9ea45.firebaseapp.com",
  projectId: "agriculture-9ea45",
  storageBucket: "agriculture-9ea45.firebasestorage.app",
  messagingSenderId: "276579410211",
  appId: "1:276579410211:web:69b4379b6d8f65575aec96"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { createApiServer } from './http-server.js';
import { readServerPort } from './serverConfig.js';

// Firebase client configuration used by the existing frontend project.
const firebaseConfig = {
  apiKey: 'AIzaSyCowDfSEJJ2pCYrzIxKmhtkwVjJtXiAMkQ',
  authDomain: 'agriculture-9ea45.firebaseapp.com',
  projectId: 'agriculture-9ea45',
  storageBucket: 'agriculture-9ea45.firebasestorage.app',
  messagingSenderId: '276579410211',
  appId: '1:276579410211:web:69b4379b6d8f65575aec96',
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


const saveSchedule = async (userId, formData, schedule) => {
  const scheduleCollectionRef = collection(db, 'users', userId, 'irrigationSchedules');
  const documentRef = await addDoc(scheduleCollectionRef, {
    ...schedule,
    formData,
    createdAt: serverTimestamp(),
  });
  return documentRef.id;
};


const port = readServerPort();
const server = createApiServer({ saveSchedule });
server.listen(port, () => {
  console.log(`Irrigation API server running on http://localhost:${port}`);
});

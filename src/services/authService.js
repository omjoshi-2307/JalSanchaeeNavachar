import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before logging in.');
    }
    // Update last login
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: new Date(),
    });
    return userCredential.user;
  },

  register: async (email, password, fullName, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    await sendEmailVerification(userCredential.user);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      fullName,
      email,
      phone,
      createdAt: new Date(),
      lastLogin: new Date(),
      role: 'user'
    });
    
    await signOut(auth); // Sign out until verified
    return userCredential.user;
  },

  loginWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName,
        email: user.email,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: 'user',
        loginMethod: 'google'
      });
    } else {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date()
      });
    }
    return user;
  },

  logout: async () => {
    await signOut(auth);
  },

  resendVerification: async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }
};

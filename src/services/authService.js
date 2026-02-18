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
    const userRef = doc(db, 'users', userCredential.user.uid);
    await updateDoc(userRef, {
      lastLogin: new Date(),
    });
    return userCredential.user;
  },

  register: async (email, password, fullName, phone, village = '', farmSize = '', irrigationType = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    await sendEmailVerification(userCredential.user);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      fullName,
      email,
      phone,
      village,
      farmSize,
      irrigationType,
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
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        fullName: user.displayName,
        email: user.email,
        village: '',
        farmSize: '',
        irrigationType: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        role: 'user',
        loginMethod: 'google'
      });
    } else {
      await updateDoc(userRef, {
        lastLogin: new Date()
      });
    }
    return user;
  },

  updateUserProfile: async (uid, data) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  getUserProfile: async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
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

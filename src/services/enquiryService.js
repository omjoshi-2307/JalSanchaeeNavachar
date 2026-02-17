import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const enquiryService = {
  saveEnquiry: async (userId, data) => {
    try {
      const enquiryRef = collection(db, 'users', userId, 'enquiries');
      const docRef = await addDoc(enquiryRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving enquiry:', error);
      throw new Error('Failed to save enquiry. Please try again.');
    }
  },
};

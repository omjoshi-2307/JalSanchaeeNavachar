import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const HISTORY_COLLECTION = "farmer_history";

/**
 * Fetch history records for a specific farmer UID.
 * 
 * @param {string} uid - The Firebase Auth UID of the farmer
 * @returns {Promise<Array>} List of history records
 */
export const getFarmerHistory = async (uid) => {
    try {
        const q = query(
            collection(db, HISTORY_COLLECTION),
            where("farmerId", "==", uid),
            // orderBy requires a composite index in Firestore for "farmerId" and "date"
            orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        const historyList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return historyList;
    } catch (error) {
        console.error("Error fetching farmer history:", error);
        // Throw error so it can be handled by the UI
        throw error;
    }
};

/**
 * Add a new history record for a farmer.
 * (Included for completeness)
 */
export const addHistoryRecord = async (uid, data) => {
    try {
        const docRef = await addDoc(collection(db, HISTORY_COLLECTION), {
            farmerId: uid,
            ...data,
            date: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding history record:", error);
        throw error;
    }
};

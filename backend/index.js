import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc } from "firebase/firestore";

dotenv.config();

// Firebase Client Configuration (same as frontend)
const firebaseConfig = {
  apiKey: "AIzaSyCowDfSEJJ2pCYrzIxKmhtkwVjJtXiAMkQ",
  authDomain: "agriculture-9ea45.firebaseapp.com",
  projectId: "agriculture-9ea45",
  storageBucket: "agriculture-9ea45.firebasestorage.app",
  messagingSenderId: "276579410211",
  appId: "1:276579410211:web:69b4379b6d8f65575aec96"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


const PORT = process.env.PORT || 5000;

// Internal logic for irrigation calculation
function calculateIrrigation(data) {
  // Ensure area is a number
  const area = parseFloat(data.area) || 0;
  const unit = data.unit || 'acres';
  const cropName = data.cropName || 'default';
  const season = data.season || 'rabi';
  const soilType = data.soilType || 'loamy';

  // Normalize area to acres
  const areaInAcres = unit === 'sqft' ? area / 43560 : area;
  
  // Base logic
  const baseWaterPerAcre = 5000; // liters per week
  const cropFactor = cropName.toLowerCase().includes('wheat') ? 1.2 : 
                     cropName.toLowerCase().includes('rice') ? 1.8 : 1.0;
  const seasonalMultiplier = season === 'kharif' ? 0.8 : (season === 'zaid' ? 1.5 : 1.1);
  const soilAdjustment = soilType === 'sandy' ? 1.4 : (soilType === 'clay' ? 0.7 : 1.0);

  const totalWater = areaInAcres * baseWaterPerAcre * cropFactor * seasonalMultiplier * soilAdjustment;
  const frequency = soilType === 'sandy' ? 'Daily' : 'Twice a week';

  // Generate 4-week schedule
  const schedule = [];
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + (i * 7));
    schedule.push({
      week: i + 1,
      date: date.toISOString().split('T')[0],
      waterQuantityLiters: Math.round(totalWater / 4),
      frequency,
      instructions: `Water in the early ${i % 2 === 0 ? 'morning' : 'evening'} for best results.`
    });
  }

  return {
    summary: {
      cropName,
      totalMonthlyWater: Math.round(totalWater),
      averageFrequency: frequency,
      metrics: {
        cropFactor,
        seasonalMultiplier,
        soilAdjustment,
        areaInAcres: areaInAcres.toFixed(2)
      }
    },
    schedule
  };
}

app.post('/api/generate-schedule', async (req, res) => {
  const { userId, formData } = req.body;

  console.log(`Received request for user: ${userId}`);

  if (!userId || !formData) {
    return res.status(400).json({ error: 'Missing userId or formData' });
  }

  try {
    const result = calculateIrrigation(formData);
    
    // Store in Firestore using Client SDK
    // path: users/{userId}/irrigationSchedules
    const scheduleCollectionRef = collection(db, 'users', userId, 'irrigationSchedules');
    const docRef = await addDoc(scheduleCollectionRef, {
      ...result,
      formData,
      createdAt: serverTimestamp()
    });

    console.log(`Schedule saved successfully with ID: ${docRef.id}`);

    res.json({
      success: true,
      id: docRef.id,
      schedule: result
    });
  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to generate irrigation schedules\n`);
});

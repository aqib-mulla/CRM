import mongoose from 'mongoose';
import medicineAvailableSchema from '../models/MedicineAvailable.js';

export let pharmacyConnection = null;
export let MedicineAvailable = null;

export const connectPharmacyDB = async () => {
  try {
    pharmacyConnection = await mongoose.createConnection(process.env.MONGO_PHARMACY_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // ✅ define model here
    MedicineAvailable = pharmacyConnection.model('MedicineAvailable', medicineAvailableSchema);

    console.log('✅ Connected to pharmacy database');
  } catch (error) {
    console.error('❌ Error connecting to pharmacy database:', error.message);
  }
};

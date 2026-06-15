import mongoose from "mongoose";
import { pharmacyConnection } from "../config/pharmacyDB.js";

const medicineAvailableSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  batch: { type: String, required: true },
  expiry: { type: String, required: true },
  mrp: { type: Number, required: true },
  ptr: { type: Number, required: true },
  qty: { type: Number, required: true },
  free: { type: Number, default: 0 },
  schAmt: { type: Number, required: true },
  disc: { type: Number, required: true },
  base: { type: Number, required: true },
  gst: { type: Number, required: true },
  amount: { type: Number, required: true },
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Function to get the model after the connection exists
export const getMedicineAvailableModel = () => {
  if (!pharmacyConnection) throw new Error("Pharmacy DB connection not established yet");
  return pharmacyConnection.model('MedicineAvailable', medicineAvailableSchema);
};

export default  medicineAvailableSchema
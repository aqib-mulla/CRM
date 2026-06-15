import mongoose from "mongoose";

// Define the Department Schema
const departmentSchema = new mongoose.Schema({
  department: {
    type: String,
  },
});

// Create the Department model
const Department = mongoose.model('Department', departmentSchema);

export default Department;

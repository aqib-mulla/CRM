import mongoose from "mongoose";

const feesSchema = new mongoose.Schema({
  department: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
  feesName: {
    type: String,
    // required: true,
  },
  opFees: {
    type: Number,
    // required: true,
  },
  ipFees: {
    type: Number,
    // required: true,
  },
});

const Fees = mongoose.model('Fees', feesSchema);

export default Fees;

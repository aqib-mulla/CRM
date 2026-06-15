import mongoose from "mongoose";

const billDetailsSchema = new mongoose.Schema({

  refBillId : {
    type: mongoose.Schema.Types.ObjectId
  },

  billId: {
    type: Number,
  },

  testId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  type: {
    type: String,
  },
  
  fees: {
    type: Number,
  },

  refpId : {type: mongoose.Schema.Types.ObjectId, ref:'PatientReg'},

  doctorName: { type: mongoose.Schema.Types.ObjectId, ref: 'doctorDetail' },


  department: {
    type: String,
  },

  createdAt: { type: Date, default: Date.now },

  // Add any other fields specific to the bill details
});

const BillDetail = mongoose.model('BillDetail', billDetailsSchema);

export default BillDetail

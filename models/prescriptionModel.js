// import mongoose from 'mongoose';

// const prescriptionSchema = new mongoose.Schema({
//     patientId: {
//         type: mongoose.Schema.Types.ObjectId,
//         // required: true
//     },

//     billId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'PatientReg',
//     },

//     billNO:{
//         type:Number,
//     },

//     content: {
//         type: String,
//         // required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// const Prescription = mongoose.model('Prescription', prescriptionSchema);

// export default Prescription;

// import mongoose from 'mongoose';

// const prescriptionSchema = new mongoose.Schema({
//     patientId: {
//         type: mongoose.Schema.Types.ObjectId,
//         // required: true
//     },

//     billId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'PatientReg',
//     },

//     billNO:{
//         type:Number,
//     },

//     content: {
//         type: String,
//         // required: true,
//     },

//     bloodPressure: {
//         type: String, // e.g., "120/80 mmHg"
//     },
//     heartRate: {
//         type: Number, // e.g., 72 bpm
//     },
//     temperature: {
//         type: Number, // e.g., 98.6 °F or 37 °C
//     },
//     respiratoryRate: {
//         type: Number, // e.g., 16 breaths per minute
//     },
//     height: {
//         type: Number, // e.g., 170 cm
//     },
//     weight: {
//         type: Number, // e.g., 70 kg
//     },
//     complaints: {
//         type: String,
//     },
//     clinicalFindings: {
//         type: String,
//     },
//     diagnosis: {
//         type: String,
//     },
//     knownDiagnosis: {
//         type: String,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// const Prescription = mongoose.model('Prescription', prescriptionSchema);

// export default Prescription;

import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
    {
        patientId: { type: mongoose.Schema.Types.ObjectId},
        billId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientReg'},
        doctorName: { type: mongoose.Schema.Types.ObjectId, ref: 'doctorDetail'},
        billNO: { type: String},
        content: { type: String },
        bloodPressure: { type: String },
        heartRate: { type: Number },
        temperature: { type: Number },
        respiratoryRate: { type: Number },
        height: { type: Number },
        weight: { type: Number },
        complaints: { type: String },
        clinicalFindings: { type: String },
        diagnosis: { type: String },
        knownDiagnosis: { type: String },
        medicines: [
            {
                medicineName: { type: String },
                composition: { type: String },
                foodType: { type: String },
                duration: { type: String },
                frequency: { type: String },
                tablets: { type: String }
            }
        ],
        selectedTests: [
            {
                testId: { type: mongoose.Schema.Types.ObjectId },
                testName: { type: String}
            }
        ]
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;

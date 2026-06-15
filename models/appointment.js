import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctorDetail",
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "PatientReg",
        required: true
    },

    appointmentDate: {
        type: Date,
        required: true
    },

    appointmentTime: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Booked"
    },

    remarks: String

}, {
    timestamps: true
});

export default mongoose.model(
    "appointment",
    appointmentSchema
);
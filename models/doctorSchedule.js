import mongoose from "mongoose";

const doctorScheduleSchema = new mongoose.Schema({

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctorDetail"
    },

    schedule: [
        {
            day: String,
            startTime: String,
            endTime: String,
            slotDuration: Number,
            isActive: Boolean
        }
    ]

}, {
    timestamps: true
});

export default mongoose.model(
    "doctorSchedule",
    doctorScheduleSchema
);
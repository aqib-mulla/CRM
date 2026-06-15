import mongoose from "mongoose";

const profileTestSchema = new mongoose.Schema({
  
    profileName: {
        type: String,
        // required: true,
    },
    profilePrice: {
        type: Number,
        // required: true,
    },
    testFields: [
        {
            testId: { type: mongoose.Schema.Types.ObjectId },
            testName: { type: String},
        },
    ],
});

const CreateProfile = mongoose.model("CreateProfile", profileTestSchema);

export default CreateProfile

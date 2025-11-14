import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },

        address: {
            line1: { type: String, required: true },
            line2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, default: "India" }
        },
        contact: {
            phone: { type: String, required: true },
            email: { type: String }
        },
        doctors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Hospital", HospitalSchema);

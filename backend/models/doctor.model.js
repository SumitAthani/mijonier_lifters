import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        specialization: { type: String, required: true },
        experience: { type: Number, default: 0 },
        qualification: { type: String },

        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);

import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        userIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        messages: [
            {
                text: { type: String, required: true },
                sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                sentAt: { type: Date, default: Date.now }
            }
        ],

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        },
    },
    { timestamps: true }
);

export default mongoose.model("Ticket", TicketSchema);

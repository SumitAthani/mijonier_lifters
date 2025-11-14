const PingPongItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    previousOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    status: {
      type: String,
      enum: ["initiated", "in-progress", "transferred", "completed"],
      default: "initiated"
    },

    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("PingPongItem", PingPongItemSchema);

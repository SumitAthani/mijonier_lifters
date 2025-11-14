const PingPongHistorySchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "PingPongItem", required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    comments: { type: String, default: "" },
    direction: { type: String, enum: ["forward", "backward"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("PingPongHistory", PingPongHistorySchema);

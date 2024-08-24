import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
  {
    resolution: String,
    urlStream: String,
  },
  {
    timestamps: true,
  }
);

const Stream = mongoose.models.Stream || mongoose.model("Stream", streamSchema);

export default Stream;

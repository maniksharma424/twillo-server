import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    sid: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message", messageSchema);

export default Message;

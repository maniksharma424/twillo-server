import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    completed: {
      type: Boolean,
      required: true,
    },
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

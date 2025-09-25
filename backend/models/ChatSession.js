import mongoose from "mongoose"

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        enum: ["user", "ai"],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      severity: {
        type: String,
        enum: ["NORMAL", "ELEVATED", "CRISIS"],
        default: "NORMAL",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const ChatSession = mongoose.model("ChatSession", chatSessionSchema)

export default ChatSession


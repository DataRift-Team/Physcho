import mongoose from "mongoose"

const counsellorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  specialization: String,
  experience: String,
  image: String,
  optional: String, // Optional field for extra info
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Counsellor", counsellorSchema)

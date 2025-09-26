
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// Import routes
import authRoutes from "./routes/auth.js"
import aiRoutes from "./routes/ai.js"
import screeningRoutes from "./routes/screening.js"
import bookingRoutes from "./routes/bookings.js"
import forumRoutes from "./routes/forum.js"
import resourceRoutes from "./routes/resources.js"
import adminRoutes from "./routes/admin.js"
import counsellorRoutes from './routes/counsellorRoutes.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",           // React web
  "http://127.0.0.1:3000",           // React web alternate
  "exp://127.0.0.1:19000", 
  "exp://10.132.217.211:8081",
  "http://localhost:5173",          
  // process.env.EXPO_TUNNEL_URL,       // Expo tunnel URL (optional)
]

// Middleware: CORS (allow all origins for development, including ngrok and mobile)
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)

app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/digital-psych", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/screening", screeningRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/forum", forumRoutes)
app.use("/api/resources", resourceRoutes)
app.use("/api/admin", adminRoutes)
app.use('/api/counsellors', counsellorRoutes)
// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Digital Psychological Intervention System API is running" })
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

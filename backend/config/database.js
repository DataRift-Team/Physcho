// const mongoose = require("mongoose")

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })

//     console.log(`MongoDB Connected: ${conn.connection.host}`)

//     // Create indexes for better performance
//     await createIndexes()
//   } catch (error) {
//     console.error("Database connection error:", error)
//     process.exit(1)
//   }
// }

// const createIndexes = async () => {
//   try {
//     // User indexes
//     await mongoose.connection.collection("users").createIndex({ email: 1 }, { unique: true })
//     await mongoose.connection.collection("users").createIndex({ role: 1 })

//     // Screening indexes
//     await mongoose.connection.collection("screenings").createIndex({ userId: 1, createdAt: -1 })
//     await mongoose.connection.collection("screenings").createIndex({ riskLevel: 1 })

//     // Chat session indexes
//     await mongoose.connection.collection("chatsessions").createIndex({ userId: 1, createdAt: -1 })
//     await mongoose.connection.collection("chatsessions").createIndex({ severity: 1 })

//     // Booking indexes
//     await mongoose.connection.collection("bookings").createIndex({ userId: 1, date: -1 })
//     await mongoose.connection.collection("bookings").createIndex({ counselorId: 1, date: 1 })
//     await mongoose.connection.collection("bookings").createIndex({ status: 1 })

//     // Forum post indexes
//     await mongoose.connection.collection("forumposts").createIndex({ createdAt: -1 })
//     await mongoose.connection.collection("forumposts").createIndex({ isModerated: 1 })

//     console.log("Database indexes created successfully")
//   } catch (error) {
//     console.error("Error creating indexes:", error)
//   }
// }

// module.exports = connectDB


import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Create indexes for better performance
    await createIndexes()
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

const createIndexes = async () => {
  try {
    // User indexes
    await mongoose.connection.collection("users").createIndex({ email: 1 }, { unique: true })
    await mongoose.connection.collection("users").createIndex({ role: 1 })

    // Screening indexes
    await mongoose.connection.collection("screenings").createIndex({ userId: 1, createdAt: -1 })
    await mongoose.connection.collection("screenings").createIndex({ riskLevel: 1 })

    // Chat session indexes
    await mongoose.connection.collection("chatsessions").createIndex({ userId: 1, createdAt: -1 })
    await mongoose.connection.collection("chatsessions").createIndex({ severity: 1 })

    // Booking indexes
    await mongoose.connection.collection("bookings").createIndex({ userId: 1, date: -1 })
    await mongoose.connection.collection("bookings").createIndex({ counselorId: 1, date: 1 })
    await mongoose.connection.collection("bookings").createIndex({ status: 1 })

    // Forum post indexes
    await mongoose.connection.collection("forumposts").createIndex({ createdAt: -1 })
    await mongoose.connection.collection("forumposts").createIndex({ isModerated: 1 })

    console.log("Database indexes created successfully")
  } catch (error) {
    console.error("Error creating indexes:", error)
  }
}

export default connectDB

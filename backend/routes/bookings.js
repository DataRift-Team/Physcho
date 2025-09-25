// const express = require("express")
// const Booking = require("../models/Booking")
// const { auth } = require("../middleware/auth")

// const router = express.Router()

// // Mock counselors data
// const counselors = [
//   { id: 1, name: "Dr. Sarah Johnson", specialization: "Anxiety & Depression", available: true },
//   { id: 2, name: "Dr. Michael Chen", specialization: "Stress Management", available: true },
//   { id: 3, name: "Dr. Emily Rodriguez", specialization: "Student Counseling", available: true },
//   { id: 4, name: "Dr. David Kim", specialization: "Crisis Intervention", available: true },
// ]

// // Get available counselors
// router.get("/counselors", auth, (req, res) => {
//   res.json(counselors)
// })

// // Book appointment
// router.post("/book", auth, async (req, res) => {
//   try {
//     const { counselorName, date, time, notes } = req.body
//     const userId = req.user._id

//     const booking = new Booking({
//       userId,
//       counselorName,
//       date: new Date(date),
//       time,
//       notes,
//     })

//     await booking.save()

//     res.status(201).json({
//       bookingId: booking._id,
//       message: "Appointment booked successfully",
//       booking: {
//         counselorName: booking.counselorName,
//         date: booking.date,
//         time: booking.time,
//         status: booking.status,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get user's bookings
// router.get("/my-bookings", auth, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userId: req.user._id }).sort({ date: 1 })

//     res.json(bookings)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get all bookings (admin)
// router.get("/all", auth, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access required" })
//     }

//     const bookings = await Booking.find().populate("userId", "name email").sort({ date: 1 })

//     res.json(bookings)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// module.exports = router


import express from "express"
import Booking from "../models/Booking.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Mock counselors data
const counselors = [
  { id: 1, name: "Dr. Sarah Johnson", specialization: "Anxiety & Depression", available: true },
  { id: 2, name: "Dr. Michael Chen", specialization: "Stress Management", available: true },
  { id: 3, name: "Dr. Emily Rodriguez", specialization: "Student Counseling", available: true },
  { id: 4, name: "Dr. David Kim", specialization: "Crisis Intervention", available: true },
]

// Get available counselors
router.get("/counselors", auth, (req, res) => {
  res.json(counselors)
})

// Book appointment
router.post("/book", auth, async (req, res) => {
  try {
    const { counselorName, date, time, notes } = req.body
    const userId = req.user._id

    const booking = new Booking({
      userId,
      counselorName,
      date: new Date(date),
      time,
      notes,
    })

    await booking.save()

    res.status(201).json({
      bookingId: booking._id,
      message: "Appointment booked successfully",
      booking: {
        counselorName: booking.counselorName,
        date: booking.date,
        time: booking.time,
        status: booking.status,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user's bookings
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ date: 1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all bookings (admin)
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .sort({ date: 1 })

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router


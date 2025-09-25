// const express = require("express")
// const User = require("../models/User")
// const Screening = require("../models/Screening")
// const Booking = require("../models/Booking")
// const ForumPost = require("../models/ForumPost")
// const ChatSession = require("../models/ChatSession")
// const { adminAuth } = require("../middleware/auth")

// const router = express.Router()

// // Get analytics data
// router.get("/analytics", adminAuth, async (req, res) => {
//   try {
//     // Get counts
//     const totalUsers = await User.countDocuments({ isGuest: false })
//     const totalScreenings = await Screening.countDocuments()
//     const totalBookings = await Booking.countDocuments()
//     const pendingPosts = await ForumPost.countDocuments({ status: "pending" })

//     // Get screening severity distribution
//     const severityDistribution = await Screening.aggregate([
//       {
//         $group: {
//           _id: "$severity",
//           count: { $sum: 1 },
//         },
//       },
//     ])

//     // Get screenings by test type
//     const testTypeDistribution = await Screening.aggregate([
//       {
//         $group: {
//           _id: "$testType",
//           count: { $sum: 1 },
//         },
//       },
//     ])

//     // Get recent activity (last 30 days)
//     const thirtyDaysAgo = new Date()
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

//     const recentScreenings = await Screening.countDocuments({
//       createdAt: { $gte: thirtyDaysAgo },
//     })

//     const recentBookings = await Booking.countDocuments({
//       createdAt: { $gte: thirtyDaysAgo },
//     })

//     // Get crisis alerts (high severity screenings and chat sessions)
//     const crisisScreenings = await Screening.countDocuments({
//       severity: { $in: ["SEVERE", "CRISIS"] },
//       createdAt: { $gte: thirtyDaysAgo },
//     })

//     const crisisChatSessions = await ChatSession.countDocuments({
//       "messages.severity": "CRISIS",
//       createdAt: { $gte: thirtyDaysAgo },
//     })

//     res.json({
//       overview: {
//         totalUsers,
//         totalScreenings,
//         totalBookings,
//         pendingPosts,
//       },
//       distributions: {
//         severity: severityDistribution,
//         testTypes: testTypeDistribution,
//       },
//       recentActivity: {
//         screenings: recentScreenings,
//         bookings: recentBookings,
//       },
//       alerts: {
//         crisisScreenings,
//         crisisChatSessions,
//         totalCrisis: crisisScreenings + crisisChatSessions,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get users list
// router.get("/users", adminAuth, async (req, res) => {
//   try {
//     const users = await User.find({ isGuest: false }).select("-password").sort({ createdAt: -1 })

//     res.json(users)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get detailed screening data
// router.get("/screenings", adminAuth, async (req, res) => {
//   try {
//     const screenings = await Screening.find().populate("userId", "name email").sort({ createdAt: -1 })

//     res.json(screenings)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// module.exports = router

import express from "express"
import User from "../models/User.js"
import Screening from "../models/Screening.js"
import Booking from "../models/Booking.js"
import ForumPost from "../models/ForumPost.js"
import ChatSession from "../models/ChatSession.js"
import { adminAuth } from "../middleware/auth.js"

const router = express.Router()

// Get analytics data
router.get("/analytics", adminAuth, async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments({ isGuest: false })
    const totalScreenings = await Screening.countDocuments()
    const totalBookings = await Booking.countDocuments()
    const pendingPosts = await ForumPost.countDocuments({ status: "pending" })

    // Get screening severity distribution
    const severityDistribution = await Screening.aggregate([
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 },
        },
      },
    ])

    // Get screenings by test type
    const testTypeDistribution = await Screening.aggregate([
      {
        $group: {
          _id: "$testType",
          count: { $sum: 1 },
        },
      },
    ])

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentScreenings = await Screening.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    })

    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    })

    // Get crisis alerts (high severity screenings and chat sessions)
    const crisisScreenings = await Screening.countDocuments({
      severity: { $in: ["SEVERE", "CRISIS"] },
      createdAt: { $gte: thirtyDaysAgo },
    })

    const crisisChatSessions = await ChatSession.countDocuments({
      "messages.severity": "CRISIS",
      createdAt: { $gte: thirtyDaysAgo },
    })

    res.json({
      overview: {
        totalUsers,
        totalScreenings,
        totalBookings,
        pendingPosts,
      },
      distributions: {
        severity: severityDistribution,
        testTypes: testTypeDistribution,
      },
      recentActivity: {
        screenings: recentScreenings,
        bookings: recentBookings,
      },
      alerts: {
        crisisScreenings,
        crisisChatSessions,
        totalCrisis: crisisScreenings + crisisChatSessions,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get users list
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isGuest: false })
      .select("-password")
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get detailed screening data
router.get("/screenings", adminAuth, async (req, res) => {
  try {
    const screenings = await Screening.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(screenings)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router


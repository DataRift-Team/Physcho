// const express = require("express")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// const User = require("../models/User")
// const { auth } = require("../middleware/auth")

// const router = express.Router()

// // Sign up
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body

//     // Check if user exists
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" })
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//     })

//     await user.save()

//     // Generate token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET || "fallback_secret", {
//       expiresIn: "7d",
//     })

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body

//     // Check if user exists
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" })
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" })
//     }

//     // Generate token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET || "fallback_secret", {
//       expiresIn: "7d",
//     })

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Guest login
// router.post("/guest", async (req, res) => {
//   try {
//     const guestUser = new User({
//       name: `Guest_${Date.now()}`,
//       email: `guest_${Date.now()}@temp.com`,
//       isGuest: true,
//     })

//     await guestUser.save()

//     const token = jwt.sign({ userId: guestUser._id }, process.env.JWT_ACCESS_SECRET || "fallback_secret", {
//       expiresIn: "24h",
//     })

//     res.json({
//       token,
//       user: {
//         id: guestUser._id,
//         name: guestUser.name,
//         email: guestUser.email,
//         role: guestUser.role,
//         isGuest: true,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get current user
// router.get("/me", auth, async (req, res) => {
//   res.json({
//     user: {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       role: req.user.role,
//       isGuest: req.user.isGuest,
//       preferredLanguage: req.user.preferredLanguage,
//     },
//   })
// })

// module.exports = router

import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Guest login
router.post("/guest", async (req, res) => {
  try {
    const guestUser = new User({
      name: `Guest_${Date.now()}`,
      email: `guest_${Date.now()}@temp.com`,
      isGuest: true,
    })

    await guestUser.save()

    const token = jwt.sign(
      { userId: guestUser._id },
      process.env.JWT_ACCESS_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    )

    res.json({
      token,
      user: {
        id: guestUser._id,
        name: guestUser.name,
        email: guestUser.email,
        role: guestUser.role,
        isGuest: true,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isGuest: req.user.isGuest,
      preferredLanguage: req.user.preferredLanguage,
    },
  })
})

export default router


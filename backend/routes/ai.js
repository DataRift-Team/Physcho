// const express = require("express")
// const ChatSession = require("../models/ChatSession")
// const { auth } = require("../middleware/auth")
// const geminiService = require("../services/geminiService")

// const router = express.Router()

// // Enhanced chat with AI using Gemini
// router.post("/chat", auth, async (req, res) => {
//   try {
//     const { message } = req.body
//     const userId = req.user._id

//     if (!message || message.trim().length === 0) {
//       return res.status(400).json({ message: "Message is required" })
//     }

//     // Get or create chat session
//     let chatSession = await ChatSession.findOne({ userId }).sort({ createdAt: -1 })

//     if (!chatSession) {
//       chatSession = new ChatSession({ userId, messages: [] })
//     }

//     // Add user message
//     chatSession.messages.push({
//       sender: "user",
//       message: message.trim(),
//     })

//     // Get conversation context for better AI responses
//     const recentMessages = chatSession.messages.slice(-5) // Last 5 messages for context
//     const context = {
//       recentMessages,
//       userProfile: {
//         name: req.user.name,
//         isGuest: req.user.isGuest,
//       },
//     }

//     // Get AI response using Gemini service
//     const { response, severity } = await geminiService.generateResponse(message, context)

//     // Add AI response
//     chatSession.messages.push({
//       sender: "ai",
//       message: response,
//       severity: severity,
//     })

//     await chatSession.save()

//     // Log crisis situations for admin attention
//     if (severity === "CRISIS") {
//       console.log(`CRISIS ALERT: User ${userId} - ${req.user.name} may need immediate attention`)
//       // In production, you might want to send alerts to administrators
//     }

//     res.json({
//       response: response,
//       severity: severity,
//       sessionId: chatSession._id,
//       timestamp: new Date(),
//     })
//   } catch (error) {
//     console.error("AI Chat error:", error)
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get chat history with enhanced metadata
// router.get("/history", auth, async (req, res) => {
//   try {
//     const { limit = 10, page = 1 } = req.query

//     const chatSessions = await ChatSession.find({ userId: req.user._id })
//       .sort({ createdAt: -1 })
//       .limit(Number.parseInt(limit))
//       .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))

//     // Add session summaries
//     const sessionsWithSummary = chatSessions.map((session) => {
//       const crisisMessages = session.messages.filter((m) => m.severity === "CRISIS").length
//       const elevatedMessages = session.messages.filter((m) => m.severity === "ELEVATED").length

//       return {
//         ...session.toObject(),
//         summary: {
//           totalMessages: session.messages.length,
//           crisisMessages,
//           elevatedMessages,
//           lastActivity: session.messages[session.messages.length - 1]?.timestamp || session.createdAt,
//         },
//       }
//     })

//     res.json(sessionsWithSummary)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get AI chat analytics for user
// router.get("/analytics", auth, async (req, res) => {
//   try {
//     const sessions = await ChatSession.find({ userId: req.user._id })

//     let totalMessages = 0
//     let crisisCount = 0
//     let elevatedCount = 0
//     let normalCount = 0

//     sessions.forEach((session) => {
//       session.messages.forEach((message) => {
//         if (message.sender === "ai") {
//           totalMessages++
//           switch (message.severity) {
//             case "CRISIS":
//               crisisCount++
//               break
//             case "ELEVATED":
//               elevatedCount++
//               break
//             default:
//               normalCount++
//               break
//           }
//         }
//       })
//     })

//     res.json({
//       totalSessions: sessions.length,
//       totalMessages,
//       severityBreakdown: {
//         crisis: crisisCount,
//         elevated: elevatedCount,
//         normal: normalCount,
//       },
//       firstSession: sessions.length > 0 ? sessions[sessions.length - 1].createdAt : null,
//       lastSession: sessions.length > 0 ? sessions[0].createdAt : null,
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// module.exports = router

import express from "express"
import ChatSession from "../models/ChatSession.js"
import { auth } from "../middleware/auth.js"
import geminiService from "../services/geminiService.js"

const router = express.Router()

// Enhanced chat with AI using Gemini
router.post("/chat", auth, async (req, res) => {
  try {
    const { message } = req.body
    const userId = req.user._id

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" })
    }

    // Get or create chat session
    let chatSession = await ChatSession.findOne({ userId }).sort({ createdAt: -1 })

    if (!chatSession) {
      chatSession = new ChatSession({ userId, messages: [] })
    }

    // Add user message
    chatSession.messages.push({
      sender: "user",
      message: message.trim(),
    })

    // Get conversation context for better AI responses
    const recentMessages = chatSession.messages.slice(-5) // Last 5 messages for context
    const context = {
      recentMessages,
      userProfile: {
        name: req.user.name,
        isGuest: req.user.isGuest,
      },
    }

    // Get AI response using Gemini service
    const { response, severity } = await geminiService.generateResponse(message, context)

    // Add AI response
    chatSession.messages.push({
      sender: "ai",
      message: response,
      severity: severity,
    })

    await chatSession.save()

    // Log crisis situations for admin attention
    if (severity === "CRISIS") {
      console.log(`CRISIS ALERT: User ${userId} - ${req.user.name} may need immediate attention`)
      // In production, you might want to send alerts to administrators
    }

    res.json({
      response: response,
      severity: severity,
      sessionId: chatSession._id,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get chat history with enhanced metadata
router.get("/history", auth, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const chatSessions = await ChatSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))

    // Add session summaries
    const sessionsWithSummary = chatSessions.map((session) => {
      const crisisMessages = session.messages.filter((m) => m.severity === "CRISIS").length
      const elevatedMessages = session.messages.filter((m) => m.severity === "ELEVATED").length

      return {
        ...session.toObject(),
        summary: {
          totalMessages: session.messages.length,
          crisisMessages,
          elevatedMessages,
          lastActivity: session.messages[session.messages.length - 1]?.timestamp || session.createdAt,
        },
      }
    })

    res.json(sessionsWithSummary)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get AI chat analytics for user
router.get("/analytics", auth, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })

    let totalMessages = 0
    let crisisCount = 0
    let elevatedCount = 0
    let normalCount = 0

    sessions.forEach((session) => {
      session.messages.forEach((message) => {
        if (message.sender === "ai") {
          totalMessages++
          switch (message.severity) {
            case "CRISIS":
              crisisCount++
              break
            case "ELEVATED":
              elevatedCount++
              break
            default:
              normalCount++
              break
          }
        }
      })
    })

    res.json({
      totalSessions: sessions.length,
      totalMessages,
      severityBreakdown: {
        crisis: crisisCount,
        elevated: elevatedCount,
        normal: normalCount,
      },
      firstSession: sessions.length > 0 ? sessions[sessions.length - 1].createdAt : null,
      lastSession: sessions.length > 0 ? sessions[0].createdAt : null,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router



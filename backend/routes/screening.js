// const express = require("express")
// const Screening = require("../models/Screening")
// const { auth } = require("../middleware/auth")
// const screeningService = require("../services/screeningService")

// const router = express.Router()

// // Screening questions
// const screeningQuestions = {
//   "PHQ-9": [
//     {
//       question: "Little interest or pleasure in doing things",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
//     },
//     {
//       question: "Feeling down, depressed, or hopeless",
//       description: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
//     },
//     {
//       question: "Trouble falling or staying asleep, or sleeping too much",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
//     },
//     {
//       question: "Feeling tired or having little energy",
//       description: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
//     },
//     {
//       question: "Poor appetite or overeating",
//       description: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
//     },
//     {
//       question: "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
//     },
//     {
//       question: "Trouble concentrating on things, such as reading the newspaper or watching television",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
//     },
//     {
//       question:
//         "Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
//     },
//     {
//       question: "Thoughts that you would be better off dead, or of hurting yourself in some way",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?",
//     },
//   ],
//   "GAD-7": [
//     {
//       question: "Feeling nervous, anxious, or on edge",
//       description: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
//     },
//     {
//       question: "Not being able to stop or control worrying",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
//     },
//     {
//       question: "Worrying too much about different things",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
//     },
//     {
//       question: "Trouble relaxing",
//       description: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
//     },
//     {
//       question: "Being so restless that it is hard to sit still",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?",
//     },
//     {
//       question: "Becoming easily annoyed or irritable",
//       description: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
//     },
//     {
//       question: "Feeling afraid, as if something awful might happen",
//       description:
//         "Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?",
//     },
//   ],
//   "GHQ-12": [
//     {
//       question: "Been able to concentrate on whatever you're doing",
//       description: "Have you recently been able to concentrate on whatever you're doing?",
//     },
//     {
//       question: "Lost much sleep over worry",
//       description: "Have you recently lost much sleep over worry?",
//     },
//     {
//       question: "Felt that you were playing a useful part in things",
//       description: "Have you recently felt that you were playing a useful part in things?",
//     },
//     {
//       question: "Felt capable of making decisions about things",
//       description: "Have you recently felt capable of making decisions about things?",
//     },
//     {
//       question: "Felt constantly under strain",
//       description: "Have you recently felt constantly under strain?",
//     },
//     {
//       question: "Felt you couldn't overcome your difficulties",
//       description: "Have you recently felt you couldn't overcome your difficulties?",
//     },
//     {
//       question: "Been able to enjoy your normal day-to-day activities",
//       description: "Have you recently been able to enjoy your normal day-to-day activities?",
//     },
//     {
//       question: "Been able to face up to your problems",
//       description: "Have you recently been able to face up to your problems?",
//     },
//     {
//       question: "Been feeling unhappy or depressed",
//       description: "Have you recently been feeling unhappy or depressed?",
//     },
//     {
//       question: "Been losing confidence in yourself",
//       description: "Have you recently been losing confidence in yourself?",
//     },
//     {
//       question: "Been thinking of yourself as a worthless person",
//       description: "Have you recently been thinking of yourself as a worthless person?",
//     },
//     {
//       question: "Been feeling reasonably happy, all things considered",
//       description: "Have you recently been feeling reasonably happy, all things considered?",
//     },
//   ],
// }

// // Calculate severity based on test type and score
// const calculateSeverity = (testType, score) => {
//   switch (testType) {
//     case "PHQ-9":
//       if (score <= 4) return "NORMAL"
//       if (score <= 9) return "MILD"
//       if (score <= 14) return "MODERATE"
//       if (score <= 19) return "SEVERE"
//       return "CRISIS"
//     case "GAD-7":
//       if (score <= 4) return "NORMAL"
//       if (score <= 9) return "MILD"
//       if (score <= 14) return "MODERATE"
//       return "SEVERE"
//     case "GHQ-12":
//       if (score <= 2) return "NORMAL"
//       if (score <= 5) return "MILD"
//       if (score <= 8) return "MODERATE"
//       return "SEVERE"
//     default:
//       return "NORMAL"
//   }
// }

// // Get screening questions
// router.get("/questions/:testType", auth, (req, res) => {
//   const { testType } = req.params

//   if (!screeningQuestions[testType]) {
//     return res.status(400).json({ message: "Invalid test type" })
//   }

//   const responseOptions =
//     testType === "GHQ-12"
//       ? [
//           { label: "Better than usual", value: 0 },
//           { label: "Same as usual", value: 1 },
//           { label: "Less than usual", value: 2 },
//           { label: "Much less than usual", value: 3 },
//         ]
//       : [
//           { label: "Not at all", value: 0 },
//           { label: "Several days", value: 1 },
//           { label: "More than half the days", value: 2 },
//           { label: "Nearly every day", value: 3 },
//         ]

//   res.json({
//     testType,
//     questions: screeningQuestions[testType],
//     responseOptions,
//     instructions: getTestInstructions(testType),
//   })
// })

// // Submit screening
// router.post("/submit", auth, async (req, res) => {
//   try {
//     const { testType, responses } = req.body
//     const userId = req.user._id

//     if (!screeningQuestions[testType]) {
//       return res.status(400).json({ message: "Invalid test type" })
//     }

//     if (!responses || responses.length !== screeningQuestions[testType].length) {
//       return res.status(400).json({ message: "Invalid responses" })
//     }

//     // Get user's screening history for insights
//     const userHistory = await Screening.find({ userId, testType })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select("totalScore severity createdAt")

//     // Score the screening using enhanced service
//     const scoringResult = screeningService.scoreScreening(testType, responses)
//     const insights = screeningService.generateInsights(
//       testType,
//       scoringResult.totalScore,
//       scoringResult.severity,
//       userHistory,
//     )

//     // Save screening result
//     const screening = new Screening({
//       userId,
//       testType,
//       responses,
//       totalScore: scoringResult.totalScore,
//       severity: scoringResult.severity,
//     })

//     await screening.save()

//     // Log crisis situations
//     if (scoringResult.severity === "CRISIS") {
//       console.log(
//         `CRISIS SCREENING ALERT: User ${userId} - ${req.user.name} scored ${scoringResult.totalScore} on ${testType}`,
//       )
//     }

//     res.json({
//       screeningId: screening._id,
//       testType,
//       totalScore: scoringResult.totalScore,
//       severity: scoringResult.severity,
//       interpretation: scoringResult.interpretation,
//       recommendations: scoringResult.recommendations,
//       insights,
//       suicideRisk: scoringResult.suicideRisk || false,
//       timestamp: screening.createdAt,
//     })
//   } catch (error) {
//     console.error("Screening submission error:", error)
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get user's screening history
// router.get("/history", auth, async (req, res) => {
//   try {
//     const { testType, limit = 10 } = req.query

//     const query = { userId: req.user._id }
//     if (testType) query.testType = testType

//     const screenings = await Screening.find(query)
//       .sort({ createdAt: -1 })
//       .limit(Number.parseInt(limit))
//       .select("-responses") // Exclude detailed responses for privacy

//     // Calculate trends
//     const trends = calculateTrends(screenings)

//     res.json({
//       screenings,
//       trends,
//       summary: {
//         totalScreenings: screenings.length,
//         latestSeverity: screenings[0]?.severity || null,
//         averageScore:
//           screenings.length > 0
//             ? Math.round(screenings.reduce((sum, s) => sum + s.totalScore, 0) / screenings.length)
//             : 0,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Helper functions
// function getTestInstructions(testType) {
//   const instructions = {
//     "PHQ-9":
//       "Over the last 2 weeks, how often have you been bothered by any of the following problems? Please select the most accurate response for each question.",
//     "GAD-7":
//       "Over the last 2 weeks, how often have you been bothered by the following problems? Please select the most accurate response for each question.",
//     "GHQ-12":
//       "Please read each item below and select the response that best describes how you have been feeling recently. Compare your recent experience with your usual state.",
//   }
//   return instructions[testType] || ""
// }

// function calculateTrends(screenings) {
//   if (screenings.length < 2) return null

//   const recent = screenings.slice(0, 3)
//   const older = screenings.slice(3, 6)

//   if (older.length === 0) return null

//   const recentAvg = recent.reduce((sum, s) => sum + s.totalScore, 0) / recent.length
//   const olderAvg = older.reduce((sum, s) => sum + s.totalScore, 0) / older.length

//   const change = recentAvg - olderAvg
//   const percentChange = Math.round((change / olderAvg) * 100)

//   return {
//     direction: change > 1 ? "increasing" : change < -1 ? "decreasing" : "stable",
//     change: Math.round(change * 10) / 10,
//     percentChange,
//     interpretation:
//       change > 1
//         ? "Symptoms have increased recently"
//         : change < -1
//           ? "Symptoms have decreased recently"
//           : "Symptoms remain relatively stable",
//   }
// }

// module.exports = router



import express from "express"
import Screening from "../models/Screening.js"
import { auth } from "../middleware/auth.js"
import screeningService from "../services/screeningService.js"

const router = express.Router()

// Screening questions
const screeningQuestions = {
  "PHQ-9": [
    {
      question: "Little interest or pleasure in doing things",
      description:
        "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
    },
    {
      question: "Feeling down, depressed, or hopeless",
      description: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    },
    {
      question: "Trouble falling or staying asleep, or sleeping too much",
      description:
        "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
    },
    {
      question: "Feeling tired or having little energy",
      description: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
    },
    {
      question: "Poor appetite or overeating",
      description: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
    },
    {
      question: "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
      description:
        "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
    },
    {
      question: "Trouble concentrating on things, such as reading the newspaper or watching television",
      description:
        "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
    },
    {
      question:
        "Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
      description:
        "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
    },
    {
      question: "Thoughts that you would be better off dead, or of hurting yourself in some way",
      description:
        "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?",
    },
  ],
  "GAD-7": [
    {
      question: "Feeling nervous, anxious, or on edge",
      description: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    },
    {
      question: "Not being able to stop or control worrying",
      description:
        "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    },
    {
      question: "Worrying too much about different things",
      description:
        "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
    },
    {
      question: "Trouble relaxing",
      description: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
    },
    {
      question: "Being so restless that it is hard to sit still",
      description:
        "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?",
    },
    {
      question: "Becoming easily annoyed or irritable",
      description: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
    },
    {
      question: "Feeling afraid, as if something awful might happen",
      description:
        "Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?",
    },
  ],
  "GHQ-12": [
    {
      question: "Been able to concentrate on whatever you're doing",
      description: "Have you recently been able to concentrate on whatever you're doing?",
    },
    {
      question: "Lost much sleep over worry",
      description: "Have you recently lost much sleep over worry?",
    },
    {
      question: "Felt that you were playing a useful part in things",
      description: "Have you recently felt that you were playing a useful part in things?",
    },
    {
      question: "Felt capable of making decisions about things",
      description: "Have you recently felt capable of making decisions about things?",
    },
    {
      question: "Felt constantly under strain",
      description: "Have you recently felt constantly under strain?",
    },
    {
      question: "Felt you couldn't overcome your difficulties",
      description: "Have you recently felt you couldn't overcome your difficulties?",
    },
    {
      question: "Been able to enjoy your normal day-to-day activities",
      description: "Have you recently been able to enjoy your normal day-to-day activities?",
    },
    {
      question: "Been able to face up to your problems",
      description: "Have you recently been able to face up to your problems?",
    },
    {
      question: "Been feeling unhappy or depressed",
      description: "Have you recently been feeling unhappy or depressed?",
    },
    {
      question: "Been losing confidence in yourself",
      description: "Have you recently been losing confidence in yourself?",
    },
    {
      question: "Been thinking of yourself as a worthless person",
      description: "Have you recently been thinking of yourself as a worthless person?",
    },
    {
      question: "Been feeling reasonably happy, all things considered",
      description: "Have you recently been feeling reasonably happy, all things considered?",
    },
  ],
}

// Get screening questions
router.get("/questions/:testType", auth, (req, res) => {
  const { testType } = req.params

  if (!screeningQuestions[testType]) {
    return res.status(400).json({ message: "Invalid test type" })
  }

  const responseOptions =
    testType === "GHQ-12"
      ? [
          { label: "Better than usual", value: 0 },
          { label: "Same as usual", value: 1 },
          { label: "Less than usual", value: 2 },
          { label: "Much less than usual", value: 3 },
        ]
      : [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ]

  res.json({
    testType,
    questions: screeningQuestions[testType],
    responseOptions,
    instructions: getTestInstructions(testType),
  })
})

// Submit screening
router.post("/submit", auth, async (req, res) => {
  try {
    const { testType, responses } = req.body
    const userId = req.user._id

    if (!screeningQuestions[testType]) {
      return res.status(400).json({ message: "Invalid test type" })
    }

    if (!responses || responses.length !== screeningQuestions[testType].length) {
      return res.status(400).json({ message: "Invalid responses" })
    }

    const userHistory = await Screening.find({ userId, testType })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("totalScore severity createdAt")

    const scoringResult = screeningService.scoreScreening(testType, responses)
    const insights = screeningService.generateInsights(
      testType,
      scoringResult.totalScore,
      scoringResult.severity,
      userHistory,
    )

    const screening = new Screening({
      userId,
      testType,
      responses,
      totalScore: scoringResult.totalScore,
      severity: scoringResult.severity,
    })

    await screening.save()

    if (scoringResult.severity === "CRISIS") {
      console.log(
        `CRISIS SCREENING ALERT: User ${userId} - ${req.user.name} scored ${scoringResult.totalScore} on ${testType}`,
      )
    }

    res.json({
      screeningId: screening._id,
      testType,
      totalScore: scoringResult.totalScore,
      severity: scoringResult.severity,
      interpretation: scoringResult.interpretation,
      recommendations: scoringResult.recommendations,
      insights,
      suicideRisk: scoringResult.suicideRisk || false,
      timestamp: screening.createdAt,
    })
  } catch (error) {
    console.error("Screening submission error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user's screening history
router.get("/history", auth, async (req, res) => {
  try {
    const { testType, limit = 10 } = req.query

    const query = { userId: req.user._id }
    if (testType) query.testType = testType

    const screenings = await Screening.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))
      .select("-responses")

    const trends = calculateTrends(screenings)

    res.json({
      screenings,
      trends,
      summary: {
        totalScreenings: screenings.length,
        latestSeverity: screenings[0]?.severity || null,
        averageScore:
          screenings.length > 0
            ? Math.round(screenings.reduce((sum, s) => sum + s.totalScore, 0) / screenings.length)
            : 0,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Helper functions
function getTestInstructions(testType) {
  const instructions = {
    "PHQ-9":
      "Over the last 2 weeks, how often have you been bothered by any of the following problems? Please select the most accurate response for each question.",
    "GAD-7":
      "Over the last 2 weeks, how often have you been bothered by the following problems? Please select the most accurate response for each question.",
    "GHQ-12":
      "Please read each item below and select the response that best describes how you have been feeling recently. Compare your recent experience with your usual state.",
  }
  return instructions[testType] || ""
}

function calculateTrends(screenings) {
  if (screenings.length < 2) return null

  const recent = screenings.slice(0, 3)
  const older = screenings.slice(3, 6)

  if (older.length === 0) return null

  const recentAvg = recent.reduce((sum, s) => sum + s.totalScore, 0) / recent.length
  const olderAvg = older.reduce((sum, s) => sum + s.totalScore, 0) / older.length

  const change = recentAvg - olderAvg
  const percentChange = Math.round((change / olderAvg) * 100)

  return {
    direction: change > 1 ? "increasing" : change < -1 ? "decreasing" : "stable",
    change: Math.round(change * 10) / 10,
    percentChange,
    interpretation:
      change > 1
        ? "Symptoms have increased recently"
        : change < -1
          ? "Symptoms have decreased recently"
          : "Symptoms remain relatively stable",
  }
}

export default router

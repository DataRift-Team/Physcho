// const express = require("express")
// const { auth } = require("../middleware/auth")

// const router = express.Router()

// // Mock resources data
// const resources = [
//   {
//     id: 1,
//     title: "Deep Breathing Exercise",
//     type: "audio",
//     category: "relaxation",
//     language: "en",
//     url: "/audio/deep-breathing.mp3",
//     duration: "10 minutes",
//     description: "A guided deep breathing exercise to help reduce stress and anxiety.",
//   },
//   {
//     id: 2,
//     title: "Mindfulness Meditation Guide",
//     type: "pdf",
//     category: "mindfulness",
//     language: "en",
//     url: "/pdf/mindfulness-guide.pdf",
//     description: "A comprehensive guide to mindfulness meditation practices.",
//   },
//   {
//     id: 3,
//     title: "Coping with Anxiety",
//     type: "video",
//     category: "anxiety",
//     language: "en",
//     url: "/video/anxiety-coping.mp4",
//     duration: "15 minutes",
//     description: "Learn practical strategies for managing anxiety in daily life.",
//   },
//   {
//     id: 4,
//     title: "Sleep Hygiene Tips",
//     type: "article",
//     category: "sleep",
//     language: "en",
//     url: "/articles/sleep-hygiene",
//     description: "Essential tips for improving your sleep quality and establishing healthy sleep habits.",
//   },
//   {
//     id: 5,
//     title: "Progressive Muscle Relaxation",
//     type: "audio",
//     category: "relaxation",
//     language: "en",
//     url: "/audio/muscle-relaxation.mp3",
//     duration: "20 minutes",
//     description: "A guided progressive muscle relaxation session.",
//   },
//   {
//     id: 6,
//     title: "Understanding Depression",
//     type: "video",
//     category: "depression",
//     language: "en",
//     url: "/video/understanding-depression.mp4",
//     duration: "12 minutes",
//     description: "Educational video about depression symptoms and treatment options.",
//   },
// ]

// // Get all resources
// router.get("/", auth, (req, res) => {
//   const { category, language, type } = req.query

//   let filteredResources = resources

//   if (category) {
//     filteredResources = filteredResources.filter((r) => r.category === category)
//   }

//   if (language) {
//     filteredResources = filteredResources.filter((r) => r.language === language)
//   }

//   if (type) {
//     filteredResources = filteredResources.filter((r) => r.type === type)
//   }

//   res.json(filteredResources)
// })

// // Get resource categories
// router.get("/categories", auth, (req, res) => {
//   const categories = [...new Set(resources.map((r) => r.category))]
//   res.json(categories)
// })

// // Get resource types
// router.get("/types", auth, (req, res) => {
//   const types = [...new Set(resources.map((r) => r.type))]
//   res.json(types)
// })

// module.exports = router


import express from "express"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Mock resources data
const resources = [
  {
    id: 1,
    title: "Deep Breathing Exercise",
    type: "audio",
    category: "relaxation",
    language: "en",
    url: "/audio/deep-breathing.mp3",
    duration: "10 minutes",
    description: "A guided deep breathing exercise to help reduce stress and anxiety.",
  },
  {
    id: 2,
    title: "Mindfulness Meditation Guide",
    type: "pdf",
    category: "mindfulness",
    language: "en",
    url: "/pdf/mindfulness-guide.pdf",
    description: "A comprehensive guide to mindfulness meditation practices.",
  },
  {
    id: 3,
    title: "Coping with Anxiety",
    type: "video",
    category: "anxiety",
    language: "en",
    url: "/video/anxiety-coping.mp4",
    duration: "15 minutes",
    description: "Learn practical strategies for managing anxiety in daily life.",
  },
  {
    id: 4,
    title: "Sleep Hygiene Tips",
    type: "article",
    category: "sleep",
    language: "en",
    url: "/articles/sleep-hygiene",
    description: "Essential tips for improving your sleep quality and establishing healthy sleep habits.",
  },
  {
    id: 5,
    title: "Progressive Muscle Relaxation",
    type: "audio",
    category: "relaxation",
    language: "en",
    url: "/audio/muscle-relaxation.mp3",
    duration: "20 minutes",
    description: "A guided progressive muscle relaxation session.",
  },
  {
    id: 6,
    title: "Understanding Depression",
    type: "video",
    category: "depression",
    language: "en",
    url: "/video/understanding-depression.mp4",
    duration: "12 minutes",
    description: "Educational video about depression symptoms and treatment options.",
  },
]

// Get all resources
router.get("/", auth, (req, res) => {
  const { category, language, type } = req.query

  let filteredResources = resources

  if (category) {
    filteredResources = filteredResources.filter((r) => r.category === category)
  }

  if (language) {
    filteredResources = filteredResources.filter((r) => r.language === language)
  }

  if (type) {
    filteredResources = filteredResources.filter((r) => r.type === type)
  }

  res.json(filteredResources)
})

// Get resource categories
router.get("/categories", auth, (req, res) => {
  const categories = [...new Set(resources.map((r) => r.category))]
  res.json(categories)
})

// Get resource types
router.get("/types", auth, (req, res) => {
  const types = [...new Set(resources.map((r) => r.type))]
  res.json(types)
})

export default router


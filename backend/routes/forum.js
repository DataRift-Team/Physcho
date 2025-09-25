// const express = require("express")
// const ForumPost = require("../models/ForumPost")
// const { auth } = require("../middleware/auth")

// const router = express.Router()

// // Create new post
// router.post("/posts", auth, async (req, res) => {
//   try {
//     const { title, content, isAnonymous = true } = req.body
//     const userId = req.user._id

//     const post = new ForumPost({
//       userId,
//       title,
//       content,
//       isAnonymous,
//     })

//     await post.save()

//     res.status(201).json({
//       postId: post._id,
//       message: "Post created and pending approval",
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get approved posts
// router.get("/posts", auth, async (req, res) => {
//   try {
//     const posts = await ForumPost.find({ status: "approved" })
//       .populate("userId", "name")
//       .populate("replies.userId", "name")
//       .sort({ createdAt: -1 })

//     // Filter out user info if anonymous
//     const filteredPosts = posts.map((post) => ({
//       ...post.toObject(),
//       userId: post.isAnonymous ? null : post.userId,
//       replies: post.replies.map((reply) => ({
//         ...reply,
//         userId: reply.isAnonymous ? null : reply.userId,
//       })),
//     }))

//     res.json(filteredPosts)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Add reply to post
// router.post("/posts/:postId/reply", auth, async (req, res) => {
//   try {
//     const { postId } = req.params
//     const { content, isAnonymous = true } = req.body
//     const userId = req.user._id

//     const post = await ForumPost.findById(postId)
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" })
//     }

//     post.replies.push({
//       userId,
//       content,
//       isAnonymous,
//     })

//     await post.save()

//     res.json({ message: "Reply added successfully" })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Get pending posts (admin)
// router.get("/pending", auth, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access required" })
//     }

//     const posts = await ForumPost.find({ status: "pending" }).populate("userId", "name email").sort({ createdAt: -1 })

//     res.json(posts)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// // Approve/reject post (admin)
// router.patch("/posts/:postId/status", auth, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access required" })
//     }

//     const { postId } = req.params
//     const { status } = req.body

//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" })
//     }

//     await ForumPost.findByIdAndUpdate(postId, { status })

//     res.json({ message: `Post ${status} successfully` })
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// })

// module.exports = router


import express from "express"
import ForumPost from "../models/ForumPost.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Create new post
router.post("/posts", auth, async (req, res) => {
  try {
    const { title, content, isAnonymous = true } = req.body
    const userId = req.user._id

    const post = new ForumPost({
      userId,
      title,
      content,
      isAnonymous,
    })

    await post.save()

    res.status(201).json({
      postId: post._id,
      message: "Post created and pending approval",
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get approved posts
router.get("/posts", auth, async (req, res) => {
  try {
    const posts = await ForumPost.find({ status: "approved" })
      .populate("userId", "name")
      .populate("replies.userId", "name")
      .sort({ createdAt: -1 })

    // Filter out user info if anonymous
    const filteredPosts = posts.map((post) => ({
      ...post.toObject(),
      userId: post.isAnonymous ? null : post.userId,
      replies: post.replies.map((reply) => ({
        ...reply,
        userId: reply.isAnonymous ? null : reply.userId,
      })),
    }))

    res.json(filteredPosts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add reply to post
router.post("/posts/:postId/reply", auth, async (req, res) => {
  try {
    const { postId } = req.params
    const { content, isAnonymous = true } = req.body
    const userId = req.user._id

    const post = await ForumPost.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.replies.push({
      userId,
      content,
      isAnonymous,
    })

    await post.save()

    res.json({ message: "Reply added successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get pending posts (admin)
router.get("/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const posts = await ForumPost.find({ status: "pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Approve/reject post (admin)
router.patch("/posts/:postId/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const { postId } = req.params
    const { status } = req.body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    await ForumPost.findByIdAndUpdate(postId, { status })

    res.json({ message: `Post ${status} successfully` })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router


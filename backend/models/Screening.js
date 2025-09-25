// const mongoose = require("mongoose")

// const screeningSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   testType: {
//     type: String,
//     enum: ["PHQ-9", "GAD-7", "GHQ-12"],
//     required: true,
//   },
//   responses: [
//     {
//       question: String,
//       answer: Number,
//     },
//   ],
//   totalScore: {
//     type: Number,
//     required: true,
//   },
//   severity: {
//     type: String,
//     enum: ["NORMAL", "MILD", "MODERATE", "SEVERE", "CRISIS"],
//     required: true,
//   },
//   interpretation: {
//     type: String,
//   },
//   recommendations: [String],
//   suicideRisk: {
//     type: Boolean,
//     default: false,
//   },
//   followUpRequired: {
//     type: Boolean,
//     default: false,
//   },
//   adminNotified: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// // Index for efficient queries
// screeningSchema.index({ userId: 1, createdAt: -1 })
// screeningSchema.index({ severity: 1, createdAt: -1 })
// screeningSchema.index({ testType: 1, createdAt: -1 })

// module.exports = mongoose.model("Screening", screeningSchema)

import mongoose from "mongoose"

const screeningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testType: {
    type: String,
    enum: ["PHQ-9", "GAD-7", "GHQ-12"],
    required: true,
  },
  responses: [
    {
      question: String,
      answer: Number,
    },
  ],
  totalScore: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    enum: ["NORMAL", "MILD", "MODERATE", "SEVERE", "CRISIS"],
    required: true,
  },
  interpretation: {
    type: String,
  },
  recommendations: [String],
  suicideRisk: {
    type: Boolean,
    default: false,
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  adminNotified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for efficient queries
screeningSchema.index({ userId: 1, createdAt: -1 })
screeningSchema.index({ severity: 1, createdAt: -1 })
screeningSchema.index({ testType: 1, createdAt: -1 })

const Screening = mongoose.model("Screening", screeningSchema)

export default Screening


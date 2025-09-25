// const mongoose = require("mongoose")

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: function () {
//       return !this.googleId && !this.isGuest
//     },
//   },
//   googleId: {
//     type: String,
//     sparse: true,
//   },
//   isGuest: {
//     type: Boolean,
//     default: false,
//   },
//   preferredLanguage: {
//     type: String,
//     default: "en",
//   },
//   role: {
//     type: String,
//     enum: ["student", "admin"],
//     default: "student",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// module.exports = mongoose.model("User", userSchema)


import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.isGuest
    },
  },
  googleId: {
    type: String,
    sparse: true,
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  preferredLanguage: {
    type: String,
    default: "en",
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("User", userSchema)

export default User


// controllers/counsellorController.js
import Counsellor from '../models/counsellor.js'

// Add a new counsellor
export const addCounsellor = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, image, optional } = req.body
    const existing = await Counsellor.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Counsellor already exists' })
    }
    const counsellor = new Counsellor({
      name,
      email,
      phone,
      specialization,
      experience,
      image,
      optional,
    })
    await counsellor.save()
    res.status(201).json({ message: 'Counsellor added', counsellor })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all counsellors
export const getCounsellors = async (req, res) => {
  try {
    const counsellors = await Counsellor.find()
    res.json(counsellors)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// Get a counsellor by ID
export const getCounsellorById = async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id)
    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' })
    }
    res.json(counsellor)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update a counsellor by ID
export const updateCounsellor = async (req, res) => {
  try {
    const updated = await Counsellor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updated) {
      return res.status(404).json({ message: 'Counsellor not found' })
    }
    res.json({ message: 'Counsellor updated', counsellor: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete a counsellor by ID
export const deleteCounsellor = async (req, res) => {
  try {
    const deleted = await Counsellor.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Counsellor not found' })
    }
    res.json({ message: 'Counsellor deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

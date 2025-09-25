import express from 'express'
import {
  addCounsellor,
  getCounsellors,
  getCounsellorById,
  updateCounsellor,
  deleteCounsellor
} from '../controllers/counsellorController.js'

const router = express.Router()

// Add a new counsellor
router.post('/', addCounsellor)

// Get all counsellors
router.get('/', getCounsellors)

// Get a counsellor by ID
router.get('/:id', getCounsellorById)

// Update a counsellor by ID
router.put('/:id', updateCounsellor)

// Delete a counsellor by ID
router.delete('/:id', deleteCounsellor)

export default router

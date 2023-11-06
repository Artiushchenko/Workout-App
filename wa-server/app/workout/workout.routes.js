import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { createNewWorkout, deleteWorkout, getWorkouts, getWorkout, updateWorkout } from './workout.controller.js'
import { createNewWorkoutLog } from './log/workout-log.controller.js'
import { updateCompleteWorkoutLog } from './log/update-workout-log.controller.js'
import { getWorkoutLog } from './log/get-workout-log.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewWorkout).get(protect, getWorkouts)

router.route('/:id').get(protect, getWorkout).put(protect, updateWorkout).delete(protect, deleteWorkout)

router.route('/log/:id').post(protect, createNewWorkoutLog).get(protect, getWorkoutLog)

router.route('/log/complete/:id').patch(protect, updateCompleteWorkoutLog)

export default router
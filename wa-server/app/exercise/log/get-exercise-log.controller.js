import asyncHandler from 'express-async-handler'
import { prisma } from '../../prisma.js'
import { addPrevValues } from './add-prev-value.util.js'

// @desk      Get exerciseLog
// @route     GET /api/exercises/log/:id
// @access    Private

export const getExerciseLog = asyncHandler(async (request, response) => {
    const exerciseLog = await prisma.exerciseLog.findUnique({
        where: {
            id: +request.params.id
        },
        include: {
            exercise: true,
            times: {
                orderBy: {
                    id: 'asc'
                }
            }
        }
    })

    if(!exerciseLog) {
        response.status(404)
        throw new Error('Exercise Log not found!')
    }

    const prevExerciseLog = await prisma.exerciseLog.findFirst({
        where: {
            exerciseId: exerciseLog.exerciseId,
            userId: request.user.id,
            isCompleted: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            times: true
        }
    })

    response.json({ ...exerciseLog, times: addPrevValues(exerciseLog, prevExerciseLog) })
})

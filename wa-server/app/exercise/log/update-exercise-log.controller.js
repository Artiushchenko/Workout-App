import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

// @desk    Update exercise log time
// @route   PUT /api/exercises/log/time/:id
// @access  Private

export const updateExerciseLogTime = asyncHandler(async (request, response) => {
    const { weight, repeat, isCompleted } = request.body

    try {
        const exerciseLogTime = await prisma.exerciseTime.update({
            where: {
                id: +request.params.id
            },
            data: {
                weight, repeat, isCompleted
            }
        })

        response.json(exerciseLogTime)
    } catch (error) {
        response.status(404)
        throw new Error('Exercise log time is not found!')
    }
})

// @desk    Update status of complete exercise log
// @route   PATCH /api/exercises/log/complete/:id
// @access  Private

export const completeExerciseLog = asyncHandler(async (request, response) => {
    const { isCompleted } = request.body 
    
    try {
        const exerciseLog = await prisma.exerciseLog.update({
            where: {
                id: +request.params.id
            },
            data: {
                isCompleted
            },
            include: {
                exercise: true,
                workoutLog: true
            }
        })

        response.json(exerciseLog)
    } catch (error) {
        response.status(404)
        throw new Error('Exercise log not found!')
    }
})
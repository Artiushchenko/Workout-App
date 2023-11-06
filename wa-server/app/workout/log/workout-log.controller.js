import asyncHandler from 'express-async-handler'
import { prisma } from '../../prisma.js'

// @desk      Create new workout log
// @route     POST /api/workouts/log/:id
// @access    Private

export const createNewWorkoutLog = asyncHandler(async (request, response) => {
    const workoutId = +request.params.id

    const workout = await prisma.workout.findUnique({
        where: {
            id: workoutId
        },
        include: {
            exercises: true
        }
    })

    if(!workout) {
        response.status(404)
        throw new Error('Workout not found!')
    }

    const workoutLog = await prisma.workoutLog.create({
        data: {
            user: {
                connect: {
                    id: request.user.id
                }
            },
            workout: {
                connect: {
                    id: workoutId
                }
            },
            exerciseLogs: {
                create: workout.exercises.map(exercise => ({
                    user: {
                        connect: {
                            id: request.user.id
                        }
                    },
                    exercise: {
                        connect: {
                            id: exercise.id
                        }
                    },
                    times: {
                        create: Array.from({ length: exercise.times }, () => ({
                        weight: 0,
                        repeat: 0
                    }))
                    }
                }))                
            }
        },
        include: {
            exerciseLogs: {
                include: {
                    times: true
                }
            }
        }
    })

    response.json(workoutLog)
})
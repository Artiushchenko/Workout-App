// @desk      Create new exerciseLog
// @route     POST /api/exercises/log/:exerciseId
// @access    Private

import asyncHandler from 'express-async-handler'
import { prisma } from '../../prisma.js'

export const createNewExerciseLog = asyncHandler(async (request, response) => {
    const exerciseId = +request.params.id

    const exercise = await prisma.exercise.findUnique({
        where: {
            id: exerciseId
        }
    })

    if(!exercise) {
        response.status(404)
        throw new Error('Exercise not found!')
    }

    let timesDefault = []

    for(let i = 0; i < exercise.times; i++) {
        timesDefault.push({
            weight: 0,
            repeat: 0
        })
    }

    const exerciseLog = await prisma.exerciseLog.create({
        data: {
            user: {
                connect: {
                    id: request.user.id
                }
            },
            exercise: {
                connect: {
                    id: exerciseId
                }
            },
            times: {
                createMany: {
                    data: timesDefault
                }
            }
        },
        include: {
            times: true
        }
    })

    response.json(exerciseLog)
})
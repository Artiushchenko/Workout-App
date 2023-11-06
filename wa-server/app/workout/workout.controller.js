import asyncHandler from 'express-async-handler'
import { prisma } from "../prisma.js"
import { calculateMinute } from './calculate-minute.js'

// @desc     Create new workout
// @route    POST /api/workouts
// @access   Private

export const createNewWorkout = asyncHandler(async (request, response) => {
    const { name, exerciseIds } = request.body

    const workout = await prisma.workout.create({
        data: {
            name, exercises: {
                connect: exerciseIds.map(id => ({ id: +id }))
            }
        }
    })

    response.json(workout)
})

// @desc     Get workouts
// @route    POST /api/workouts
// @access   Private

export const getWorkouts = asyncHandler(async (request, response) => {
    const workouts = await prisma.workout.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            exercises: true
        }
    })

    response.json(workouts)
})

// @desc     Get workout
// @route    GET /api/workouts/:id
// @access   Private

export const getWorkout = asyncHandler(async (request, response) => {
    const workout = await prisma.workout.findUnique({
        where: { id: +request.params.id },
        include: {
            exercises: true
        }
    })

    if(!workout) {
        response.status(404)
        throw new Error('Workout not found!')
    }

    const minutes = calculateMinute(workout.exercises.length)

    response.json({ ...workout, minutes })
})

// @desc     Update workout
// @route    PUT /api/workouts/:id
// @access   Private

export const updateWorkout = asyncHandler(async (request, response) => {
    const { name, exerciseIds } = request.body

    try {
        const workout = await prisma.workout.update({
            where: {
                id: +request.params.id
            },
            data: {
                name, exercises: {
                    set: exerciseIds.map(id => ({ id: +id }))
                }
            }
        })

        response.json(workout)
    } catch (error) {
        response.status(404)
        throw new Error('Workout not found!')
    }

})

// @desc     Delete workout
// @route    DELETE /api/workouts/:id
// @access   Private

export const deleteWorkout = asyncHandler(async (request, response) => {
    
    try {
        const workout = await prisma.workout.delete({
            where: {
                id: +request.params.id
            }
        })

        response.json({ message: 'Workout deleted!' })
    } catch (error) {
        response.status(404)
        throw new Error('Workout not found!')
    }

})


import { prisma } from '../prisma.js'
import asyncHandler from 'express-async-handler'

import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import { generateToken } from './generate-token.js'
import { UserFields } from '../utils/user.utils.js'

// @desc    Auth user
// @route   POST /api/auth/login
// @access  Public

export const authUser = asyncHandler( async ( request, response ) => {
  const { email, password } = request.body
  
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  const isValidPassword = await verify(user.password, password)

  if(user && isValidPassword) {
    const token = generateToken(user.id)
    response.json({ user, token })
  } else {
    response.status(401)
    throw new Error('Email and password are not correct')
  }

  response.json(user)
})

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

export const registerUser = asyncHandler( async ( request, response ) => {
  const { email, password } = request.body

  const isHaveUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(isHaveUser) {
    response.status(400)
    throw new Error('User already exist')
  }

  const user = await prisma.user.create({
    data: {
      email, 
      password: await hash(password), 
      name: faker.name.fullName()
    },
    select: UserFields
  })

  const token = generateToken(user.id)
  
  response.json({ user, token })
})
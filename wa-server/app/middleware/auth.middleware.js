import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.utils.js'

export const protect = asyncHandler(async ( request, response, next ) => {
    let token

    if(request.headers.authorization?.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const userFound = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: UserFields
        })

        if(userFound) {
            request.user = userFound
            next()
        } else {
            response.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token) {
        response.status(401)
        throw new Error('Not authorized, I do not have a token')
    }
})
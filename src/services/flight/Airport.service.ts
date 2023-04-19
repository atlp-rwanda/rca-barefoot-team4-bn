import { Airport, PrismaClient } from "@prisma/client"
import { ApiError } from "../../utils/ApiError"
import { getStatusCode } from "../../utils/errors"
import { getMessage } from "../../utils/errors"

const prisma = new PrismaClient()

export class AiportService {
  async create(body: Airport) {
    try {
      const data = await prisma.airport.create({
        data: body
      })

      return {
        statusCode: 201,
        message: "Airport created successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getAll() {
    try {
      const data = await prisma.airport.findMany()

      return {
        statusCode: 200,
        message: "Airports retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }
  async getOne(id: string) {
    try {
      const data = await prisma.airport.findUnique({
        where: {
          id: id
        }
      })

      return {
        statusCode: 200,
        message: "Airport retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }
  async update(id: string, body: Airport) {
    try {
      const data = await prisma.airport.update({
        where: {
          id: id
        },
        data: body
      })

      return {
        statusCode: 200,
        message: "Airport updated successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }
}

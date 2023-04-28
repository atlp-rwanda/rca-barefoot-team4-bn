import { Request, Response } from "express"
import { AiportService } from "../../services/flight/Airport.service"
import { getStatusCode } from "../../utils/errors"
import { getMessage } from "../../utils/errors"
const airportService = new AiportService()

export class AirportController {
  async createAirport(req: Request, res: Response) {
    try {
      const reply = await airportService.create(req.body)
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }
  }

  async getAllAirports(req: Request, res: Response) {
    try {
      const reply = await airportService.getAll()
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }
  }

  async getOneAirport(req: Request, res: Response) {
    try {
      const reply = await airportService.getOne(req.params.id)
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }
  }

  async updateAirport(req: Request, res: Response) {
    try {
      const reply = await airportService.update(req.params.id, req.body)
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }
  }
}

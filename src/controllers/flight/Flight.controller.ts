import { Request, Response } from "express"
import { getStatusCode } from "../../utils/errors"
import { getMessage } from "../../utils/errors"
import { FlightService } from "../../services/flight/Flight.service"
const flightService = new FlightService()

export class FlightController {
  async createFlight(req: Request, res: Response) {
    try {
      const reply = await flightService.create(req.body)
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

  async createdUnifiedFlight(req: Request, res: Response) {
    try {
      const reply = await flightService.createdUnified(req.body)
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



  // flight classes to the flight, price and corresponding seats
  async mapFlightClassAndPrice(req: Request, res: Response) {
    try {
      const reply = await flightService.mapFlight(req.body)
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

  async bookFlight(req: Request, res: Response) {
    try {
      const reply = await flightService.book(req.body)
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
  // other crud operations

  async getAllFlights(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string)|| 10
      const reply = await flightService.getAll(page, limit)
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data,
        hasNextPage: reply.hasNextPage,
        hasPrevPage: reply.hasPevPage,
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }
  }

  // filters

  async getAllByAirports(req: Request, res: Response) {
    try {
      const departure_airport = req.params.from as string
      const arrival_airport = req.params.to as string
      const reply = await flightService.getAllByAirports(departure_airport, arrival_airport)
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


  async getAllByTime(req: Request, res: Response) {
    try {

      const departureTime = req.body.departure_time as Date
      const arrivalTime = req.body.arrival_time as Date
      const reply = await flightService.getAllByTime(departureTime, arrivalTime)
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

  async getAllByAirline(req: Request, res: Response) {
    try {
      const airline = req.body.airline as string
      const reply = await flightService.getAllByAirline(airline)
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

  async getAllAvailableFlights(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string)|| 10
      const reply = await flightService.getAllAvailable(page, limit)
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data,
        hasNextPage: reply.hasNextPage,
        hasPrevPage: reply.hasPevPage,
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }


  }

  async getOneFlight(req: Request, res: Response) {
    try {
      const reply = await flightService.getOne(req.params.id)
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

  async getBookingsByUser(req: Request, res: Response) {

    try {
      const reply = await flightService.getBookingsByUser(req.params.id)
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

  async getAllFlightSeatPrices(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string)|| 10
      const reply = await flightService.getAllFlightSeatPrices(page,limit)
      return res.status(reply.statusCode).send({
        success: true,
        message: reply.message,
        data: reply.data,
        hasNextPage: reply.hasNextPage,
        hasPrevPage: reply.hasPevPage,
      })
    } catch (err: unknown) {
      return res.status(getStatusCode(err)).send({
        success: false,
        message: getMessage(err)
      })
    }
  }

  async getOneFlightSeatPrice(req: Request, res: Response) {
    try {
      const reply = await flightService.getOneFlightSeatPrice(req.params.id)
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


  async getFlightSeatPricesByFlight(req: Request, res: Response) {
    try {
      const reply = await flightService.getFlightSeatPricesByFlight(req.params.id)
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

  async updateFlight(req: Request, res: Response) {
    try {
      const reply = await flightService.updateFlight(req.params.id, req.body)
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

  async updateFlightSeatPrice(req: Request, res: Response) {
    try {
      const reply = await flightService.updateFlightSeatPrice(req.params.id, req.body)
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
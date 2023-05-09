import {
  Flight,
  FlightBooking,
  FlightSeatPrice,
  PrismaClient
} from "@prisma/client"
import { ApiError } from "../../utils/ApiError"
import { getStatusCode } from "../../utils/errors"
import { getMessage } from "../../utils/errors"
import { IUnifiedFlight } from "../../utils/interfaces"

const prisma = new PrismaClient()

export class FlightService {
  async create(body: Flight) {
    try {
      const data = await prisma.flight.create({
        data: body
      })

      return {
        statusCode: 201,
        message: "Flight created successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  // this is creating flight with seats, & price at the same time
  async createdUnified(body: unknown) {
    try {
      const flightBody = body as Flight
      const flightData = {
        airline: flightBody.airline,
        departure_time: flightBody.departure_time,
        arrival_time: flightBody.arrival_time,
        departure_airport_id: flightBody.departure_airport_id,
        arrival_airport_id: flightBody.arrival_airport_id
      } as unknown
      const data = await prisma.flight.create({
        data: flightData as Flight
      })

      const newBody2 = body as IUnifiedFlight
      newBody2.flight_seat_prices.map(async (flightSeatPrice) => {
        const flightSeatPriceData = {
          flight_id: data.id,
          class: flightSeatPrice.class,
          numberofseats: flightSeatPrice.numberofseats,
          price: flightSeatPrice.price
        }
        await this.mapFlight(flightSeatPriceData as FlightSeatPrice)
      })
      return {
        statusCode: 200,
        message: "Flight created successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  // map flight classes to the flight, price and corresponding seats
  async mapFlight(body: FlightSeatPrice) {
    try {
      const data = await prisma.flightSeatPrice.create({
        data: body
      })

      return {
        statusCode: 201,
        message: "Flight class & Price created successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async book(body: FlightBooking) {
    try {
      const booking = await prisma.flightBooking.findFirst({
        where: {
          user_id: body.user_id,
          flight_seat_price_id: body.flight_seat_price_id
        }
      })
      if (booking) {
        throw new ApiError(false, 400, "You have already booked this flight")
      }

      // decrement the number of seats available
      const flight = await prisma.flightSeatPrice.findUnique({
        where: {
          id: body.flight_seat_price_id
        }
      })

      if (flight) {
        let seats = flight.numberofseats
        if (seats <= 0) {
          throw new ApiError(false, 400, "No seats available")
        }
        seats = flight.numberofseats - 1
        await prisma.flightSeatPrice.update({
          where: {
            id: body.flight_seat_price_id
          },
          data: {
            numberofseats: seats
          }
        })
      }

      const data = await prisma.flightBooking.create({
        data: body
      })

      return {
        statusCode: 201,
        message: "Flight booked successfully",
        data: data
      }

      //TODO: Manage the seat labels and seat numbers
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  // other crud services

  // for flights

  async getAll(page: number, limit: number) {
    try {
      const count = await prisma.flight.count()
      const data = await prisma.flight.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })

      const hasNextPage = page * limit < count
      const hasPevPage = page > 1

      return {
        statusCode: 200,
        message: "Flights retrieved successfully",
        data: data,
        hasNextPage,
        hasPevPage
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  // filters

  async getAllByAirports(departureAirport: string, arrivalAirport: string) {
    try {
      const data = await prisma.flight.findMany({
        where: {
          departure_airport_id: departureAirport,
          arrival_airport_id: arrivalAirport
        },
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })

      return {
        statusCode: 200,
        message: "Flight retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getAllByTime(departureTime: Date, arrivalTime: Date) {
    try {
      const data = await prisma.flight.findMany({
        where: {
          departure_time: {
            gte: departureTime
          },
          arrival_time: {
            lte: arrivalTime
          }
        },
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })

      return {
        statusCode: 200,
        message: "Flight retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }


    async getAllByTimeAndLocation(
      departure_location:string,
      arrival_location:string,
      departureTime: string, arrivalTime: string) {
    try {

      const departureLocation = await prisma.airport.findMany({  
        where: {
          city:{
            contains:departure_location,
            mode: 'insensitive'
          }
        }
      })

      const arrivalLocation = await prisma.airport.findMany({  
        where: {
          city:{
            contains:arrival_location,
            mode: 'insensitive'
          }
        }
      })

      const departureLocationIds:string[]=[]

      departureLocation.forEach((loc)=>{
        departureLocationIds.push(loc.id)
      })

      const arrivalLocationIds:string[]=[]
      arrivalLocation.forEach((loc)=>{
        arrivalLocationIds.push(loc.id)
      })

      const formattedDepartureDate = new Date(departureTime)
      const formattedArrivalDate = new Date(arrivalTime)


      const data = await prisma.flight.findMany({
        where: {

          departure_airport_id:{
            in: departureLocationIds
          },
          arrival_airport_id:{
            in: arrivalLocationIds
          },
          departure_time: {
            gte: formattedDepartureDate
          },
          arrival_time: {
            lte: formattedArrivalDate
          }
        },
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })


      return {
        statusCode: 200,
        message: "Flight retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  // get all by airline
  async getAllByAirline(airline: string) {
    try {
      const data = await prisma.flight.findMany({
        where: {
          airline: {
            contains: airline
          }
        },
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })

      return {
        statusCode: 200,
        message: "Flight retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getAllAvailable(page: number, limit: number) {
    try {
      const count = await prisma.flight.count()
      const data = await prisma.flight.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          flight_seat_prices: {
            some: {
              numberofseats: {
                gt: 0
              }
            }
          }
        },
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })
      const hasNextPage = page * limit < count
      const hasPevPage = page > 1
      return {
        statusCode: 200,
        message: "Flights retrieved successfully",
        data: data,
        hasNextPage,
        hasPevPage
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getOne(id: string) {
    try {
      const data = await prisma.flight.findUnique({
        where: {
          id: id
        },
        include: {
          flight_seat_prices: true,
          departure_airport: true,
          arrival_airport: true
        }
      })

      return {
        statusCode: 200,
        message: "Flight retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getBookingsByUser(userId: string) {
    try {
      const data = await prisma.flightBooking.findMany({
        where: {
          user_id: userId
        },
        include: {
          user: true,
          flight_seat_price: {
            include: {
              flight: {
                include: {
                  departure_airport: true,
                  arrival_airport: true
                }
              }
            }
          }
        }
      })

      return {
        statusCode: 200,
        message: "Bookings retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  // for flight seat prices

  async getAllFlightSeatPrices(page: number, limit: number) {
    try {
      const count = await prisma.flightSeatPrice.count()
      const data = await prisma.flightSeatPrice.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          flight: {
            include: {
              departure_airport: true,
              arrival_airport: true
            }
          }
        }
      })
      const hasNextPage = page * limit < count
      const hasPevPage = page > 1

      return {
        statusCode: 200,
        message: "Flight seat prices retrieved successfully",
        data: data,
        hasNextPage,
        hasPevPage
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getOneFlightSeatPrice(id: string) {
    try {
      const data = await prisma.flightSeatPrice.findUnique({
        where: {
          id: id
        },
        include: {
          flight: {
            include: {
              departure_airport: true,
              arrival_airport: true
            }
          }
        }
      })

      return {
        statusCode: 200,
        message: "Flight seat price retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async getFlightSeatPricesByFlight(flightId: string) {
    try {
      const data = await prisma.flightSeatPrice.findMany({
        where: {
          flight_id: flightId
        },
        include: {
          flight: {
            include: {
              departure_airport: true,
              arrival_airport: true
            }
          }
        }
      })

      return {
        statusCode: 200,
        message: "Flight seat prices retrieved successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async updateFlight(id: string, body: Flight) {
    try {
      const data = await prisma.flight.update({
        where: {
          id: id
        },
        data: body
      })

      return {
        statusCode: 200,
        message: "Flight updated successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }

  async updateFlightSeatPrice(id: string, body: FlightSeatPrice) {
    try {
      const data = await prisma.flightSeatPrice.update({
        where: {
          id: id
        },
        data: body
      })

      return {
        statusCode: 200,
        message: "Flight seat price updated successfully",
        data: data
      }
    } catch (err: unknown) {
      throw new ApiError(false, getStatusCode(err), getMessage(err))
    }
  }
}

import { Flight, FlightSeatPrice } from "@prisma/client";

export interface IUnifiedFlight extends Flight{
    flight_seat_prices: FlightSeatPrice[]
}
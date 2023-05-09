import { Flight, FlightSeatPrice } from "@prisma/client"

export interface IUnifiedFlight extends Flight {
  flight_seat_prices: FlightSeatPrice[]
}
export interface ICard {
  number: string
  exp_month: string
  exp_year: string
  cvc: string
}

export interface IPaymentPayload {
  amount: number
  currency: string
  cardInfo: ICard
  reason?: string
}



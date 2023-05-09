import { ApiError } from "../../utils/ApiError"
import { ICard } from "../../utils/interfaces"
import Stripe from "stripe"
import { getMessage } from "../../utils/errors"

export async function processPayment(
  amount: number,
  currency: string,
  cardInfo: ICard,
  reason?: string
) {
  const secretKey = process.env.STRIPE_SECRET_KEY as string
  const stripe = new Stripe(secretKey, {
    apiVersion: "2022-11-15"
  })

  try {
    // Create a card token from the card details
    const tokenParams: Stripe.TokenCreateParams = {
      card: {
        number: cardInfo.number,
        exp_month: cardInfo.exp_month,
        exp_year: cardInfo.exp_year,
        cvc: cardInfo.cvc
      }
    }

    const cardToken = await stripe.tokens.create(tokenParams)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      payment_method: 'pm_card_visa',
      description: reason
    })

    if (paymentIntent) {
      return {
        success:true,
        message: "Payment Successful",
        statusCode: 200,
        data: paymentIntent
      }
    } else {
      return {
        success:false,
        message: "Payment Failed",
        statusCode: 400,
        data: paymentIntent
      }
    }
  } catch (err: unknown) {
    throw new ApiError(false, 400, getMessage(err))
  }
}

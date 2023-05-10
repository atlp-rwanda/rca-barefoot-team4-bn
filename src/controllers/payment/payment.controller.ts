import { Request, Response } from "express"
import { IPaymentPayload } from "../../utils/interfaces"
import { processPayment } from "../../services/payment/payment.service"
import { getStatusCode } from "../../utils/errors"
import { getMessage } from "../../utils/errors"
export async function pay(req: Request, res: Response) {
  try {
    const reqBody: IPaymentPayload = req.body
    const { amount, currency, cardInfo, reason } = reqBody

    const serviceRes = await processPayment(amount, currency, cardInfo, reason)
    return res.status(serviceRes.statusCode).send({
      success: true,
      message: serviceRes.message,
      data: serviceRes.data
    })
  } catch (err: unknown) {
    return res.status(getStatusCode(err)).send({
      success: false,
      message: getMessage(err)
    })
  }
}

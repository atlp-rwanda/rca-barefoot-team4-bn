import { type Request, type Response } from "express";
import sendEmail from "../services/sendEmail";

export const sendEmailController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const isEmailSent = await sendEmail({
      isSignedUp: true,
      emailTo: req.body.emailTo,
      emailFrom: req.body.emailFrom,
      emailSubject: req.body.subject,
      emailBody: req.body.text,
    });

    if (isEmailSent === true) {
      return res.json({
        status: 200,
        message: `Email successfully sent to the user`,
      });
    }
    return res.json({
      status: 400,
      message: `Failed to send email to the user, Please sent email again`,
    });
  } catch (err) {
    console.log(`Error found while sending email to the user`, err);
  }
};

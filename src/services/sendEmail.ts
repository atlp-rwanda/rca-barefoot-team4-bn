import { type ISendEmail } from "../types/sendEmail";
import sgMail from '@sendgrid/mail';
import { Client } from '@sendgrid/client';

const sendEmail = async ({
  isSignedUp,
  emailTo,
  emailFrom,
  emailSubject,
  emailBody,
}: ISendEmail): Promise<boolean> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const sendGridClient = new Client();
  sendGridClient.setApiKey(process.env.SENDGRID_API_KEY as string); // add this line to set the API key

  try {
    if (isSignedUp) {
      const message = {
        to: "mugishaisaac2001@gmail.com",
        from: "mugishaisaac0508@gmail.com",
        subject: "test",
        html: "test",
      };
      const [response, _] = await sgMail.send(message);
      console.log("response from the server is: ", response);
      console.log("Email sent successfully");

      // check email status
      const messageId = response.headers["x-message-id"];
      const [getStatusResponse, __] = await sendGridClient.request({
        method: 'GET',
        url: `/v3/messages/${messageId}`
      });
      console.log("Email delivery status: ", getStatusResponse.body);

      return true;
    }
  } catch (err:any) {
    console.log("Error found while sending email to the user", err.response.body.errors);

  }
  return false;
};

export default sendEmail;

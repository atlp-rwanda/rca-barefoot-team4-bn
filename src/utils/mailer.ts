import sendGrid from "@sendgrid/mail";
import { type IEmailMessage } from "index";
sendGrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function sendEmail(
  msg: IEmailMessage
): Promise<[sendGrid.ClientResponse, object]> {
  const message = {
    to: msg.to,
    from: "barefootnomadd@gmail.com",
    subject: msg.subject,
    html: `<div style="font-size:17px;text-align:left;color:#181a19">${msg.message}</div>`,
  };

  const send = await sendGrid.send(message);
  return send;
}

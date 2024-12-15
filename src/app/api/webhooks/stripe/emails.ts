import log from "@/log";
import sgMail from "@sendgrid/mail";

export async function sendEmailToCustomer(
  email: string,
  name: string,
  downloadUrl: string
) {
  if (!process.env.SENDGRID_API_KEY) {
    await log.warn("SENDGRID_API_KEY not set, skipping email");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "mateopresacastro@gmail.com",
    subject: "Your sample pack is ready!",
    text: `Hey ${name}, your sample pack is ready to download at ${downloadUrl}`,
    html: `<p>Hey ${name}, your sample pack is ready to download at ${downloadUrl}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    await log.error(
      `Error sending email with link to ${email}, ${name}, download url:${downloadUrl}`,
      error
    );
    throw error;
  }
}

export async function notifySale(email: string) {
  if (!process.env.SENDGRID_API_KEY) {
    await log.warn("SENDGRID_API_KEY not set, skipping email");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "mateopresacastro@gmail.com",
    subject: "You just made a sale!",
    text: `You just made a sale! Check it out on your dashboard.`,
    html: `<p>You your just made a sale! Check it out on your dashboard.</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    await log.error(
      `Error sending email to ${email}, with sale notification.`,
      error
    );
    throw error;
  }
}

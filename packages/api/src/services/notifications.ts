import { Resend } from 'resend';
import Twilio from 'twilio';

import { env } from '../../env.mjs';

export const makeNotifications = () => {
  const makeSms = () => {
    const client = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

    const send = async ({ to, body }: { to: string; body: string }) => {
      await client.messages.create({ to, body });
    };

    return { send };
  };

  const makeEmail = () => {
    const resend = new Resend(env.RESEND_API_KEY);

    const send = async ({
      from,
      to,
      subject,
      html,
    }: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) => {
      await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
    };

    return { send };
  };

  return { sms: makeSms(), email: makeEmail() };
};

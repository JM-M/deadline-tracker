import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  recipients,
  subject,
  content,
}: {
  recipients: string[] | string;
  subject: string;
  content: React.ReactNode;
}) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: recipients,
    subject: subject,
    react: content,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

import { z } from "zod";

export const contactSchema = (messages: {
  name_required: string;
  email_required: string;
  email_invalid: string;
  message_required: string;
  message_min: string;
}) =>
  z.object({
    name: z.string().min(1, messages.name_required),
    company: z.string().optional(),
    email: z
      .string()
      .min(1, messages.email_required)
      .email(messages.email_invalid),
    subject: z.string().optional(),
    message: z
      .string()
      .min(1, messages.message_required)
      .min(10, messages.message_min),
  });

export type ContactFormData = z.infer<ReturnType<typeof contactSchema>>;

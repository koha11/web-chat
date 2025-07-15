import { z } from "zod";

export const authSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z
    .string()
    .nonempty("Password is required")
});

// Optionally infer the TS type for useForm
export type AuthSchema = z.infer<typeof authSchema>;

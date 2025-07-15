import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .transform((val) => val.trim().replace(/\s+/g, " ")), 
  password: z.string().nonempty("Password is required"),
});

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .nonempty("Fullname is required")
      .refine(
        (value) => {
          // Cho phép chữ cái (cả tiếng Việt), và khoảng trắng
          // Regex cho các chữ cái unicode + khoảng trắng
          return /^[\p{L} ]+$/u.test(value);
        },
        {
          message: "Fullname can not contain special Characters and numbers",
        }
      )
      .transform((val) => val.trim().replace(/\s+/g, " ")),
    username: z
      .string()
      .nonempty("Username is required")
      .transform((val) => val.trim().replace(/\s+/g, " ")),
    password: z.string().nonempty("Password is required"),
    email: z
      .email({ error: "Invalid email" })
      .or(z.literal(""))
      .transform((val) => val.trim().replace(/\s+/g, " ")),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This tells Zod where to attach the error
  });

// Optionally infer the TS type for useForm
export type LoginSchemaType = z.infer<typeof loginSchema>;

// Optionally infer the TS type for useForm
export type RegisterSchemaType = z.infer<typeof registerSchema>;

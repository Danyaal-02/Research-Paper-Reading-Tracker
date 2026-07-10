import { z } from "zod";

const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const signupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex, "Password must contain at least one number and one special character"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

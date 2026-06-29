import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  city: z.string().optional(),
  country_interest: z.string().optional(),
  education_level: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({
  email: z.string().email('Enter a valid email'),
});
export type ForgotInput = z.infer<typeof forgotSchema>;

export const counsellorSchema = z.object({
  full_name: z.string().min(2, 'Enter a name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  department: z.string().min(2, 'Enter a department'),
  password: z.string().min(6, 'Min 6 characters'),
});
export type CounsellorInput = z.infer<typeof counsellorSchema>;

export const assignSchema = z.object({
  student_id: z.string().uuid(),
  counsellor_id: z.string().uuid(),
});

export const statusSchema = z.object({
  student_id: z.string().uuid(),
  status: z.enum([
    'new_lead', 'contacted', 'interested', 'follow_up', 'paid', 'active', 'converted', 'closed',
  ]),
});

export const noteSchema = z.object({
  student_id: z.string().uuid(),
  note: z.string().min(1, 'Note cannot be empty').max(2000),
});

export const messageSchema = z.object({
  conversation_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  message: z.string().min(1).max(4000),
});

export const profileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional(),
  city: z.string().optional(),
  country_interest: z.string().optional(),
  education_level: z.string().optional(),
});

export const minutesSchema = z.object({
  student_id: z.string().uuid(),
  minutes: z.coerce.number().int().min(0).max(100000),
});

export const paymentOrderSchema = z.object({
  payment_type: z.enum(['registration_fee', 'counselling_fee', 'premium_package']),
});

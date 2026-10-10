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

/* ───────────── Website leads (public contact form → CRM) ───────────── */

/** The 9 requirement labels shown on the website contact form (stored verbatim in leads.requirement). */
export const LEAD_REQUIREMENTS = [
  'Education',
  'Counselling',
  'Academy / Courses',
  'Jobs & Careers',
  'Consulting',
  'Technology',
  'Import-Export',
  'Global Opportunities',
  'Partner Network',
  'Institutional Partnership',
  'Other',
] as const;
export type LeadRequirement = (typeof LEAD_REQUIREMENTS)[number];

export const LEAD_CONTACT_METHODS = ['phone', 'whatsapp', 'email'] as const;
export type LeadContactMethod = (typeof LEAD_CONTACT_METHODS)[number];

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Empty string / null → undefined, so optional form fields can be sent blank. */
const blankToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);

/** Optional free-text field: blank allowed, trimmed, hard length limit. */
const optionalText = (max: number, message: string) =>
  z.preprocess(blankToUndefined, z.string().trim().max(max, message).optional());

/**
 * Optional attribution field (source, page, UTM…). These are captured automatically by the
 * browser, so an over-long value is truncated instead of rejected — a lead must never be lost
 * because a referrer URL was long.
 */
const trackingField = (max: number) =>
  z.preprocess((v) => {
    if (typeof v !== 'string') return undefined;
    const t = v.trim().slice(0, max);
    return t === '' ? undefined : t;
  }, z.string().optional());

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100, 'Name is too long'),
  phone: z
    .string()
    .trim()
    .min(8, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+\-()\s]+$/, 'Phone number can only contain digits, +, spaces, dashes and parentheses'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(200, 'Email is too long'),
  location: optionalText(120, 'City / country is too long'),
  requirement: z.enum(LEAD_REQUIREMENTS, {
    errorMap: () => ({ message: 'Please choose what you are looking for' }),
  }),
  contact_method: z
    .enum(LEAD_CONTACT_METHODS, {
      errorMap: () => ({ message: 'Please choose a preferred contact method' }),
    })
    .default('whatsapp'),
  message: optionalText(2000, 'Message is too long (max 2000 characters)'),
  source: trackingField(300),
  page: trackingField(300),
  landing_page: trackingField(300),
  referrer: trackingField(300),
  utm_source: trackingField(120),
  utm_medium: trackingField(120),
  utm_campaign: trackingField(120),
  utm_term: trackingField(120),
  utm_content: trackingField(120),
  /** Honeypot — real visitors never see or fill this. */
  website: z.string().optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const leadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});

export const resetPasswordSchema = z.object({
  user_id: z.string().uuid(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password is too long'),
});

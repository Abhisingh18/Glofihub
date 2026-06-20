// Hand-written types matching supabase/schema.sql.
// (You can later regenerate with: supabase gen types typescript --project-id <id>)

export type UserRole = 'super_admin' | 'counsellor' | 'student';

export type StudentStatus =
  | 'new_lead'
  | 'contacted'
  | 'interested'
  | 'follow_up'
  | 'paid'
  | 'active'
  | 'converted'
  | 'closed';

export type PaymentType = 'registration_fee' | 'counselling_fee' | 'premium_package';
export type PaymentStatusType = 'created' | 'paid' | 'failed';

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  profile_image: string | null;
  created_at: string;
}

export interface Counsellor {
  id: string;
  user_id: string;
  department: string | null;
  active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  city: string | null;
  country_interest: string | null;
  education_level: string | null;
  status: StudentStatus;
  assigned_counsellor_id: string | null;
  created_at: string;
}

export interface StudentAssignment {
  id: string;
  student_id: string;
  counsellor_id: string;
  assigned_by: string | null;
  assigned_at: string;
}

export interface Conversation {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read_status: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_status: PaymentStatusType;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_type: PaymentType;
  created_at: string;
}

export interface Note {
  id: string;
  student_id: string;
  counsellor_id: string;
  note: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  activity: string;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

// Joined helpers used in the UI
export interface StudentWithUser extends Student {
  user: Pick<AppUser, 'full_name' | 'email' | 'profile_image'>;
  counsellor?: { id: string; full_name: string } | null;
}

export interface CounsellorWithUser extends Counsellor {
  user: Pick<AppUser, 'full_name' | 'email' | 'profile_image'>;
}

export const STUDENT_STATUSES: StudentStatus[] = [
  'new_lead', 'contacted', 'interested', 'follow_up', 'paid', 'active', 'converted', 'closed',
];

export const STATUS_META: Record<StudentStatus, { label: string; className: string }> = {
  new_lead:  { label: 'New Lead',  className: 'bg-sky-500/12 text-sky-600 border-sky-500/20' },
  contacted: { label: 'Contacted', className: 'bg-violet-500/12 text-violet-600 border-violet-500/20' },
  interested:{ label: 'Interested',className: 'bg-amber-500/12 text-amber-600 border-amber-500/20' },
  follow_up: { label: 'Follow Up', className: 'bg-orange-500/12 text-orange-600 border-orange-500/20' },
  paid:      { label: 'Paid',      className: 'bg-emerald-500/12 text-emerald-600 border-emerald-500/20' },
  active:    { label: 'Active',    className: 'bg-teal-500/12 text-teal-600 border-teal-500/20' },
  converted: { label: 'Converted', className: 'bg-green-600/12 text-green-700 border-green-600/20' },
  closed:    { label: 'Closed',    className: 'bg-foreground/8 text-foreground/55 border-foreground/15' },
};

export const PAYMENT_TYPE_META: Record<PaymentType, { label: string; amount: number }> = {
  registration_fee: { label: 'Registration Fee', amount: 999 },
  counselling_fee:  { label: 'Counselling Fee',  amount: 2999 },
  premium_package:  { label: 'Premium Package',  amount: 14999 },
};

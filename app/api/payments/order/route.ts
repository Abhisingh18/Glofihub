import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { paymentOrderSchema } from '@/lib/validations';
import { PAYMENT_TYPE_META } from '@/lib/database.types';

export async function POST(req: Request) {
  const me = await requireRole('student');

  const body = await req.json().catch(() => null);
  const parsed = paymentOrderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 });
  }

  const { payment_type } = parsed.data;
  const amount = PAYMENT_TYPE_META[payment_type].amount;

  // Resolve the student's row.
  const supabase = await createClient();
  const { data: student } = await supabase.from('students').select('id').eq('user_id', me.id).single();
  if (!student) return NextResponse.json({ error: 'Student profile missing' }, { status: 400 });

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: `glofihub_${student.id.slice(0, 8)}_${Date.now()}`,
  });

  // Record a pending payment (service role bypasses RLS).
  const admin = createAdminClient();
  await admin.from('payments').insert({
    student_id: student.id,
    amount,
    payment_type,
    payment_status: 'created',
    razorpay_order_id: order.id,
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amount * 100,
    currency: 'INR',
    keyId,
    name: me.full_name,
    email: me.email,
  });
}

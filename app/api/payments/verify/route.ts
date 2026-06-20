import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logActivity, notify } from '@/lib/activity';

export async function POST(req: Request) {
  const me = await requireRole('student');
  const body = await req.json().catch(() => null);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: 'Payments not configured' }, { status: 503 });

  // Verify the HMAC signature.
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const admin = createAdminClient();

  if (expected !== razorpay_signature) {
    await admin.from('payments').update({ payment_status: 'failed', razorpay_payment_id })
      .eq('razorpay_order_id', razorpay_order_id);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // Mark paid.
  const { data: payment } = await admin
    .from('payments')
    .update({ payment_status: 'paid', razorpay_payment_id })
    .eq('razorpay_order_id', razorpay_order_id)
    .select('id, student_id, amount')
    .single();

  if (payment) {
    // Bump the student to "paid" (only if still an early stage).
    await admin.from('students')
      .update({ status: 'paid' })
      .eq('id', payment.student_id)
      .in('status', ['new_lead', 'contacted', 'interested', 'follow_up']);

    await logActivity(me.id, 'Completed payment', { amount: payment.amount });
    await notify(me.id, 'payment', 'Payment successful', `We received ₹${payment.amount}. Thank you!`);

    // Notify all admins.
    const { data: admins } = await admin.from('users').select('id').eq('role', 'super_admin');
    for (const a of admins ?? []) {
      await notify(a.id, 'payment', 'New payment received', `${me.full_name} paid ₹${payment.amount}.`);
    }
  }

  return NextResponse.json({ ok: true });
}

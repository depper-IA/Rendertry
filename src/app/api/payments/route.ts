import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/config/supabase';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);

async function getBrandFromRequest(req: NextRequest): Promise<{ id: string } | null> {
  const token = req.cookies.get('auth_token')?.value ||
                req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const brandId = payload.brandId as string;
    return { id: brandId };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const brand = await getBrandFromRequest(req);
    if (!brand) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const { data, error } = await supabaseAdmin
      .from('subscription_payments')
      .select('id, amount_cents, currency, payment_date, payment_method, status, plan, months, transaction_id, metadata')
      .eq('brand_id', brand.id)
      .order('payment_date', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: 'Error al obtener historial: ' + error.message }, { status: 500 });
    }

    const payments = (data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      date: p.payment_date,
      amount: p.amount_cents,
      status: p.status,
      invoiceUrl: p.transaction_id ? `/api/invoices/${p.id}` : null,
      plan: p.plan,
      months: p.months,
      method: p.payment_method,
    }));

    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

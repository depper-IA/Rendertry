import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/config/supabase';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);

const PLANS = {
  basic: { price: 0, maxProducts: 5 },
  pro: { price: 49900, maxProducts: 15 },
  business: { price: 149900, maxProducts: 999 },
} as const;

export type PlanType = keyof typeof PLANS;

async function getBrandFromRequest(req: NextRequest): Promise<{ id: string; email: string; slug: string; plan?: string } | null> {
  const token = req.cookies.get('auth_token')?.value ||
                req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const brandId = payload.brandId as string;

    const { data: brand } = await supabaseAdmin
      .from('brands')
      .select('id, email, slug, plan')
      .eq('id', brandId)
      .single();

    return brand || null;
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

    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('plan, subscription_status, subscription_start_date, subscription_end_date, trial_end_date, trial_payment_status')
      .eq('id', brand.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Error al obtener suscripción' }, { status: 500 });
    }

    const endDate = data.subscription_end_date ? new Date(data.subscription_end_date) : null;
    const now = new Date();
    const daysRemaining = endDate ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : null;

    const isInTrial = data.plan === 'TRIAL' && data.trial_end_date && new Date(data.trial_end_date) > now;
    const trialDaysRemaining = isInTrial && data.trial_end_date
      ? Math.max(0, Math.ceil((new Date(data.trial_end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    return NextResponse.json({
      status: data.subscription_status || 'inactive',
      plan: data.plan || 'BASIC',
      startDate: data.subscription_start_date || null,
      endDate: data.subscription_end_date || null,
      daysRemaining,
      isInTrial,
      trialEndDate: data.trial_end_date || null,
      trialDaysRemaining,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const UpdatePlanSchema = {
  basic: true,
  pro: true,
  business: true,
} as const;

export async function POST(req: NextRequest) {
  try {
    const brand = await getBrandFromRequest(req);
    if (!brand) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || !UpdatePlanSchema[plan as PlanType]) {
      return NextResponse.json({ error: 'Plan inválido. Usa: basic, pro, business' }, { status: 400 });
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);

    const updateData: Record<string, unknown> = {
      plan: plan.toUpperCase(),
      subscription_status: 'active',
      subscription_start_date: now.toISOString(),
      subscription_end_date: endDate.toISOString(),
      trial_end_date: null,
      trial_payment_status: null,
    };

    const { data, error } = await supabaseAdmin
      .from('brands')
      .update(updateData)
      .eq('id', brand.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Error al actualizar plan: ' + (error?.message || 'Unknown') }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      plan: data.plan,
      subscriptionStatus: data.subscription_status,
      endDate: data.subscription_end_date,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

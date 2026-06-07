import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/config/supabase';
import { z } from 'zod';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);

const CreateProductSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  category: z.enum(['RIN', 'WRAP', 'PAINT']),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  price: z.number().positive().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const PLANS = {
  BASIC: { maxProducts: 5 },
  PRO: { maxProducts: 15 },
  ENTERPRISE: { maxProducts: Infinity },
  TRIAL: { maxProducts: 3 },
};

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
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const validCategories = ['RIN', 'WRAP', 'PAINT'] as const;
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category && validCategories.includes(category as typeof validCategories[number])) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
    }

    const products = (data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? null,
      imageUrl: p.image_url,
      category: p.category,
      price: p.price ?? null,
      metadata: p.attributes ?? {},
      isActive: p.is_active,
      createdAt: p.created_at,
      badge: p.badge ?? null,
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const brand = await getBrandFromRequest(req);
    if (!brand) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: 'VALIDATION_ERROR',
        message: parsed.error.issues[0]?.message || 'Datos inválidos'
      }, { status: 400 });
    }

    const { name, category, imageUrl, price, metadata } = parsed.data;

    const planLimits = PLANS[brand.plan as keyof typeof PLANS] || PLANS['BASIC'];

    const { count } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brand.id)
      .eq('is_active', true);

    if ((count || 0) >= planLimits.maxProducts) {
      return NextResponse.json({
        error: 'LIMIT_EXCEEDED',
        message: `Límite de productos alcanzado. Tu plan ${brand.plan} permite máximo ${planLimits.maxProducts} productos.`
      }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        brand_id: brand.id,
        name,
        category,
        image_url: imageUrl || null,
        price: price ?? null,
        attributes: metadata || {},
        is_active: true,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({
        error: 'INTERNAL_ERROR',
        message: 'Error al crear producto: ' + (error?.message || 'Unknown')
      }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description ?? null,
      imageUrl: data.image_url,
      category: data.category,
      price: data.price ?? null,
      metadata: data.attributes ?? {},
      isActive: data.is_active,
      createdAt: data.created_at,
      badge: data.badge ?? null,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
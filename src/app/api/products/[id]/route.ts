import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/config/supabase';
import { z } from 'zod';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);

const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['RIN', 'WRAP', 'PAINT']).optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().positive().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
  badge: z.enum(['nuevo', 'top', 'oferta']).nullable().optional(),
});

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

async function getProductById(productId: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const brand = await getBrandFromRequest(req);
    if (!brand) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Producto no encontrado' }, { status: 404 });
    }

    if (product.brand_id !== brand.id) {
      return NextResponse.json({ error: 'FORBIDDEN', message: 'No tienes acceso a este producto' }, { status: 403 });
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description ?? null,
      imageUrl: product.image_url,
      category: product.category,
      price: product.price ?? null,
      metadata: product.attributes ?? {},
      isActive: product.is_active,
      createdAt: product.created_at,
      badge: product.badge ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const brand = await getBrandFromRequest(req);
    if (!brand) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Producto no encontrado' }, { status: 404 });
    }

    if (product.brand_id !== brand.id) {
      return NextResponse.json({ error: 'FORBIDDEN', message: 'No tienes acceso a este producto' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = UpdateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: 'VALIDATION_ERROR',
        message: parsed.error.issues[0]?.message || 'Datos inválidos'
      }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    const { name, category, imageUrl, price, metadata, badge } = parsed.data;

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (price !== undefined) updateData.price = price;
    if (metadata !== undefined) updateData.attributes = metadata;
    if (badge !== undefined) updateData.badge = badge;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({
        error: 'INTERNAL_ERROR',
        message: 'Error al actualizar: ' + (error?.message || 'Unknown')
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
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const brand = await getBrandFromRequest(req);
    if (!brand) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Producto no encontrado' }, { status: 404 });
    }

    if (product.brand_id !== brand.id) {
      return NextResponse.json({ error: 'FORBIDDEN', message: 'No tienes acceso a este producto' }, { status: 403 });
    }

    await supabaseAdmin
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    return NextResponse.json({ ok: true, message: 'Producto eliminado' });
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
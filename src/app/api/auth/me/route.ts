import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.brandId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .select('id, name, email, created_at')
      .eq('id', payload.brandId as string)
      .single();

    if (error || !brand) {
      return NextResponse.json(
        { error: 'Marca no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ brand });
  } catch (err) {
    console.error('Me error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
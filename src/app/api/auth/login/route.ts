import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken, setAuthCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !brand) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, brand.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = await signToken({
      brandId: brand.id,
      email: brand.email,
      name: brand.name,
    });

    const response = NextResponse.json({
      brand: {
        id: brand.id,
        name: brand.name,
        email: brand.email,
      },
    });

    return setAuthCookie(token, response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
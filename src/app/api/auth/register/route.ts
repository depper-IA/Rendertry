import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken, setAuthCookie } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    const { data: existingBrand } = await supabase
      .from('brands')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingBrand) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: brand, error } = await supabase
      .from('brands')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
      })
      .select('id, name, email')
      .single();

    if (error || !brand) {
      console.error('Register error:', error);
      return NextResponse.json(
        { error: 'Error al crear la cuenta' },
        { status: 500 }
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
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
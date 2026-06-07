import { supabaseAdmin } from '@/config/supabase';
import bcrypt from 'bcryptjs';

export interface Brand {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: 'basic' | 'pro' | 'business';
  slug: string;
  createdAt: string;
}

export async function getBrandByEmail(email: string): Promise<Brand | null> {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error) return null;
  return data;
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createBrand(data: {
  name: string;
  email: string;
  password: string;
  slug?: string;
}): Promise<Brand> {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

  const { data: brand, error } = await supabaseAdmin
    .from('brands')
    .insert({
      name: data.name,
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      plan: 'basic',
      slug,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return brand;
}

export async function updateBrand(
  id: string,
  updates: { name?: string; email?: string; password?: string }
): Promise<void> {
  const updateData: Record<string, string> = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.email) updateData.email = updates.email.toLowerCase();
  if (updates.password) updateData.password_hash = await bcrypt.hash(updates.password, 10);

  await supabaseAdmin.from('brands').update(updateData).eq('id', id);
}

export class BrandsService {
  async getBrandBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  }

  async getBrandByEmail(email: string) {
    return getBrandByEmail(email);
  }

  async getBrandById(id: string) {
    return getBrandById(id);
  }

  async createBrand(data: { name: string; email: string; password: string; slug?: string }) {
    return createBrand(data);
  }

  async updateBrand(id: string, updates: { name?: string; email?: string; password?: string }) {
    return updateBrand(id, updates);
  }
}
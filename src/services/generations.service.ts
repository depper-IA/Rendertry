import { supabaseAdmin } from '@/config/supabase';

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Generation {
  id: string;
  brandId: string;
  brandSlug: string;
  status: GenerationStatus;
  imageUrl?: string;
  productType: 'RIN' | 'WRAP' | 'PAINT';
  productId: string;
  resultUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createGeneration(data: {
  brandId: string;
  brandSlug: string;
  productType: 'RIN' | 'WRAP' | 'PAINT';
  productId: string;
  imageUrl?: string;
}): Promise<Generation> {
  const { data: generation, error } = await supabaseAdmin
    .from('generations')
    .insert({
      brand_id: data.brandId,
      brand_slug: data.brandSlug,
      status: 'PENDING',
      product_type: data.productType,
      product_id: data.productId,
      image_url: data.imageUrl,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return generation;
}

export async function getGeneration(id: string): Promise<Generation | null> {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function updateGenerationStatus(
  id: string,
  status: GenerationStatus,
  result?: { resultUrl?: string; error?: string }
): Promise<void> {
  const updates: Record<string, string> = { status };
  if (result?.resultUrl) updates.result_url = result.resultUrl;
  if (result?.error) updates.error = result.error;

  await supabaseAdmin
    .from('generations')
    .update(updates)
    .eq('id', id);
}

export class GenerationsService {
  async createGeneration(data: {
    brand_id: string;
    product_id: string;
    photo_url?: string;
    product_image_url?: string;
    prompt?: string;
  }) {
    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .insert({
        brand_id: data.brand_id,
        product_id: data.product_id,
        selfie_url: data.photo_url,
        product_image_url: data.product_image_url,
        prompt_used: data.prompt,
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return generation;
  }

  async getGeneration(id: string) {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async updateGeneration(id: string, updates: Partial<{
    status: GenerationStatus;
    result_url: string;
    error: string;
  }>) {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
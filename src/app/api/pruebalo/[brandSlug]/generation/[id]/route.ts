import { NextRequest, NextResponse } from 'next/server';
import { GenerationsService } from '@/services/generations.service';
import { generationsMemory } from '@/lib/memory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandSlug: string; id: string }> }
) {
  try {
    const { id, brandSlug } = await params;

    // Check our global in-memory registry first for active asynchronous n8n generations
    if (generationsMemory.has(id)) {
      const cached = generationsMemory.get(id)!;
      return NextResponse.json({
        id,
        status: cached.status,
        resultUrl: cached.resultUrl,
        error: cached.error,
      });
    }

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (id === 'mock-local-generation-id' || brandSlug === 'demo-brand' || !isSupabaseConfigured) {
      // Mock local offline mode fallback: returns completed visualization with a gorgeous processed car asset
      return NextResponse.json({
        id: id,
        status: 'completed',
        resultUrl: '/assets/car-result.jpg',
      });
    }

    const generationsService = new GenerationsService();
    const generation = await generationsService.getGeneration(id);

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    let status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
    let resultUrl: string | undefined;
    let error: string | undefined;

    if (generation.status === 'PENDING') {
      status = 'pending';
    } else if (generation.status === 'SUCCESS') {
      status = 'completed';
      resultUrl = generation.result_url || undefined;
    } else if (generation.status === 'FAILED') {
      status = 'failed';
      error = generation.error_message || 'Generation failed';
    }

    return NextResponse.json({
      id: generation.id,
      status,
      resultUrl,
      error,
    });
  } catch (error) {
    console.error('[Generation Status] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
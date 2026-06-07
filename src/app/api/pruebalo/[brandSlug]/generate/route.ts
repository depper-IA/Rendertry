import { NextRequest, NextResponse } from 'next/server';
import { GenerationsService } from '../../../../../services/generations.service';
import { BrandsService } from '../../../../../services/brands.service';
import { z } from 'zod';
import { generationsMemory } from '@/lib/memory';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const GenerateRequestSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  productType: z.enum(['RIN', 'WRAP', 'PAINT']),
  productId: z.string().min(1, 'Product ID is required'),
});

const MOCK_PRODUCTS: Record<string, Array<{ id: string; name: string; imageUrl: string; description: string }>> = {
  RIN: [
    { id: 'rin-1', name: 'BBS E88', imageUrl: '/wheelblend/BBS-E88.png', description: 'BBS E88 premium multi-piece performance wheel, featuring a brilliant polished chrome lip, gold mesh center spokes, and visible hardware.' },
    { id: 'rin-2', name: 'HRE HX101', imageUrl: '/wheelblend/HRE-HX101.png', description: 'HRE HX101 lightweight monoblock performance wheel, in satin black finish with split five-spoke design.' },
    { id: 'rin-3', name: 'ADVAN GT', imageUrl: '/wheelblend/ADVAN-GT.png', description: 'ADVAN GT high-performance forged wheel, featuring a classic solid five-spoke design in dark gunmetal metallic finish.' },
    { id: 'rin-4', name: 'ENKEI RPF1', imageUrl: '/wheelblend/ENKEI-RPF1-SILVER.png', description: 'Enkei RPF1 iconic lightweight racing wheel, twin-spoke design in classic silver finish.' },
    { id: 'rin-5', name: 'Volk TE37', imageUrl: '/wheelblend/VOLK-TE37-BRONZE.png', description: 'Volk Racing TE37 iconic forged sports wheel, classic solid six-spoke design in authentic anodized bronze finish.' },
    { id: 'rin-6', name: 'BBS SX', imageUrl: '/wheelblend/BBS-SX-BRILLIANT-SILVER.png', description: 'BBS SX elegant double-spoke sports wheel, brilliant silver finish with structural premium spoke lines.' },
    { id: 'rin-7', name: 'SSR GTV03', imageUrl: '/wheelblend/SSR-GTV03-SILVER.png', description: 'SSR GTV03 sleek monoblock sports wheel, ten-spoke split design in brilliant hyper silver finish.' },
    { id: 'rin-8', name: 'Weld S71', imageUrl: '/wheelblend/WELD-S71.png', description: 'Weld Racing S71 drag racing performance wheel, polished chrome face with contrast black accent spokes.' },
  ],
  WRAP: [
    { id: 'wrap-1', name: 'Satin Negro', imageUrl: '/assets/wraps/wrap-satin-black.webp', description: 'Premium satin black vinyl vehicle wrap, smooth semi-gloss texture that highlights body contours.' },
    { id: 'wrap-2', name: 'Gloss Silver', imageUrl: '/assets/wraps/wrap-gloss-silver.webp', description: 'Gloss silver metallic vinyl vehicle wrap, high-gloss reflective finish with deep metallic flakes.' },
    { id: 'wrap-3', name: 'Gloss Negro Carbono', imageUrl: '/assets/wraps/wrap-gloss-black-carbon.webp', description: 'Glossy carbon fiber vinyl wrap, authentic weave pattern with a high-shine reflective clear coat.' },
    { id: 'wrap-4', name: 'Satin Blanco', imageUrl: '/assets/wraps/wrap-satin-white.webp', description: 'Satin pearl white vinyl wrap, smooth semi-gloss surface with a subtle iridescent glow.' },
    { id: 'wrap-5', name: 'Matte Red', imageUrl: '/assets/wraps/wrap-matte-red.webp', description: 'Flat matte red vinyl wrap, non-reflective deep red finish with a smooth textured look.' },
    { id: 'wrap-6', name: 'Gloss Orange', imageUrl: '/assets/wraps/wrap-gloss-orange.webp', description: 'Glossy electric orange vinyl wrap, vibrant high-shine orange paint-like finish.' },
    { id: 'wrap-7', name: 'Satin Blue', imageUrl: '/assets/wraps/wrap-satin-blue.webp', description: 'Satin royal blue vinyl wrap, semi-gloss anodized blue texture.' },
    { id: 'wrap-8', name: 'Chrome Gold', imageUrl: '/assets/wraps/wrap-chrome-gold.webp', description: 'Mirror chrome gold vinyl wrap, highly reflective luxury metallic gold finish.' },
  ],
  PAINT: [
    { id: 'paint-1', name: 'Racing Red', imageUrl: '/assets/wraps/wrap-matte-red.webp', description: 'Racing Red high-gloss automotive paint, intense sports red with a deep glossy clear coat.' },
    { id: 'paint-2', name: 'Midnight Black', imageUrl: '/assets/wraps/wrap-satin-black.webp', description: 'Midnight Black metallic paint, deep glossy black with subtle metallic reflection.' },
    { id: 'paint-3', name: 'Pearl White', imageUrl: '/assets/wraps/wrap-satin-white.webp', description: 'Pearl White multi-stage paint, brilliant white base with a rich pearl iridescent glow.' },
    { id: 'paint-4', name: 'Chrome Gold', imageUrl: '/assets/wraps/wrap-chrome-gold.webp', description: 'Chrome Gold liquid metallic paint, reflective gold-chrome coat.' },
  ],
};

// Helper to instantiate S3 Client for MinIO connection
const getS3Client = () => {
  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKeyId = process.env.MINIO_ACCESS_KEY;
  const secretAccessKey = process.env.MINIO_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey || accessKeyId === 'your-access-key' || secretAccessKey === 'your-secret-key') {
    return null;
  }

  return new S3Client({
    endpoint,
    region: 'us-east-1', // Required by AWS SDK but ignored by MinIO
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Required for path-style bucket naming
  });
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ brandSlug: string }> }
) {
  try {
    const { brandSlug } = await params;
    const body = await request.json();

    // 1. Resolve product metadata first
    const productList = MOCK_PRODUCTS[body.productType] || [];
    const product = productList.find(p => p.id === body.productId);
    const productName = product ? product.name : 'Custom Modification';
    
    const minioBase = (process.env.MINIO_PUBLIC_URL || 'https://minio.wilkiedevs.com/rendertry').replace(/\/$/, '');
    const productImageUrl = product ? `${minioBase}${product.imageUrl}` : '';

    // 2. Upload incoming base64 image to MinIO first (applicable to BOTH localhost and production!)
    let n8nImageUrl = body.image;
    const s3Client = getS3Client();

    if (n8nImageUrl.startsWith('data:image/') || n8nImageUrl.includes('localhost') || n8nImageUrl.includes('127.0.0.1')) {
      if (!s3Client) {
        return NextResponse.json(
          { error: 'MINIO_NOT_CONFIGURED', message: 'MinIO S3 Client is not configured. Local base64 images require MinIO for public URL generation.' },
          { status: 500 }
        );
      }
      
      try {
        // Parse base64 into a binary buffer
        const base64Data = n8nImageUrl.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        
        const bucketName = process.env.MINIO_BUCKET || 'rendertry';
        const fileExtension = n8nImageUrl.match(/[^:/]\w+(?=;base64)/)?.[0] || 'png';
        const fileName = `upload-${Date.now()}.${fileExtension}`;
        const s3Key = `${fileName}`;
        
        // Upload payload buffer to MinIO S3 bucket directly to root of dedicated bucket
        await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: buffer,
          ContentType: `image/${fileExtension}`,
        }));
        
        // Formulate public URL to pass to n8n
        const publicUrlPrefix = process.env.MINIO_PUBLIC_URL || process.env.MINIO_PUBLIC_URL_PREFIX || `${process.env.MINIO_ENDPOINT}/${bucketName}/`;
        n8nImageUrl = `${publicUrlPrefix.endsWith('/') ? publicUrlPrefix : publicUrlPrefix + '/'}${s3Key}`;
        console.log('Successfully uploaded car photo to MinIO (isolated):', n8nImageUrl);
      } catch (uploadError) {
        console.error('Failed to upload car photo to MinIO:', uploadError);
        return NextResponse.json(
          { error: 'UPLOAD_FAILED', message: `Failed to upload image to MinIO S3 bucket: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}` },
          { status: 500 }
        );
      }
    }

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 3. Demo brand / Offline fallback flow
    if (brandSlug === 'demo-brand' || !isSupabaseConfigured) {
      const generationId = 'demo-gen-' + Date.now();
      generationsMemory.set(generationId, { status: 'processing' });

      const payloadToN8n = {
        brand_id: brandSlug,
        product_id: body.productId,
        photo_url: n8nImageUrl,
        product_image_url: productImageUrl,
        prompt: product ? product.description : `Visualize ${productName} customization on vehicle`,
      };

      console.log('Sending payload to n8n (Demo):', JSON.stringify(payloadToN8n, null, 2));

      // Trigger n8n asynchronously (non-blocking) using Rendertry's active Webhook URL
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.wilkiedevs.com/webhook/rendertryon';
      const n8nApiKey = process.env.N8N_BEARER_TOKEN || process.env.N8N_API_KEY || '';

      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${n8nApiKey}`
        },
        body: JSON.stringify(payloadToN8n),
      })
      .then(async (res) => {
        if (res.ok) {
          const text = await res.text();
          let data: any = {};
          
          if (text.trim()) {
            try {
              data = JSON.parse(text);
            } catch (jsonErr) {
              console.warn('Failed to parse n8n response as JSON, treating as raw string:', text);
              if (text.startsWith('http://') || text.startsWith('https://')) {
                data = { imageUrl: text.trim() };
              } else {
                generationsMemory.set(generationId, {
                  status: 'failed',
                  error: `n8n responded with non-JSON text: "${text.substring(0, 150)}"`,
                });
                return;
              }
            }
          } else {
            console.warn('n8n responded with an empty body');
            generationsMemory.set(generationId, {
              status: 'failed',
              error: 'n8n responded with an empty body (Response Mode: "On Received"). To get real visual results on localhost, open your n8n workflow editor at https://n8n.wilkiedevs.com/workflow/buH8jClGBDWY4Uy5, open your Webhook node settings, change "Response Mode" to "When Last Node Finishes" (or use a "Respond to Webhook" node at the end), and save.',
            });
            return;
          }

          const resultUrl = data.resultUrl || data.imageUrl || data.url || data.output || data.image || data.result;
          if (resultUrl) {
            generationsMemory.set(generationId, {
              status: 'completed',
              resultUrl,
            });
          } else {
            console.warn('n8n response has no image url:', data);
            generationsMemory.set(generationId, {
              status: 'failed',
              error: `n8n completed but returned no valid result image URL. Response body: ${JSON.stringify(data)}`,
            });
          }
        } else {
          const errorText = await res.text();
          console.error(`n8n call failed (${res.status}): ${errorText}`);
          generationsMemory.set(generationId, {
            status: 'failed',
            error: `n8n webhook responded with status ${res.status}: ${errorText || res.statusText}`,
          });
        }
      })
      .catch((err) => {
        console.error('n8n call error:', err);
        generationsMemory.set(generationId, {
          status: 'failed',
          error: `n8n network fetch failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      });

      return NextResponse.json({
        generationId,
      });
    }

    // 4. Production Database flow (triggers real brands with full S3 MinIO urls!)
    const brandsService = new BrandsService();
    const brand = await brandsService.getBrandBySlug(brandSlug);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    const validationResult = GenerateRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { image, productType, productId } = validationResult.data;

    const generationsService = new GenerationsService();
    const generation = await generationsService.createGeneration({
      brand_id: brand.id,
      product_id: productId,
      photo_url: n8nImageUrl, // <-- Saves the public MinIO S3 URL into Supabase generations!
      product_image_url: productImageUrl, // <-- Saves the public product asset URL into Supabase generations!
      prompt: product ? product.description : `Visualize ${productName} customization on vehicle`,
    });

    return NextResponse.json({
      generationId: generation.id,
    });
  } catch (error) {
    console.error('[Generate] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

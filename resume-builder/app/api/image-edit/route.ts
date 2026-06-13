import { NextRequest, NextResponse } from 'next/server';

const MODEL = 'timothybrooks/instruct-pix2pix';

export async function POST(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: 'REPLICATE_API_TOKEN is not configured.' }, { status: 500 });
  }

  const formData = await req.formData();
  const imageFile = formData.get('image') as File | null;
  const instruction = formData.get('instruction') as string | null;

  if (!imageFile || !instruction?.trim()) {
    return NextResponse.json({ error: 'Image and instruction are required.' }, { status: 400 });
  }

  const bytes = await imageFile.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const dataUrl = `data:${imageFile.type};base64,${base64}`;

  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiToken}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',
    },
    body: JSON.stringify({
      input: {
        image: dataUrl,
        prompt: instruction.trim(),
        num_outputs: 1,
        num_inference_steps: 50,
        image_guidance_scale: 1.5,
        guidance_scale: 7.5,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Replicate error: ${err}` }, { status: 502 });
  }

  const prediction = await res.json();
  return NextResponse.json({ id: prediction.id, status: prediction.status });
}

export async function GET(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: 'REPLICATE_API_TOKEN is not configured.' }, { status: 500 });
  }

  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Prediction ID is required.' }, { status: 400 });
  }

  const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: { Authorization: `Token ${apiToken}` },
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Replicate error: ${err}` }, { status: 502 });
  }

  const prediction = await res.json();
  return NextResponse.json({
    status: prediction.status,
    output: prediction.output ?? null,
    error: prediction.error ?? null,
  });
}

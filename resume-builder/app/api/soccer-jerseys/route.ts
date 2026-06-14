import { NextRequest, NextResponse } from 'next/server';
import { searchJerseys } from '@/lib/soccer-jersey-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const team = searchParams.get('team') ?? '';
  const results = searchJerseys(team);
  return NextResponse.json({ results, query: team });
}

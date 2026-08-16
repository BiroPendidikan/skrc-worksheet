import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  return NextResponse.json({ subjects: [{ id: '1', name: 'Test', code: 'TST' }] });
}
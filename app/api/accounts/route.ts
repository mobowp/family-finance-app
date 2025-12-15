import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, get userId from session
  const accounts = await prisma.account.findMany();
  return NextResponse.json(accounts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const account = await prisma.account.create({
    data: {
      name: body.name,
      type: body.type,
      balance: parseFloat(body.balance),
      userId: "demo-user-id", // Hardcoded for MVP
    },
  });
  return NextResponse.json(account);
}

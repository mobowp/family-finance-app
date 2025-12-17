import { NextResponse } from 'next/server';
import { getDailyLoveQuote, refreshDailyLoveQuote } from '@/app/actions/love-quote';

export async function GET() {
  try {
    const data = await getDailyLoveQuote();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get love quote:', error);
    return NextResponse.json(
      { 
        content: '加载失败，请刷新重试',
        type: 'error',
        daysLoved: null
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const data = await refreshDailyLoveQuote();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to refresh love quote:', error);
    return NextResponse.json(
      { error: '刷新失败' },
      { status: 500 }
    );
  }
}

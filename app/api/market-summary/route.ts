

// Import NextResponse for API route response handling
import { NextResponse } from 'next/server';

// Define the GET method to handle GET requests to this endpoint
export async function GET() {
  // Static market summary data to be returned as the API response
  const summary = {
    date: '2025-08-03',
    nikkei: '-0.43%',
    topix: '+0.12%',
    topics: [
      '米雇用統計の結果を受けてハイテク株が反発',
      '新NISAの影響で個人買い増加',
      '為替は円安傾向が続く',
    ],
  };

  // Return the summary data as a JSON response
  return NextResponse.json(summary);
}
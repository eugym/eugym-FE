import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

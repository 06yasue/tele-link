import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    // Cek kalau di Vercel belum di-setting
    if (!envEmail || !envPassword) {
      return NextResponse.json({ error: 'Server configuration missing. Please setup Vercel Env Vars.' }, { status: 500 });
    }

    if (email === envEmail && password === envPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

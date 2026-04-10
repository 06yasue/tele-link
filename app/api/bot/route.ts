import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    const text = message.text;

    if (!text.startsWith('http')) {
      await fetch(TELEGRAM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: 'Kirim URL yang valid (harus pakai http/https).' })
      });
      return NextResponse.json({ status: 'ok' });
    }

    const slug = generateSlug();
    
    const { error } = await supabase
      .from('urls')
      .insert([{ slug, original_url: text }]);

    let replyText = error 
      ? 'Gagal membuat short URL.'
      : `Berhasil!\nURL: https://${siteConfig.domain}/${slug}`;

    await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: replyText })
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

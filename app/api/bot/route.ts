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

    // Kalau bukan pesan teks, abaikan (mencegah error)
    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    const text = message.text;

    // 1. TANGANI COMMAND /start BESERTA TOMBOL MENU
    if (text === '/start') {
      const welcomeMsg = `Halo! 👋 Selamat datang di bot ${siteConfig.name}.\n\nKirimkan link panjang kamu (harus pakai http:// atau https://) dan bot akan langsung memendekkannya.\n\nPilih menu di bawah ini:`;
      
      await fetch(TELEGRAM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: welcomeMsg,
          reply_markup: {
            inline_keyboard: [
              [
                // Tombol ini bakal ngelempar user ke web lu
                { text: '📋 List URLs', url: `https://${siteConfig.domain}/list` },
                { text: '⚙️ Settings', url: `https://${siteConfig.domain}/settings` }
              ]
            ]
          }
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 2. KALAU BUKAN LINK DAN BUKAN COMMAND
    if (!text.startsWith('http')) {
      await fetch(TELEGRAM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: '⚠️ Kirim URL yang valid (harus diawali http:// atau https://).' })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 3. KALAU YANG DIKIRIM ADALAH LINK (PROSES SHORTEN)
    const slug = generateSlug();
    
    const { error } = await supabase
      .from('urls')
      .insert([{ slug, original_url: text }]);

    const replyText = error 
      ? '❌ Gagal membuat short URL. Cek database Supabase kamu.'
      : `✅ Berhasil dipendekkan!\n\n🔗 URL: https://${siteConfig.domain}/${slug}`;

    await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: replyText,
        disable_web_page_preview: true // Biar gak muncul preview link panjangnya
      })
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

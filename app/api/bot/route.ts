import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

    const body = await req.json();

    // 1. TANGANI KLIK TOMBOL (Callback Query)
    if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;
      const firstName = body.callback_query.from?.first_name || 'Kak';

      if (data === 'new_link') {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `👇 Silakan kirimkan link panjang yang baru, ${firstName}:`
          })
        });
      }
      return NextResponse.json({ status: 'ok' });
    }

    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || 'Kak';

    // 2. TANGANI COMMAND /start
    if (text === '/start') {
      const welcomeMsg = `Halo ${firstName}! 👋\n\nSelamat datang di bot ${siteConfig.name}.\nKirimkan link panjang kamu (harus pakai http:// atau https://) dan bot akan langsung memendekkannya.`;
      
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: welcomeMsg,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📋 List URLs', url: `https://${siteConfig.domain}/list` },
                { text: '⚙️ Settings', url: `https://${siteConfig.domain}/settings` }
              ]
            ]
          }
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 3. VALIDASI URL
    if (!text.startsWith('http')) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `⚠️ ${firstName}, kirim URL yang valid (harus diawali http:// atau https://).` })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 4. KIRIM PESAN PROGRES
    const progressRes = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: `⏳ Tunggu sebentar ya ${firstName}, sedang memproses...` })
    });
    const progressData = await progressRes.json();
    const messageId = progressData.result?.message_id;

    // 5. PROSES DB SUPABASE
    const slug = generateSlug();
    const { error } = await supabase
      .from('urls')
      .insert([{ slug, original_url: text }]);

    // 6. SIAPKAN PESAN HASIL & TOMBOL
    const replyText = error 
      ? `❌ Maaf ${firstName}, gagal membuat short URL.`
      : `✅ Sukses dipendekkan, ${firstName}!\n\n🔗 Short URL: https://${siteConfig.domain}/${slug}`;

    const replyMarkup = error ? {} : {
      inline_keyboard: [
        [{ text: '➕ Buat Link Baru', callback_data: 'new_link' }]
      ]
    };

    // 7. UBAH PESAN PROGRES JADI HASIL FINAL
    if (messageId) {
      await fetch(`${TELEGRAM_API}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          message_id: messageId,
          text: replyText, 
          disable_web_page_preview: true,
          reply_markup: replyMarkup
        })
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

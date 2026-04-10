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

    // 1. TANGANI KLIK TOMBOL
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

    // 2. CEK KALAU BUKAN PESAN TEKS (Misal: Stiker, Foto, File)
    if (!message || !message.text) {
      if (message && message.chat) {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: message.chat.id, text: '⚠️ Maaf, bot ini cuma bisa memproses pesan teks berupa link ya!' })
        });
      }
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    // Hapus spasi di awal dan akhir teks (Fix masalah spasi)
    const text = message.text.trim(); 
    const firstName = message.from?.first_name || 'Kak';

    // 3. TANGANI COMMAND /start (Sekalian bawa ID user di link tombol)
    if (text === '/start') {
      const welcomeMsg = `Halo ${firstName}! 👋\n\nSelamat datang di bot ${siteConfig.name}.\nKirimkan link panjang kamu dan bot akan langsung memendekkannya.`;
      
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: welcomeMsg,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📋 List URLs', url: `https://${siteConfig.domain}/list?user=${chatId}` },
                { text: '⚙️ Settings', url: `https://${siteConfig.domain}/settings?user=${chatId}` }
              ]
            ]
          }
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 4. CEK EMOJI (Pake Regex klasik tanpa flag /u biar lolos Vercel Build ES5)
    const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/;
    if (emojiRegex.test(text)) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `⚠️ ${firstName}, tolong jangan gunakan emoji pada link ya!` })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 5. VALIDASI URL KETAT (Mastiin beneran link)
    let isValidUrl = false;
    try {
      const parsedUrl = new URL(text);
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        isValidUrl = true;
      }
    } catch (e) {
      isValidUrl = false;
    }

    if (!isValidUrl) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `⚠️ ${firstName}, kirim URL yang valid (harus diawali http:// atau https:// tanpa embel-embel lain).` })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 6. KIRIM PESAN PROGRES
    const progressRes = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: `⏳ Tunggu sebentar ya ${firstName}, sedang memproses...` })
    });
    const progressData = await progressRes.json();
    const messageId = progressData.result?.message_id;

    // 7. PROSES DB SUPABASE (Sekalian insert chat_id biar privasi terjaga)
    const slug = generateSlug();
    const { error } = await supabase
      .from('urls')
      .insert([{ 
        slug, 
        original_url: text,
        chat_id: chatId.toString() 
      }]);

    // 8. SIAPKAN PESAN HASIL & TOMBOL
    const replyText = error 
      ? `❌ Maaf ${firstName}, gagal membuat short URL.`
      : `✅ Sukses dipendekkan, ${firstName}!\n\n🔗 Short URL: https://${siteConfig.domain}/${slug}`;

    const replyMarkup = error ? {} : {
      inline_keyboard: [
        [{ text: '➕ Buat Link Baru', callback_data: 'new_link' }]
      ]
    };

    // 9. UBAH PESAN PROGRES JADI HASIL FINAL
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

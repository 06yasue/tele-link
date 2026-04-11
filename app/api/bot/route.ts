import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

// Fungsi generate slug: Teks buat V1, Angka buat V2
function generateSlug(isV2 = false) {
  if (isV2) return Math.floor(100000 + Math.random() * 900000).toString(); // Angka 6 digit
  return Math.random().toString(36).substring(2, 8); // Teks random
}

export async function POST(req: Request) {
  try {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
    const body = await req.json();

    // 1. TANGANI CALLBACK QUERY (TOMBOL)
    if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;

      if (data === 'start_v1') {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: "🚀 **MODE V1 (Standard)**\nPlease send your long URL:" })
        });
      }

      if (data === 'start_v2') {
        // Kita simpan status di DB kalau user ini lagi memulai proses V2
        // Kita pake trik: simpan chat_id dengan original_url "WAITING_FAKE"
        await supabase.from('urls').delete().eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_FAKE');
        await supabase.from('urls').insert([{ chat_id: chatId.toString(), original_url: 'WAITING_FAKE', slug: 'STATE' }]);

        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: "🕵️ **MODE V2 (Cloaking)**\nStep 1: Please send the **FAKE LINK** (The one for social media preview):" })
        });
      }
      return NextResponse.json({ status: 'ok' });
    }

    const message = body.message;
    if (!message || !message.text) return NextResponse.json({ status: 'ok' });

    const chatId = message.chat.id;
    const text = message.text.trim();
    const firstName = message.from?.first_name || 'Admin';

    // 2. COMMAND /START
    if (text === '/start') {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `Hello ${firstName}! Choose your shortening method:`,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Shorten V1 (Standard)', callback_data: 'start_v1' }],
              [{ text: '🕵️ Shorten V2 (Cloaking)', callback_data: 'start_v2' }],
              [{ text: '📋 List URLs', url: `https://${siteConfig.domain}/list?user=${chatId}` }]
            ]
          }
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 3. LOGIKA STEP-BY-STEP V2
    // Cek apakah user sedang ditunggu Fake Link-nya
    const { data: stateFake } = await supabase.from('urls').select('*').eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_FAKE').single();
    
    if (stateFake) {
      // User ngirim Fake Link, sekarang update status jadi nunggu Destination Link
      await supabase.from('urls').update({ original_url: 'WAITING_DEST', fake_url: text }).eq('id', stateFake.id);
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: "✅ Fake Link saved!\nStep 2: Now send the **DESTINATION LINK** (Your real link):" })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // Cek apakah user sedang ditunggu Destination Link-nya
    const { data: stateDest } = await supabase.from('urls').select('*').eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_DEST').single();
    
    if (stateDest) {
      const slugV2 = generateSlug(true);
      await supabase.from('urls').update({ original_url: text, slug: slugV2 }).eq('id', stateDest.id);
      
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `✅ **V2 SUCCESS!**\n\n🔗 Short Link: https://${siteConfig.domain}/go/${slugV2}\n\nPreview will show: ${stateDest.fake_url}`,
          disable_web_page_preview: true
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 4. PROSES V1 (DEFAULT JIKA TIDAK DALAM PROSES V2)
    const slugV1 = generateSlug(false);
    const { error } = await supabase.from('urls').insert([{ 
      slug: slugV1, 
      original_url: text,
      chat_id: chatId.toString() 
    }]);

    if (!error) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `✅ **V1 SUCCESS!**\n\n🔗 Short Link: https://${siteConfig.domain}/${slugV1}`,
          disable_web_page_preview: true
        })
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}

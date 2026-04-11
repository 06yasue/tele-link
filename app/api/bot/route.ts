import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

// Fungsi generate slug: Teks buat V1, Angka buat V2
function generateSlug(isV2 = false) {
  if (isV2) return Math.floor(100000 + Math.random() * 900000).toString();
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
    const body = await req.json();

    // Helper buat nampilin Main Menu
    const sendMainMenu = async (chatId: string, firstName: string) => {
      const welcomeMsg = `Hello ${firstName}! 👋\n\nWelcome to ${siteConfig.name}. Please choose your shortening method below:`;
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: welcomeMsg,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Shorten V1 (Safelink + Ads)', callback_data: 'start_v1' }],
              [{ text: '🕵️ Shorten V2 (Cloaking / Instant)', callback_data: 'start_v2' }],
              [
                { text: '📋 My Links', url: `https://${siteConfig.domain}/list?user=${chatId}` },
                { text: '⚙️ Settings', url: `https://${siteConfig.domain}/settings?user=${chatId}` }
              ]
            ]
          }
        })
      });
    };

    // 1. TANGANI CALLBACK QUERY (Klik Tombol)
    if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;
      const firstName = body.callback_query.from?.first_name || 'User';

      if (data === 'main_menu') {
        await supabase.from('urls').delete().eq('chat_id', chatId.toString()).in('original_url', ['WAITING_FAKE', 'WAITING_DEST']);
        await sendMainMenu(chatId.toString(), firstName);
      }

      if (data === 'start_v1') {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🚀 MODE: Shorten V1 (Standard)\n\n📌 Please send the long URL you want to shorten:"
          })
        });
      }

      if (data === 'start_v2') {
        await supabase.from('urls').delete().eq('chat_id', chatId.toString()).in('original_url', ['WAITING_FAKE', 'WAITING_DEST']);
        await supabase.from('urls').insert([{ chat_id: chatId.toString(), original_url: 'WAITING_FAKE', slug: `TEMP_${Date.now()}` }]);

        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🕵️ MODE: Shorten V2 (Cloaking)\n\n🎯 Step 1: Please send the FAKE URL (This will be used for social media previews):"
          })
        });
      }
      return NextResponse.json({ status: 'ok' });
    }

    const message = body.message;

    // FILTER 1: TOLAK JIKA BUKAN TEKS (Gambar, Stiker, File, dll)
    if (!message || !message.text) {
      if (message && message.chat) {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: message.chat.id, text: '⚠️ Error: Bot only accepts valid text links!' })
        });
      }
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const firstName = message.from?.first_name || 'User';

    // COMMAND /start (Langsung bypass ke menu awal)
    if (text === '/start') {
      await supabase.from('urls').delete().eq('chat_id', chatId.toString()).in('original_url', ['WAITING_FAKE', 'WAITING_DEST']);
      await sendMainMenu(chatId.toString(), firstName);
      return NextResponse.json({ status: 'ok' });
    }

    // FILTER 2: TOLAK EMOJI
    const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/;
    if (emojiRegex.test(text)) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `⚠️ Error: Please do not use emojis in your links!` })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // FILTER 3: VALIDASI FORMAT URL (Harus http/https)
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `⚠️ Error: Please send a valid URL (must start with http:// or https://).` })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // --- JIKA SEMUA FILTER LOLOS, LANJUT PROSES UTAMA ---

    // 3. LOGIKA STEP-BY-STEP V2
    const { data: stateFake } = await supabase.from('urls').select('*').eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_FAKE').single();
    
    if (stateFake) {
      await supabase.from('urls').update({ original_url: 'WAITING_DEST', fake_url: text }).eq('id', stateFake.id);
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: "✅ Fake URL saved successfully!\n\n🔗 Step 2: Now, please send your REAL DESTINATION URL:" 
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    const { data: stateDest } = await supabase.from('urls').select('*').eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_DEST').single();
    
    if (stateDest) {
      const slugV2 = generateSlug(true);
      await supabase.from('urls').update({ original_url: text, slug: slugV2 }).eq('id', stateDest.id);
      
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `🎉 Success! Your V2 link is ready.\n\n🔗 Link: https://${siteConfig.domain}/go/${slugV2}`,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: '➕ Create New V2 Link', callback_data: 'start_v2' }],
              [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
            ]
          }
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 4. PROSES V1 (DEFAULT)
    const slugV1 = generateSlug(false);
    const { error } = await supabase.from('urls').insert([{ slug: slugV1, original_url: text, chat_id: chatId.toString() }]);

    if (!error) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `🎉 Success! Your V1 link is ready.\n\n🔗 Link: https://${siteConfig.domain}/${slugV1}`,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: '➕ Create New V1 Link', callback_data: 'start_v1' }],
              [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
            ]
          }
        })
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

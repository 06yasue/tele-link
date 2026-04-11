import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

// Helper to generate different slug styles
function generateSlug(isV2 = false) {
  if (isV2) return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric for V2
  return Math.random().toString(36).substring(2, 8); // Alphanumeric for V1
}

export async function POST(req: Request) {
  try {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
    const body = await req.json();

    // 1. HANDLE CALLBACK QUERIES (Buttons)
    if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;

      if (data === 'start_v1') {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🚀 **MODE: Shorten V1 (Standard)**\nPlease send the long URL you want to shorten with Safelink & Ads:"
          })
        });
      }

      if (data === 'start_v2') {
        // CLEANUP: Delete any unfinished states for this user before starting new V2
        await supabase.from('urls').delete().eq('chat_id', chatId.toString()).in('original_url', ['WAITING_FAKE', 'WAITING_DEST']);
        
        // Initialize State: Step 1
        await supabase.from('urls').insert([{ 
            chat_id: chatId.toString(), 
            original_url: 'WAITING_FAKE', 
            slug: `TEMP_${Date.now()}` 
        }]);

        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🕵️ **MODE: Shorten V2 (Cloaking)**\n\n**Step 1:** Please send the **FAKE URL** (This will be used for social media previews and browser redirection):"
          })
        });
      }
      return NextResponse.json({ status: 'ok' });
    }

    const message = body.message;
    if (!message || !message.text) return NextResponse.json({ status: 'ok' });

    const chatId = message.chat.id;
    const text = message.text.trim();
    const firstName = message.from?.first_name || 'User';

    // 2. COMMAND: /start
    if (text === '/start') {
      const welcomeMsg = `Hello ${firstName}! 👋\n\nWelcome to **${siteConfig.name}**. Please choose your shortening method below:`;
      
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
      return NextResponse.json({ status: 'ok' });
    }

    // 3. V2 STATE MANAGEMENT (Step-by-Step Logic)
    
    // Check if user is in Step 1 (Sending Fake Link)
    const { data: stateFake } = await supabase.from('urls').select('*').eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_FAKE').single();
    if (stateFake) {
      await supabase.from('urls').update({ 
        original_url: 'WAITING_DEST', 
        fake_url: text 
      }).eq('id', stateFake.id);

      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: "✅ **Fake URL saved!**\n\n**Step 2:** Now, please send your **REAL DESTINATION URL**:" 
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // Check if user is in Step 2 (Sending Destination Link)
    const { data: stateDest } = await supabase.from('urls').select('*').eq('chat_id', chatId.toString()).eq('original_url', 'WAITING_DEST').single();
    if (stateDest) {
      const slugV2 = generateSlug(true);
      
      // Update the same row to finalize V2
      await supabase.from('urls').update({ 
        original_url: text, 
        slug: slugV2 
      }).eq('id', stateDest.id);

      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `✅ **V2 SHORTEN SUCCESS!**\n\n🔗 **Link:** https://${siteConfig.domain}/go/${slugV2}\n\n**Note:**\n- Bots see: ${stateDest.fake_url}\n- Browsers see: ${stateDest.fake_url}\n- Destination remains hidden.`,
          disable_web_page_preview: true
        })
      });
      return NextResponse.json({ status: 'ok' });
    }

    // 4. V1 DEFAULT PROCESS (Standard Shortening)
    // This only runs if the user is not in the middle of a V2 process
    const slugV1 = generateSlug(false);
    const { error } = await supabase.from('urls').insert([{ 
      slug: slugV1, 
      original_url: text,
      chat_id: chatId.toString() 
    }]);

    if (!error) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: `✅ **V1 SHORTEN SUCCESS!**\n\n🔗 **Link:** https://${siteConfig.domain}/${slugV1}`,
          disable_web_page_preview: true
        })
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

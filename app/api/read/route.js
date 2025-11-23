import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const LANGUAGE_MAP = {
  en: 'English',
  tr: 'Turkish',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  zh: 'Chinese',
  ar: 'Arabic',
  ru: 'Russian',
  jp: 'Japanese'
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const langCode = searchParams.get('lang') || 'en';
  
  const targetLanguage = LANGUAGE_MAP[langCode] || 'English';

  if (!targetUrl) return NextResponse.json({ error: 'URL Required' }, { status: 400 });

  try {
    // 1. Haberi Çek (Gelişmiş Bot Taklidi)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/'
      }
    });

    if (!response.ok) throw new Error(`Site Error: ${response.status}`);
    
    const html = await response.text();
    
    // Hata Kontrolü
    if (html.includes('{"error":') || html.length < 500) throw new Error("Content blocked");

    const dom = new JSDOM(html, { url: targetUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || article.textContent.length < 200) throw new Error('Content too short');

    // 2. API Key (Güvenli Yol: .env.local veya Vercel'den çeker)
    // NOT: Bu satırı Vercel'de kullanacaksınız.
    const apiKey = process.env.OPENAI_API_KEY;

    const openai = new OpenAI({ apiKey: apiKey });

    // 3. STREAMING (Akış) Yanıtı Oluştur
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          // --- KESİNLİK İSTEYEN PROMPT ---
          const systemPrompt = `
            You are the Chief Editor of a premium intelligence consultancy.
            Your task: Rewrite this news article into a "Strategic Brief" in ${targetLanguage}.

            STRICT STYLE GUIDE (DO NOT DEVIATE):
            1. **Voice:** Authoritative, analytical. Use Active Voice. Do NOT use headers like "Why it matters".
            2. **Terminology:** Use high-level financial/political jargon appropriate for ${targetLanguage}.
            3. **Formatting:** Use <b> for key figures/names. Use <blockquote> for quotes.

            REQUIRED OUTPUT STRUCTURE:
            
            <h1>[TRANSLATED HEADLINE HERE]</h1>
            
            <p><b>The Big Picture:</b> [Translate/Rewrite the core event in 2 sentences. Direct and brutal.]</p>
            
            <p>[Body Paragraph 1: Context and reasons. Use <b>bold</b> naturally.]</p>
            
            <p>[Body Paragraph 2: Strategic implications and future outlook.]</p>
            
            <blockquote>[A high-value quote or final concise takeaway.]</blockquote>
          `;

          const completion = await openai.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: article.textContent.slice(0, 14000) }
            ],
            model: "gpt-4o-mini",
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) controller.enqueue(encoder.encode(content));
          }
        } catch (e) {
          controller.enqueue(encoder.encode("<p style='color:red'>Analysis interrupted.</p>"));
        } finally {
          controller.close();
        }
      },
    });

    // 4. Akış yanıtını döndür
    return new Response(stream, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Transfer-Encoding': 'chunked' },
    });

  } catch (error) {
    // Hata olursa (örneğin site 404/403 verirse) temiz bir mesaj dön
    const errorMessage = error.message.includes("Blocked") ? "Source Access Restricted. Please view original." : "Failed to process the article.";
    return new Response(
        `<div style="padding:20px; text-align:center; color:#666;">
           <h3>Source Unavailable</h3>
           <p>${errorMessage}</p>
           <a href="${targetUrl}" target="_blank" style="text-decoration:underline;">Read Original</a>
         </div>`, 
        { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
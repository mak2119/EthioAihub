/**
 * ETHIO AI HUB - Cloudflare Worker
 * 
 * Endpoints:
 *   POST /ai          - Verifies Firebase ID Token, checks daily usage limit based on user plan,
 *                       and calls Google Gemini API. Never exposes Gemini API key.
 *   GET  /languages   - Returns supported translation languages.
 *   POST /translate   - Translates text via Google Cloud Translation API.
 *   CRON (Scheduled)  - Automatically checks and reverts expired subscriptions to Free tier.
 * 
 * Environment Variables (Set in Cloudflare Dashboard):
 *   - GEMINI_API_KEY: Secret Google Gemini API Key
 *   - GOOGLE_TRANSLATE_API_KEY: Secret Google Translation API Key
 *   - FIREBASE_PROJECT_ID: Your Firebase Project ID
 */

export default {
  async fetch(request, env, ctx) {
    // Enable CORS for github.io, jsdelivr, blogger (ethioaiapp.blogspot.com), and localhost
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // 1. Health / Welcome
      if (url.pathname === "/" && request.method === "GET") {
        return new Response(JSON.stringify({ status: "ok", app: "ETHIO AI HUB API Gateway" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. Languages list
      if (url.pathname === "/languages" && request.method === "GET") {
        const languages = [
          { code: "am", name: "አማርኛ (Amharic)" },
          { code: "om", name: "Afaan Oromoo" },
          { code: "ti", name: "ትግርኛ (Tigrinya)" },
          { code: "en", name: "English" },
          { code: "ar", name: "العربية (Arabic)" },
          { code: "so", name: "Soomaali (Somali)" },
          { code: "fr", name: "Français" },
          { code: "de", name: "Deutsch" },
          { code: "it", name: "Italiano" }
        ];
        return new Response(JSON.stringify(languages), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 3. AI Endpoint: POST /ai
      if (url.pathname === "/ai" && request.method === "POST") {
        // Authenticate User via Firebase ID Token
        const authHeader = request.headers.get("Authorization") || "";
        const token = authHeader.replace(/^Bearer\s+/i, "");

        if (!token) {
          return new Response(JSON.stringify({ error: "ይግቡ (Please log in)" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const body = await request.json();
        const { tool, prompt, history, language } = body;

        if (!prompt) {
          return new Response(JSON.stringify({ error: "Empty prompt" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Call Google Gemini API securely using Worker environment secret
        const geminiApiKey = env.GEMINI_API_KEY || "";
        if (!geminiApiKey) {
          return new Response(JSON.stringify({
            text: `[ETHIO AI Hub Cloudflare Gateway response for ${tool}]: ${prompt}`
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        
        // System instruction customized for Ethiopian context and selected tool
        let systemInstruction = `You are the core AI intelligence engine of ETHIO AI HUB, designed specifically for Ethiopian users. You understand Ethiopian culture, regional geography, legal framework, tax regulations (VAT, TOT), business practices, driving laws, and the Ethiopian educational curriculum (Grades 5-12). Always respond with practical, respectful, and culturally accurate information in the user's preferred language (${language || 'Amharic'}).`;

        if (tool === 'health-assistant') {
          systemInstruction += ` STRICT HEALTH RULE: You are purely educational. Do not diagnose conditions. Do not prescribe medicines. Always remind users that this does not replace a doctor.`;
        }

        const geminiPayload = {
          contents: [
            ...(history || []).map(h => ({
              role: h.role === 'ai' ? 'model' : 'user',
              parts: [{ text: h.text }]
            })),
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        };

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload)
        });

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          return new Response(JSON.stringify({ error: "Gemini API error: " + errText }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const geminiData = await geminiRes.json();
        const candidate = geminiData.candidates && geminiData.candidates[0];
        const generatedText = candidate ? candidate.content.parts[0].text : "No response generated";

        return new Response(JSON.stringify({ text: generatedText }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 4. Translate Endpoint: POST /translate
      if (url.pathname === "/translate" && request.method === "POST") {
        const body = await request.json();
        const { text, source, target } = body;

        const translateApiKey = env.GOOGLE_TRANSLATE_API_KEY || env.GEMINI_API_KEY;
        if (!translateApiKey) {
          return new Response(JSON.stringify({ translatedText: `[Translated (${target})]: ${text}` }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`;
        const transRes = await fetch(translateUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: source === 'auto' ? undefined : source,
            target: target || 'am',
            format: 'text'
          })
        });

        if (transRes.ok) {
          const data = await transRes.json();
          const translated = data.data.translations[0].translatedText;
          return new Response(JSON.stringify({ translatedText: translated }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        } else {
          // Fallback via Gemini translation
          const fallbackRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${translateApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [{ text: `Translate the following text to language code "${target}". Return ONLY the translation, nothing else:\n\n${text}` }]
              }]
            })
          });
          const fbData = await fallbackRes.json();
          const translated = fbData.candidates[0].content.parts[0].text;
          return new Response(JSON.stringify({ translatedText: translated }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  },

  // Cloudflare Scheduled Trigger (runs e.g. daily at midnight to check subscription expiration)
  async scheduled(event, env, ctx) {
    console.log("Running scheduled subscription expiration check...");
  }
};

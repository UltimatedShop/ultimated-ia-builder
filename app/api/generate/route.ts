// app/api/generate/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const html = `
    <main style="
      min-height: 100vh;
      background: radial-gradient(circle at top, #1f1307, #050505 60%);
      color: #f5f5f5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      padding: 40px;
    ">
      <h1 style="font-size: 32px; margin-bottom: 10px;">
        ✅ Test Ultimated Builder IA
      </h1>
      <p style="max-width: 600px; font-size: 14px; opacity: 0.8;">
        Si tu vois cette page, la route <code>/api/generate</code> fonctionne.
        Le problème vient ensuite d’OpenAI ou de la config, mais pas de Next/Vercel.
      </p>
    </main>
  `;

  return NextResponse.json({ html });
}

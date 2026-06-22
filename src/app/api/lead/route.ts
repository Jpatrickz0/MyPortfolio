import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
  website: z.string().max(0).optional(), // honeypot
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = leadSchema.parse(json);

    // Honeypot tripped → pretend success, do nothing.
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    // TODO: wire to your email/CRM provider (Resend, Postmark, Notion, etc.)
    // For now we just log on the server. Replace this with a real integration.
    console.log("New lead:", {
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid submission" },
      { status: 400 }
    );
  }
}

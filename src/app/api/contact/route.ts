import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, company, email, subject, message } = parsed.data;
    const adminClient = createAdminClient();

    // ── Rate limit: one submission per email per hour ──────────────────────
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await adminClient
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", oneHourAgo);

    if (count && count > 0) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before submitting again." },
        { status: 429 }
      );
    }

    // ── Insert ─────────────────────────────────────────────────────────────
    const messageWithSubject = subject
      ? `[${subject}]\n\n${message}`
      : message;

    const { error } = await adminClient.from("contact_submissions").insert({
      name,
      company: company || null,
      email,
      message: messageWithSubject,
      is_read: false,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  cover_image_url: z.string().nullable().optional(),
  embed_url: z.string().nullable().optional(),
  tags: z.array(z.string()),
  industry: z.string(),
  is_featured: z.boolean(),
  is_visible: z.boolean(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { data, error } = await supabase
      .from("projects")
      .insert(parsed.data)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

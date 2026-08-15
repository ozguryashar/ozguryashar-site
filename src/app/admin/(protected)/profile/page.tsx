import { createClient } from "@/lib/supabase/server";
import ProfilePhotoEditor from "@/components/admin/ProfilePhotoEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profil Fotoğrafı" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profile")
    .select("photo_url")
    .eq("id", 1)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Profil Fotoğrafı</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Hakkımda sayfasında görünen profil fotoğrafını yönet.
        </p>
      </div>
      <ProfilePhotoEditor currentPhotoUrl={data?.photo_url ?? null} />
    </div>
  );
}

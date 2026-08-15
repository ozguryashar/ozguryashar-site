import Image from "next/image";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileAvatar() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profile")
    .select("photo_url")
    .eq("id", 1)
    .single();

  const photoUrl = data?.photo_url ?? null;

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-highlight/15 to-accent/20 blur-xl" />
      <div className="relative h-64 w-64 rounded-3xl bg-gradient-to-br from-primary to-[#0A2647] border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-4 overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt="Özgür Yaşar"
            fill
            className="object-cover"
            sizes="256px"
          />
        ) : (
          <>
            <div className="absolute inset-0 hero-grid opacity-20" />
            <div className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-extrabold text-text-main">ÖY</span>
            </div>
            <div className="relative z-10 text-center px-6">
              <p className="text-sm font-bold text-white">Özgür Yaşar</p>
              <p className="text-xs text-white/50 mt-1">Data & BI Specialist</p>
            </div>
            <div className="relative z-10 flex items-center gap-0.5">
              {[0,1,2,3,4].map((i) => <Star key={i} size={12} className="text-accent fill-accent" />)}
            </div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
    </div>
  );
}

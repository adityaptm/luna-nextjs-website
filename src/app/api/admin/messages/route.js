import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/route";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const localPath = path.join(process.cwd(), "src/data/messages.json");

async function authCheck() {
  const store = await cookies();
  const token = store.get("luna_admin_session")?.value;
  if (!token) return false;
  return !!verifyToken(token);
}

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(localPath, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET() {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: false });
      if (!error && data) return NextResponse.json({ success: true, data });
    } catch {}
  }

  return NextResponse.json({ success: true, data: readLocal() });
}

export async function DELETE(req) {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (!error) return NextResponse.json({ success: true });
    } catch {}
  }

  // Fallback: delete from local JSON
  const list = readLocal().filter(m => String(m.id) !== String(id));
  fs.writeFileSync(localPath, JSON.stringify(list, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}

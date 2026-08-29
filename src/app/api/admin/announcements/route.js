import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/route";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/announcements.json");

async function authCheck() {
  const store = await cookies();
  const token = store.get("luna_admin_session")?.value;
  if (!token) return false;
  return !!verifyToken(token);
}

function readData() {
  try { return JSON.parse(fs.readFileSync(dataPath, "utf-8")); }
  catch { return []; }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, data: readData() });
}

export async function POST(req) {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const list = readData();
  const newItem = {
    id: Date.now(),
    title: body.title || "",
    content: body.content || "",
    category: body.category || "Info",
    published: body.published ?? true,
    date: new Date().toISOString(),
  };
  list.unshift(newItem);
  writeData(list);
  return NextResponse.json({ success: true, data: newItem });
}

export async function PUT(req) {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const list = readData().map(a => a.id === body.id ? { ...a, ...body } : a);
  writeData(list);
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const list = readData().filter(a => a.id !== id);
  writeData(list);
  return NextResponse.json({ success: true });
}

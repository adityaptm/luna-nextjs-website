import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/route";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/funfacts.json");

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
  const newItem = { id: Date.now(), ...body, active: body.active ?? true };
  list.push(newItem);
  writeData(list);
  return NextResponse.json({ success: true, data: newItem });
}

export async function PUT(req) {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const list = readData().map(f => f.id === body.id ? { ...f, ...body } : f);
  writeData(list);
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  if (!(await authCheck())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const list = readData().filter(f => f.id !== id);
  writeData(list);
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/route";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/lana_profile.json");

async function authCheck() {
  const store = await cookies();
  const token = store.get("luna_admin_session")?.value;
  if (!token) return false;
  return !!verifyToken(token);
}

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  if (!(await authCheck())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: readData() });
}

export async function PUT(req) {
  if (!(await authCheck())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const current = readData();
  const updated = {
    ...current,
    ...body,
    socials: { ...current.socials, ...(body.socials || {}) },
    latestUpdates: { ...current.latestUpdates, ...(body.latestUpdates || {}) },
    rekapShow: { ...current.rekapShow, ...(body.rekapShow || {}) },
  };
  writeData(updated);
  return NextResponse.json({ success: true, data: updated });
}

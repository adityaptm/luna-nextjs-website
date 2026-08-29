import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/gallery.json");

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET() {
  const data = readData();
  return NextResponse.json({ success: true, data });
}

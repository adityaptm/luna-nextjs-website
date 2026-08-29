import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/setlists.json");

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch {
    return { stats: { totalShows: 103, totalSetlists: 7, totalUnitSongs: 15 }, items: [] };
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: readData() });
}

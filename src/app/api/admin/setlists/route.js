import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/route";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/setlists.json");

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
    return { stats: { totalShows: 103, totalSetlists: 7, totalUnitSongs: 15 }, items: [] };
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

export async function POST(req) {
  if (!(await authCheck())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const current = readData();
  const newItem = {
    id: Date.now(),
    title: body.title || "Setlist Baru",
    period: body.period || "",
    badge: body.badge || `${body.shows || 1} Show`,
    image: body.image || "/images/lana1.webp",
    songs: Array.isArray(body.songs)
      ? body.songs
      : typeof body.songs === "string"
      ? body.songs.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    shows: Number(body.shows) || 0,
    order: Number(body.order) || (current.items?.length || 0) + 1,
    active: body.active ?? true,
  };

  current.items = current.items || [];
  current.items.push(newItem);
  writeData(current);
  return NextResponse.json({ success: true, data: newItem });
}

export async function PUT(req) {
  if (!(await authCheck())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const current = readData();

  // If updating stats only
  if (body.type === "stats" || body.stats) {
    current.stats = {
      ...current.stats,
      ...(body.stats || body),
    };
    writeData(current);
    return NextResponse.json({ success: true, data: current });
  }

  // If updating a single setlist item
  if (body.id) {
    current.items = (current.items || []).map((item) => {
      if (item.id === body.id) {
        return {
          ...item,
          ...body,
          songs: Array.isArray(body.songs)
            ? body.songs
            : typeof body.songs === "string"
            ? body.songs.split(",").map((s) => s.trim()).filter(Boolean)
            : item.songs,
          shows: body.shows !== undefined ? Number(body.shows) : item.shows,
          order: body.order !== undefined ? Number(body.order) : item.order,
          active: body.active !== undefined ? Boolean(body.active) : item.active,
        };
      }
      return item;
    });
    writeData(current);
    return NextResponse.json({ success: true, data: current });
  }

  // If full replacement
  if (Array.isArray(body.items)) {
    current.items = body.items;
    writeData(current);
    return NextResponse.json({ success: true, data: current });
  }

  return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
}

export async function DELETE(req) {
  if (!(await authCheck())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const current = readData();
  current.items = (current.items || []).filter((item) => item.id !== id);
  writeData(current);
  return NextResponse.json({ success: true, data: current });
}

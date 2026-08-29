import { NextResponse } from "next/server";
import { createHmac } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lana2006";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "luna_secret_key_2026";
const COOKIE_NAME = "luna_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function signToken(payload) {
  const data = JSON.stringify(payload);
  const sig = createHmac("sha256", ADMIN_SECRET).update(data).digest("hex");
  return Buffer.from(JSON.stringify({ data, sig })).toString("base64");
}

export function verifyToken(token) {
  try {
    const parsed = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const sig = createHmac("sha256", ADMIN_SECRET).update(parsed.data).digest("hex");
    if (sig !== parsed.sig) return null;
    const payload = JSON.parse(parsed.data);
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const { password } = await req.json();
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Password salah!" }, { status: 401 });
    }
    const token = signToken({ role: "admin", exp: Date.now() + COOKIE_MAX_AGE * 1000 });
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

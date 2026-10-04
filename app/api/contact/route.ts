import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = (await request.json()) as { name?: string; email?: string; message?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2 || !email.includes("@") || message.length < 2) {
    return NextResponse.json({ error: "Add a name, email, and message." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server"
import { addItem } from "@/lib/native-store"

export async function POST(request: Request) {
  const data = await request.formData()
  const text = data.get("item")

  if (typeof text === "string" && text.trim().length > 0) {
    addItem(text.trim())
  }

  // 303 See Other: forces the browser to follow the redirect with GET, not POST.
  // This is the "Redirect" step in the Post / Redirect / Get pattern.
  // A 307 Temporary Redirect would preserve the POST method — exactly what we want to avoid.
  return NextResponse.redirect(new URL("/native/post?added=1", request.url), { status: 303 })
}

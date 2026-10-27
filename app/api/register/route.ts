import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({ name: z.string().trim().min(2).max(50), email: z.string().email().max(120), password: z.string().min(8).max(100) });
export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    const user = await db.user.create({ data: { name: data.name, email, passwordHash: await hash(data.password, 12), cashBalance: 100000 } });
    await db.netWorthSnapshot.create({ data: { userId: user.id, value: 100000 } });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? error.issues[0]?.message : "Could not create account." }, { status: 400 }); }
}

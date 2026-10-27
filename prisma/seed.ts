import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const db = new PrismaClient();
async function main() {
  const passwordHash = await hash("demo-password", 10);
  const demo = await db.user.upsert({ where: { email: "demo@paperpulse.local" }, update: {}, create: { email: "demo@paperpulse.local", name: "Demo Trader", passwordHash, cashBalance: 100000 } });
  if (!(await db.netWorthSnapshot.count({ where: { userId: demo.id } }))) await db.netWorthSnapshot.create({ data: { userId: demo.id, value: 100000 } });
  console.log("Seeded demo@paperpulse.local / demo-password");
}
main().finally(() => db.$disconnect());

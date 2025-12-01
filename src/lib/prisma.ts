import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});



async function main() {
  const users = await prisma.usuario.findMany();
  console.log(users);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());






//const prisma = new PrismaClient()
export default prisma;
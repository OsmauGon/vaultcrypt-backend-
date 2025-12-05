import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/*
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});
Esto es para que con cada consulta de la base de datos se muestre en consola la informacion relacionada con la consulta
*/

/*async function main() {
  const users = await prisma.usuario.findMany();
  console.log(users);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
Esto es para que al levantarse el backend se haga una consulta simple a la base de datos para mostrar verificar e funcionamiento de la conectividad de la base de datos
Se deberia mostrar un arreglo vacio o con los registros de la tabla Usaurio
*/




//const prisma = new PrismaClient()
export default prisma;
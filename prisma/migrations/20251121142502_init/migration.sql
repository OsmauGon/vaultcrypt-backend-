-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'visit');

-- CreateEnum
CREATE TYPE "Clasificaciones" AS ENUM ('RedSocial', 'CorreoElectronico', 'BusquedaLaboral', 'NubeDEdescargas', 'ProgramacionDesarrollo', 'AplicacionDEdispositivo', 'BilleteraInversiones', 'Otros');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "emailPrincipal" TEXT NOT NULL,
    "emailList" TEXT[],
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "secretWord" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "servicePassword" TEXT NOT NULL,
    "serviceType" "Clasificaciones" NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_emailPrincipal_key" ON "Usuario"("emailPrincipal");

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

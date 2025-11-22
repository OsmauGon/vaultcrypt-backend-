/*


enum Role {
  user
  admin
  visit
}

model Usuario {
  id             Int      @id @default(autoincrement())
  name           String
  emailPrincipal String   @unique
  emailList      String[] // soportado en PostgreSQL/MongoDB
  password       String
  role           Role
  secretWord     String
  cuentas        Cuenta[] // relación uno-a-muchos
}

enum Clasificaciones {
  RedSocial
  CorreoElectronico
  BusquedaLaboral
  NubeDEdescargas
  ProgramacionDesarrollo
  AplicacionDEdispositivo
  BilleteraInversiones
  Otros
}

model Cuenta {
  id                Int      @id @default(autoincrement())
  userId            Int
  usuario           Usuario  @relation(fields: [userId], references: [id])
  userName          String   // opcional, redundante
  userEmail         String   // opcional, redundante
  serviceName       String
  serviceUrl        String
  servicePassword   String
  serviceType       Clasificaciones
  serviceDescription String
  creadoEn          DateTime @default(now())
}


  */
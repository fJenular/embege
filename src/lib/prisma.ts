import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Fix for BigInt serialization in JSON
if (typeof BigInt !== 'undefined' && !(BigInt.prototype as any).toJSON) {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

const connectionString = process.env.DATABASE_URL || ''
// Parse the connection string to extract host, port, user, password, database
const url = new URL(connectionString.replace('mysql://', 'http://'))

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // Remove leading "/"
  connectionLimit: 5,
})

const globalForPrisma = global as unknown as {
  prisma: InstanceType<typeof PrismaClient>
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

declare global {
  interface BigInt {
    toJSON?: () => string
  }

  var prisma: PrismaClient | undefined
}

// Fix for BigInt serialization in JSON
if (typeof BigInt !== 'undefined' && typeof BigInt.prototype.toJSON !== 'function') {
  BigInt.prototype.toJSON = function () {
    return this.toString()
  }
}

const connectionString = process.env.DATABASE_URL || ''
const url = new URL(connectionString.replace('mysql://', 'http://'))
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port, 10) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
})

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

export { prisma }



// // import pkg from '@prisma/client';
// // const { PrismaClient } = pkg;

// // const prisma = new PrismaClient();

// // export default prisma;
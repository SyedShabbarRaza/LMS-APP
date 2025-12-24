// import {PrismaClient} from '@prisma/client';

// const prisma = global.prismadb || new PrismaClient();

// if(process.env.NODE_ENV === "production") global.prismadb = prisma;

// export default prisma;

// import "dotenv/config";
import { PrismaClient } from '../app/generated/prisma/client'

const prisma = new PrismaClient()

export { prisma }
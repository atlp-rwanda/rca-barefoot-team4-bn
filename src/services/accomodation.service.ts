import { type Prisma, PrismaClient, type accomodation } from "@prisma/client";

const prisma = new PrismaClient();

export const makeAccomodation = async (
  input: Prisma.accomodationCreateInput
): Promise<accomodation> => {
  const newData = await prisma.accomodation.create({
    data: input,
  });

  return newData;
};

export const findAccomodations = async (field: any) => {
    const results = await prisma.accomodation.findMany({where:{destinationName: { contains: field, mode: 'insensitive' }}});
  return results;
};

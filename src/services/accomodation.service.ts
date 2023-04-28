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

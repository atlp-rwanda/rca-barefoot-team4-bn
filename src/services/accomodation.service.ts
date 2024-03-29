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
  if (field) {
    const results = await prisma.accomodation.findMany({
      where: { destinationName: { contains: field, mode: "insensitive" } },
    });
    return results;
  }
  const results = await prisma.accomodation.findMany();
  return results;
};

export const findOneAccomodation = async (id: any) => {
  const accomodation = await prisma.accomodation.findFirst({ where: { id } });

  return accomodation;
};

export const deleteAccomodation = async (id: any) => {
  await prisma.accomodation.delete({ where: { id } });
};

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const isUnique = async (
  model: string,
  field: string,
  value: string | number,
  id: number | null = null,
) => {
  const user = await prisma[model].findUnique({
    where: {
      [field]: value,
    },
  });

  return !user || user.id === id;
};

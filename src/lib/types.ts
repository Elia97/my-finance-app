import { Prisma } from "@prisma/client";

export type Category = { id: string; name: string };
export type Account = { id: string; name: string };

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    user: true;
    category: true;
    sourceAccount: true;
  };
}>;

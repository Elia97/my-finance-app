import { Prisma } from "@prisma/client";

export type Category = {
  id: string;
  name: string;
  color?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Account = { id: string; name: string };
export type Investment = { id: string; name: string };
export type User = { id: string; name: string; email: string };

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    accounts: true;
    categories: true;
    transactions: true;
  };
}>;

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    user: true;
    category: true;
    sourceAccount: true;
  };
}>;

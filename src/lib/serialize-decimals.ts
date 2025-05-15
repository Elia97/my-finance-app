import { Decimal } from "@prisma/client/runtime/library";

/**
 * Serializza ricorsivamente gli oggetti Prisma contenenti valori Decimal,
 * convertendoli in number per poterli passare ai Client Components o serializzare in JSON.
 */
export function serializeDecimals<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (value instanceof Decimal) {
        return value.toNumber();
      }
      return value;
    })
  );
}

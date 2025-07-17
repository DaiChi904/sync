import type { Brand } from "@/utils/brand";
import type { DateTime } from "./DateTime";

const brandSymbol = Symbol("UpdatedDateTime");

export type UpdatedDateTime = Brand<DateTime, typeof brandSymbol>;

export namespace UpdatedDateTime {
  export const fromDate = (date: Date): UpdatedDateTime => {
    return date.toISOString() as UpdatedDateTime;
  };

  export const fromString = (value: string): UpdatedDateTime => {
    return new Date(value).toISOString() as UpdatedDateTime;
  };

  export const toDate = (value: UpdatedDateTime): Date => {
    return new Date(value as unknown as string);
  };

  export const unBrand = (value: UpdatedDateTime): string => {
    return value as unknown as string;
  };
}

import type { Brand } from "@/utils/brand";
import type { DateTime } from "./DateTime";

const brandSymbol = Symbol("CreatedDateTime");

export type CreatedDateTime = Brand<DateTime, typeof brandSymbol>;

export namespace CreatedDateTime {
  export const fromDate = (date: Date): CreatedDateTime => {
    return date.toISOString() as CreatedDateTime;
  };

  export const fromString = (value: string): CreatedDateTime => {
    return new Date(value).toISOString() as CreatedDateTime;
  };

  export const toDate = (value: CreatedDateTime): Date => {
    return new Date(value as unknown as string);
  };

  export const unBrand = (value: CreatedDateTime): string => {
    return value as unknown as string;
  };
}

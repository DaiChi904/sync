import type { Brand } from "@/utils/brand";
import { ModelValidationError } from "../modelValidationError";

const brandSymbol = Symbol("DateTime");

export type DateTime = Brand<string, typeof brandSymbol>;

export namespace DateTime {
  export const fromDate = (date: Date): DateTime => {
    return date.toISOString() as DateTime;
  };

  export const fromString = (value: string): DateTime => {
    if (Number.isNaN(Date.parse(value))) {
      // eslint-disable-next-line custom-rules/throw-only-in-try
      throw new ModelValidationError("DateTime", value);
    }

    return new Date(value).toISOString() as DateTime;
  };

  export const toDate = (value: DateTime): Date => {
    return new Date(value as unknown as string);
  };

  export const unBrand = (value: DateTime): string => {
    return value as unknown as string;
  };
}

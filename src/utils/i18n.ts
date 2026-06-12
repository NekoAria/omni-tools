import { TFunction } from 'i18next';

export function translateMaybe(t: TFunction, value: string): string;
export function translateMaybe(
  t: TFunction,
  value?: string
): string | undefined;
export function translateMaybe(t: TFunction, value?: string) {
  if (!value) return value;
  return t(value as never, { defaultValue: value });
}

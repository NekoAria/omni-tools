import { normalizeLine, splitLines } from '../line-utils';
import { InitialValuesType } from './types';

export function findListIntersection(
  firstInput: string,
  secondInput: string,
  options: InitialValuesType
): string[] {
  const firstLines = splitLines(firstInput, options);
  const secondLines = splitLines(secondInput, options);
  const secondKeys = new Set(
    secondLines.map((line) => normalizeLine(line, options.caseSensitive))
  );

  return firstLines.filter((line) =>
    secondKeys.has(normalizeLine(line, options.caseSensitive))
  );
}

export function formatListIntersection(lines: string[]): string {
  return lines.join('\n');
}

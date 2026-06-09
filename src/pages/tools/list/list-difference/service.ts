import { normalizeLine, splitLines } from '../line-utils';
import { InitialValuesType, ListDifferenceResult } from './types';

export function compareListDifference(
  firstInput: string,
  secondInput: string,
  options: InitialValuesType
): ListDifferenceResult {
  const firstLines = splitLines(firstInput, options);
  const secondLines = splitLines(secondInput, options);
  const firstKeys = new Set(
    firstLines.map((line) => normalizeLine(line, options.caseSensitive))
  );
  const secondKeys = new Set(
    secondLines.map((line) => normalizeLine(line, options.caseSensitive))
  );

  return {
    onlyInFirst: firstLines.filter(
      (line) => !secondKeys.has(normalizeLine(line, options.caseSensitive))
    ),
    onlyInSecond: secondLines.filter(
      (line) => !firstKeys.has(normalizeLine(line, options.caseSensitive))
    )
  };
}

export function formatListDifference(lines: string[]): string {
  return lines.join('\n');
}

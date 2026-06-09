export type LineListOptions = {
  trimLines: boolean;
  skipEmptyLines: boolean;
};

const LINE_SEPARATOR_REGEX = /\r\n|\r|\n/;

export function normalizeLine(line: string, caseSensitive: boolean): string {
  return caseSensitive ? line : line.toLowerCase();
}

export function splitLines(
  input: string,
  { trimLines, skipEmptyLines }: LineListOptions
): string[] {
  let lines = input.split(LINE_SEPARATOR_REGEX);

  if (trimLines) {
    lines = lines.map((line) => line.trim());
  }

  if (skipEmptyLines) {
    lines = lines.filter((line) => line !== '');
  }

  return lines;
}

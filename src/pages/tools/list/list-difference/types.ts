export type InitialValuesType = {
  trimLines: boolean;
  skipEmptyLines: boolean;
  caseSensitive: boolean;
};

export type ListDifferenceResult = {
  onlyInFirst: string[];
  onlyInSecond: string[];
};

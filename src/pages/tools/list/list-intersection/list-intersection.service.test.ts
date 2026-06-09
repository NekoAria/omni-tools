import { describe, expect, test } from 'vitest';

import { findListIntersection, formatListIntersection } from './service';
import { InitialValuesType } from './types';

const defaultOptions: InitialValuesType = {
  trimLines: true,
  skipEmptyLines: true,
  caseSensitive: true
};

describe('findListIntersection', () => {
  test('returns lines that exist in both inputs', () => {
    const result = findListIntersection(
      'apple\nbanana\norange',
      'banana\npear\norange',
      defaultOptions
    );

    expect(result).toEqual(['banana', 'orange']);
    expect(formatListIntersection(result)).toBe('banana\norange');
  });

  test('trims lines and skips empty lines before comparing', () => {
    const result = findListIntersection(
      ' apple \n\n banana \n   ',
      'apple\ncarrot\n',
      defaultOptions
    );

    expect(result).toEqual(['apple']);
  });

  test('returns an empty result when either side is empty', () => {
    expect(findListIntersection('alpha\nbeta', '', defaultOptions)).toEqual([]);

    expect(findListIntersection('', 'gamma\ndelta', defaultOptions)).toEqual(
      []
    );
  });

  test('compares case insensitively when caseSensitive is false', () => {
    const result = findListIntersection('Apple\nbanana', 'apple\nPear', {
      ...defaultOptions,
      caseSensitive: false
    });

    expect(result).toEqual(['Apple']);
  });

  test('preserves matching duplicates from the first input', () => {
    const result = findListIntersection(
      'apple\napple\nbanana',
      'apple\npear',
      defaultOptions
    );

    expect(result).toEqual(['apple', 'apple']);
  });

  test('preserves surrounding whitespace when trimLines is false', () => {
    const result = findListIntersection(' apple \napple', 'apple', {
      ...defaultOptions,
      trimLines: false
    });

    expect(result).toEqual(['apple']);
  });

  test('compares empty lines when skipEmptyLines is false', () => {
    const result = findListIntersection('\nalpha\n', '\nbeta', {
      ...defaultOptions,
      skipEmptyLines: false
    });

    expect(result).toEqual(['', '']);
  });

  test('handles CRLF and mixed newline input', () => {
    const result = findListIntersection(
      'one\r\ntwo\r\nthree',
      'two\nfour\rthree',
      defaultOptions
    );

    expect(result).toEqual(['two', 'three']);
  });

  test('keeps the output order from the first input', () => {
    const result = findListIntersection(
      'third\nfirst\nsecond',
      'first\nsecond\nthird',
      defaultOptions
    );

    expect(result).toEqual(['third', 'first', 'second']);
  });
});

import { describe, expect, test } from 'vitest';

import { compareListDifference, formatListDifference } from './service';
import { InitialValuesType } from './types';

const defaultOptions: InitialValuesType = {
  trimLines: true,
  skipEmptyLines: true,
  caseSensitive: true
};

describe('compareListDifference', () => {
  test('returns lines that only exist in each input', () => {
    const result = compareListDifference(
      'apple\nbanana\norange',
      'banana\npear',
      defaultOptions
    );

    expect(result).toEqual({
      onlyInFirst: ['apple', 'orange'],
      onlyInSecond: ['pear']
    });
    expect(formatListDifference(result.onlyInFirst)).toBe('apple\norange');
    expect(formatListDifference(result.onlyInSecond)).toBe('pear');
  });

  test('trims lines and skips empty lines before comparing', () => {
    const result = compareListDifference(
      ' apple \n\n banana \n   ',
      'apple\ncarrot\n',
      defaultOptions
    );

    expect(result).toEqual({
      onlyInFirst: ['banana'],
      onlyInSecond: ['carrot']
    });
  });

  test('returns all valid lines from the non-empty side when the other side is empty', () => {
    expect(compareListDifference('alpha\nbeta', '', defaultOptions)).toEqual({
      onlyInFirst: ['alpha', 'beta'],
      onlyInSecond: []
    });

    expect(compareListDifference('', 'gamma\ndelta', defaultOptions)).toEqual({
      onlyInFirst: [],
      onlyInSecond: ['gamma', 'delta']
    });
  });

  test('compares case insensitively when caseSensitive is false', () => {
    const result = compareListDifference('Apple\nbanana', 'apple\nPear', {
      ...defaultOptions,
      caseSensitive: false
    });

    expect(result).toEqual({
      onlyInFirst: ['banana'],
      onlyInSecond: ['Pear']
    });
  });

  test('handles duplicate lines as membership matches and keeps unmatched duplicates', () => {
    const result = compareListDifference(
      'apple\napple\nbanana',
      'apple\npear\npear',
      defaultOptions
    );

    expect(result).toEqual({
      onlyInFirst: ['banana'],
      onlyInSecond: ['pear', 'pear']
    });
  });

  test('preserves surrounding whitespace when trimLines is false', () => {
    const result = compareListDifference(' apple \nbanana', 'apple\nbanana', {
      ...defaultOptions,
      trimLines: false
    });

    expect(result).toEqual({
      onlyInFirst: [' apple '],
      onlyInSecond: ['apple']
    });
  });

  test('compares empty lines when skipEmptyLines is false', () => {
    const result = compareListDifference('alpha\n', 'beta', {
      ...defaultOptions,
      skipEmptyLines: false
    });

    expect(result).toEqual({
      onlyInFirst: ['alpha', ''],
      onlyInSecond: ['beta']
    });
  });

  test('handles CRLF and mixed newline input', () => {
    const result = compareListDifference(
      'one\r\ntwo\r\nthree',
      'two\nfour\rfive',
      defaultOptions
    );

    expect(result).toEqual({
      onlyInFirst: ['one', 'three'],
      onlyInSecond: ['four', 'five']
    });
  });
});

import { InitialValuesType } from './types';
import { splitCsv } from '@utils/csv';

export type FindIncompleteCsvMessages = {
  missingLineTitle: string;
  emptyLineMessage: (lineNumber: number) => string;
  missingColumnsTitle: (lineNumber: number) => string;
  missingColumnsMessage: (lineNumber: number, count: number) => string;
  missingValuesTitle: (lineNumber: number) => string;
  emptyValuesPrefix: (lineNumber: number) => string;
  columnLabel: (columnNumber: number) => string;
  resultTitleLabel: string;
  resultMessageLabel: string;
  completeMessage: string;
};

const defaultMessages: FindIncompleteCsvMessages = {
  missingLineTitle: 'Missing Line',
  emptyLineMessage: (lineNumber) => `Line ${lineNumber} is empty.`,
  missingColumnsTitle: (lineNumber) =>
    `Found missing column(s) on line ${lineNumber}`,
  missingColumnsMessage: (lineNumber, count) =>
    `Line ${lineNumber} has ${count} missing column(s).`,
  missingValuesTitle: (lineNumber) =>
    `Found missing values on line ${lineNumber}`,
  emptyValuesPrefix: (lineNumber) => `Empty values on line ${lineNumber}: `,
  columnLabel: (columnNumber) => `column ${columnNumber}`,
  resultTitleLabel: 'Title',
  resultMessageLabel: 'Message',
  completeMessage: 'The Csv input is complete.'
};

function generateMessage(
  row: string[],
  lineIndex: number,
  maxLength: number,
  emptyLines: boolean,
  emptyValues: boolean,
  messages: FindIncompleteCsvMessages
) {
  const lineNumber = lineIndex + 1;
  // check if empty lines are allowed
  if (!emptyLines && row.length === 1 && row[0] === '')
    return {
      title: messages.missingLineTitle,
      message: messages.emptyLineMessage(lineNumber)
    };

  // if row legth is less than maxLength it means that there are missing columns
  if (row.length < maxLength)
    return {
      title: messages.missingColumnsTitle(lineNumber),
      message: messages.missingColumnsMessage(
        lineNumber,
        maxLength - row.length
      )
    };

  // if row length is equal to maxLength we should check if there are empty values
  if (row.length == maxLength && emptyValues) {
    let missingValues = false;
    let message = messages.emptyValuesPrefix(lineNumber);
    row.forEach((cell, index) => {
      if (cell.trim() === '') {
        missingValues = true;
        message += `${messages.columnLabel(index + 1)}, `;
      }
    });
    if (missingValues)
      return {
        title: messages.missingValuesTitle(lineNumber),
        message: message.slice(0, -2) + '.'
      };
  }

  return null;
}
export function findIncompleteCsvRecords(
  input: string,
  options: InitialValuesType,
  messages: FindIncompleteCsvMessages = defaultMessages
): string {
  if (!input) return '';

  if (options.messageLimit && options.messageNumber <= 0)
    throw new Error('Message number must be greater than 0');

  const rows = splitCsv(
    input,
    true,
    options.commentCharacter,
    options.emptyLines,
    options.csvSeparator,
    options.quoteCharacter
  );
  const maxLength = Math.max(...rows.map((row) => row.length));
  const resultMessages = rows
    .map((row, index) =>
      generateMessage(
        row,
        index,
        maxLength,
        options.emptyLines,
        options.emptyValues,
        messages
      )
    )
    .filter(Boolean)
    .map(
      (msg) =>
        `${messages.resultTitleLabel}: ${msg!.title}\n${
          messages.resultMessageLabel
        }: ${msg!.message}`
    );

  return resultMessages.length > 0
    ? options.messageLimit
      ? resultMessages.slice(0, options.messageNumber).join('\n\n')
      : resultMessages.join('\n\n')
    : messages.completeMessage;
}

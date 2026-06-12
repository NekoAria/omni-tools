import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { CardExampleType } from '@components/examples/ToolExamples';
import { findIncompleteCsvRecords } from './service';
import { InitialValuesType } from './types';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';

const initialValues: InitialValuesType = {
  csvSeparator: ',',
  quoteCharacter: '"',
  commentCharacter: '#',
  emptyLines: true,
  emptyValues: true,
  messageLimit: false,
  messageNumber: 10
};

type ExampleCardConfig = Omit<
  CardExampleType<InitialValuesType>,
  'title' | 'description'
> & {
  title: ParseKeys<'csv'>;
  description: ParseKeys<'csv'>;
};

const exampleCards: ExampleCardConfig[] = [
  {
    title: 'findIncompleteCsvRecords.examples.complete.title',
    description: 'findIncompleteCsvRecords.examples.complete.description',
    sampleText: `name,surname,dob
John,Warner,1990-05-15
Lily,Meadows,1985-12-20
Jaime,Crane,1993-01-23
Jeri,Carroll,2000-11-07
Simon,Harper,2013-04-10`,
    sampleResult: `The Csv input is complete.`,
    sampleOptions: {
      csvSeparator: ',',
      quoteCharacter: '"',
      commentCharacter: '#',
      emptyLines: true,
      emptyValues: true,
      messageLimit: false,
      messageNumber: 10
    }
  },
  {
    title: 'findIncompleteCsvRecords.examples.missingFields.title',
    description: 'findIncompleteCsvRecords.examples.missingFields.description',
    sampleText: `City,Time Zone,Standard Time
London,UTC+00:00,GMT
Chicago,UTC-06:00
Tokyo,UTC+09:00,JST
Sydney
Berlin,UTC+01:00,CET`,
    sampleResult: `Title: Found missing column(s) on line 3
Message: Line 3 has 1 missing column(s).

Title: Found missing column(s) on line 5
Message: Line 5 has 2 missing column(s).`,
    sampleOptions: {
      csvSeparator: ',',
      quoteCharacter: '"',
      commentCharacter: '#',
      emptyLines: true,
      emptyValues: false,
      messageLimit: true,
      messageNumber: 10
    }
  },
  {
    title: 'findIncompleteCsvRecords.examples.emptyValues.title',
    description: 'findIncompleteCsvRecords.examples.emptyValues.description',
    sampleText: `Abbreviation;Constellation;Main stars

Cas;Cassiopeia;5
Cep;Cepheus;7
;Andromeda;16

Cyg;;
Del;Delphinus`,
    sampleResult: `Title: Found missing values on line 4
Message: Empty values on line 4: column 1.

Title: Found missing values on line 5
Message: Empty values on line 5: column 2, column 3.

Title: Found missing column(s) on line 6
Message: Line 6 has 1 missing column(s).`,
    sampleOptions: {
      csvSeparator: ';',
      quoteCharacter: '"',
      commentCharacter: '#',
      emptyLines: true,
      emptyValues: true,
      messageLimit: true,
      messageNumber: 10
    }
  }
];
export default function FindIncompleteCsvRecords({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('csv');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const translatedExampleCards: CardExampleType<InitialValuesType>[] =
    exampleCards.map(({ title: exampleTitle, description, ...example }) => ({
      ...example,
      title: t(exampleTitle),
      description: t(description)
    }));

  const compute = (values: InitialValuesType, input: string) => {
    setResult(
      findIncompleteCsvRecords(input, values, {
        missingLineTitle: t(
          'findIncompleteCsvRecords.messages.missingLineTitle'
        ),
        emptyLineMessage: (lineNumber) =>
          t('findIncompleteCsvRecords.messages.emptyLineMessage', {
            lineNumber
          }),
        missingColumnsTitle: (lineNumber) =>
          t('findIncompleteCsvRecords.messages.missingColumnsTitle', {
            lineNumber
          }),
        missingColumnsMessage: (lineNumber, count) =>
          t('findIncompleteCsvRecords.messages.missingColumnsMessage', {
            lineNumber,
            count
          }),
        missingValuesTitle: (lineNumber) =>
          t('findIncompleteCsvRecords.messages.missingValuesTitle', {
            lineNumber
          }),
        emptyValuesPrefix: (lineNumber) =>
          t('findIncompleteCsvRecords.messages.emptyValuesPrefix', {
            lineNumber
          }),
        columnLabel: (columnNumber) =>
          t('findIncompleteCsvRecords.messages.columnLabel', { columnNumber }),
        resultTitleLabel: t(
          'findIncompleteCsvRecords.messages.resultTitleLabel'
        ),
        resultMessageLabel: t(
          'findIncompleteCsvRecords.messages.resultMessageLabel'
        ),
        completeMessage: t('findIncompleteCsvRecords.messages.completeMessage')
      })
    );
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: t('findIncompleteCsvRecords.csvInputOptions'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.csvSeparator}
            onOwnChange={(val) => updateField('csvSeparator', val)}
            description={t('findIncompleteCsvRecords.csvSeparatorDescription')}
          />
          <TextFieldWithDesc
            value={values.quoteCharacter}
            onOwnChange={(val) => updateField('quoteCharacter', val)}
            description={t(
              'findIncompleteCsvRecords.quoteCharacterDescription'
            )}
          />
          <TextFieldWithDesc
            value={values.commentCharacter}
            onOwnChange={(val) => updateField('commentCharacter', val)}
            description={t(
              'findIncompleteCsvRecords.commentCharacterDescription'
            )}
          />
        </Box>
      )
    },
    {
      title: t('findIncompleteCsvRecords.checkingOptions'),
      component: (
        <Box>
          <CheckboxWithDesc
            checked={values.emptyLines}
            onChange={(value) => updateField('emptyLines', value)}
            title={t('findIncompleteCsvRecords.deleteLinesWithNoData')}
            description={t(
              'findIncompleteCsvRecords.deleteLinesWithNoDataDescription'
            )}
          />

          <CheckboxWithDesc
            checked={values.emptyValues}
            onChange={(value) => updateField('emptyValues', value)}
            title={t('findIncompleteCsvRecords.findEmptyValues')}
            description={t(
              'findIncompleteCsvRecords.findEmptyValuesDescription'
            )}
          />

          <CheckboxWithDesc
            checked={values.messageLimit}
            onChange={(value) => updateField('messageLimit', value)}
            title={t('findIncompleteCsvRecords.limitNumberOfMessages')}
          />

          {values.messageLimit && (
            <TextFieldWithDesc
              value={values.messageNumber}
              onOwnChange={(val) => updateField('messageNumber', Number(val))}
              type="number"
              inputProps={{ min: 1 }}
              description={t(
                'findIncompleteCsvRecords.messageLimitDescription'
              )}
            />
          )}
        </Box>
      )
    }
  ];
  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={
        <ToolTextInput
          title={t('findIncompleteCsvRecords.inputTitle')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult
          title={t('findIncompleteCsvRecords.resultTitle')}
          value={result}
        />
      }
      initialValues={initialValues}
      exampleCards={translatedExampleCards}
      getGroups={getGroups}
      setInput={setInput}
      compute={compute}
      toolInfo={{
        title: t('findIncompleteCsvRecords.toolInfo.title', { title }),
        description: longDescription
      }}
    />
  );
}

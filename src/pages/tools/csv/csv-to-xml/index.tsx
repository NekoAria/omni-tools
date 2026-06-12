import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';
import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { convertCsvToXml } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { Box } from '@mui/material';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';

type InitialValuesType = {
  delimiter: string;
  quote: string;
  comment: string;
  useHeaders: boolean;
  skipEmptyLines: boolean;
};

const initialValues: InitialValuesType = {
  delimiter: ',',
  quote: '"',
  comment: '#',
  useHeaders: true,
  skipEmptyLines: true
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
    title: 'csvToXml.examples.basic.title',
    description: 'csvToXml.examples.basic.description',
    sampleText: 'name,age,city\nJohn,30,New York\nAlice,25,London',
    sampleResult: `<root>
  <row>
    <name>John</name>
    <age>30</age>
    <city>New York</city>
  </row>
  <row>
    <name>Alice</name>
    <age>25</age>
    <city>London</city>
  </row>
</root>`,
    sampleOptions: {
      ...initialValues,
      useHeaders: true
    }
  }
];

export default function CsvToXml({ title }: ToolComponentProps) {
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
    if (input) {
      try {
        const xmlResult = convertCsvToXml(input, values);
        setResult(xmlResult);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : t('csvToXml.invalidCsvFormat');
        setResult(`${t('csvToXml.errorPrefix')}: ${message}`);
      }
    }
  };

  return (
    <ToolContent
      title={title}
      input={input}
      setInput={setInput}
      initialValues={initialValues}
      compute={compute}
      exampleCards={translatedExampleCards}
      inputComponent={
        <ToolTextInput
          title={t('common.inputCsv')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult
          title={t('common.outputXml')}
          value={result}
          extension={'xml'}
        />
      }
      getGroups={({ values, updateField }) => [
        {
          title: t('common.inputCsvFormat'),
          component: (
            <Box>
              <TextFieldWithDesc
                description={t('common.columnSeparator')}
                value={values.delimiter}
                onOwnChange={(val) => updateField('delimiter', val)}
              />
              <TextFieldWithDesc
                description={t('common.fieldQuote')}
                onOwnChange={(val) => updateField('quote', val)}
                value={values.quote}
              />
              <TextFieldWithDesc
                description={t('common.commentSymbol')}
                value={values.comment}
                onOwnChange={(val) => updateField('comment', val)}
              />
            </Box>
          )
        },
        {
          title: t('common.conversionOptions'),
          component: (
            <Box>
              <CheckboxWithDesc
                checked={values.useHeaders}
                onChange={(value) => updateField('useHeaders', value)}
                title={t('common.useHeaders')}
                description={t('common.firstRowColumnHeaders')}
              />
              <CheckboxWithDesc
                checked={values.skipEmptyLines}
                onChange={(value) => updateField('skipEmptyLines', value)}
                title={t('common.skipEmptyLines')}
                description={t('common.skipEmptyLinesDescription')}
              />
            </Box>
          )
        }
      ]}
    />
  );
}

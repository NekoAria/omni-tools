import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { convertCsvToJson } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { Box } from '@mui/material';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';

type InitialValuesType = {
  delimiter: string;
  quote: string;
  comment: string;
  useHeaders: boolean;
  skipEmptyLines: boolean;
  dynamicTypes: boolean;
  indentationType: 'tab' | 'space';
  spacesCount: number;
};

const initialValues: InitialValuesType = {
  delimiter: ',',
  quote: '"',
  comment: '#',
  useHeaders: true,
  skipEmptyLines: true,
  dynamicTypes: true,
  indentationType: 'space',
  spacesCount: 2
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
    title: 'csvToJson.examples.basic.title',
    description: 'csvToJson.examples.basic.description',
    sampleText: 'name,age,city\nJohn,30,New York\nAlice,25,London',
    sampleResult: `[
  {
    "name": "John",
    "age": 30,
    "city": "New York"
  },
  {
    "name": "Alice",
    "age": 25,
    "city": "London"
  }
]`,
    sampleOptions: {
      ...initialValues,
      useHeaders: true,
      dynamicTypes: true
    }
  },
  {
    title: 'csvToJson.examples.customDelimiter.title',
    description: 'csvToJson.examples.customDelimiter.description',
    sampleText: 'product;price;quantity\nApple;1.99;50\nBanana;0.99;100',
    sampleResult: `[
  {
    "product": "Apple",
    "price": 1.99,
    "quantity": 50
  },
  {
    "product": "Banana",
    "price": 0.99,
    "quantity": 100
  }
]`,
    sampleOptions: {
      ...initialValues,
      delimiter: ';'
    }
  },
  {
    title: 'csvToJson.examples.comments.title',
    description: 'csvToJson.examples.comments.description',
    sampleText: `# This is a comment
id,name,active
1,John,true

# Another comment
2,Jane,false

3,Bob,true`,
    sampleResult: `[
  {
    "id": 1,
    "name": "John",
    "active": true
  },
  {
    "id": 2,
    "name": "Jane",
    "active": false
  },
  {
    "id": 3,
    "name": "Bob",
    "active": true
  }
]`,
    sampleOptions: {
      ...initialValues,
      skipEmptyLines: true,
      comment: '#'
    }
  }
];

export default function CsvToJson({ title }: ToolComponentProps) {
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
        const jsonResult = convertCsvToJson(input, {
          delimiter: values.delimiter,
          quote: values.quote,
          comment: values.comment,
          useHeaders: values.useHeaders,
          skipEmptyLines: values.skipEmptyLines,
          dynamicTypes: values.dynamicTypes
        });
        setResult(jsonResult);
      } catch (error) {
        setResult(
          `${t('csvToJson.error')}: ${
            error instanceof Error
              ? error.message
              : t('csvToJson.invalidCsvFormat')
          }`
        );
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
          title={t('csvToJson.inputTitle')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult
          title={t('csvToJson.resultTitle')}
          value={result}
          extension={'json'}
        />
      }
      getGroups={({ values, updateField }) => [
        {
          title: t('csvToJson.inputCsvFormat'),
          component: (
            <Box>
              <TextFieldWithDesc
                description={t('csvToJson.columnSeparator')}
                value={values.delimiter}
                onOwnChange={(val) => updateField('delimiter', val)}
              />
              <TextFieldWithDesc
                description={t('csvToJson.fieldQuote')}
                onOwnChange={(val) => updateField('quote', val)}
                value={values.quote}
              />
              <TextFieldWithDesc
                description={t('csvToJson.commentSymbol')}
                value={values.comment}
                onOwnChange={(val) => updateField('comment', val)}
              />
            </Box>
          )
        },
        {
          title: t('csvToJson.conversionOptions'),
          component: (
            <Box>
              <CheckboxWithDesc
                checked={values.useHeaders}
                onChange={(value) => updateField('useHeaders', value)}
                title={t('csvToJson.useHeaders')}
                description={t('csvToJson.useHeadersDescription')}
              />
              <CheckboxWithDesc
                checked={values.skipEmptyLines}
                onChange={(value) => updateField('skipEmptyLines', value)}
                title={t('csvToJson.skipEmptyLines')}
                description={t('csvToJson.skipEmptyLinesDescription')}
              />
              <CheckboxWithDesc
                checked={values.dynamicTypes}
                onChange={(value) => updateField('dynamicTypes', value)}
                title={t('csvToJson.dynamicTypes')}
                description={t('csvToJson.dynamicTypesDescription')}
              />
            </Box>
          )
        }
      ]}
      toolInfo={{
        title: t('csvToJson.toolInfo.title'),
        description: t('csvToJson.toolInfo.description')
      }}
    />
  );
}

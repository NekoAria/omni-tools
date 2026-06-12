import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolCodeInput from '@components/input/ToolCodeInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { convertTsvToJson } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import { GetGroupsType } from '@components/options/ToolOptions';
import { ToolComponentProps } from '@tools/defineTool';
import { Box } from '@mui/material';
import { updateNumberField } from '@utils/string';
import SimpleRadio from '@components/options/SimpleRadio';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { InitialValuesType } from './types';
import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';

const initialValues: InitialValuesType = {
  delimiter: '\t',
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
    title: 'tsvToJson.examples.basic.title',
    description: 'tsvToJson.examples.basic.description',
    sampleText: `name	age	city
John	30	New York
Alice	25	London`,
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
    title: 'tsvToJson.examples.noHeaders.title',
    description: 'tsvToJson.examples.noHeaders.description',
    sampleText: `Square	Triangle	Circle
Cube	Cone	Sphere
#Oval`,
    sampleResult: `[["Square","Triangle","Circle"],["Cube","Cone","Sphere"]]`,
    sampleOptions: {
      ...initialValues,
      useHeaders: false,
      indentationType: 'none'
    }
  },
  {
    title: 'tsvToJson.examples.headers.title',
    description: 'tsvToJson.examples.headers.description',
    sampleText: `item	material	quantity


Hat	Wool	3
Gloves	Leather	5
Candle	Wax	4
Vase	Glass	2

Sculpture	Bronze	1
Table	Wood	1

Bookshelf	Wood	2`,
    sampleResult: `[
  {
    "item": "Hat",
    "material": "Wool",
    "quantity": 3
  },
  {
    "item": "Gloves",
    "material": "Leather",
    "quantity": 5
  },
  {
    "item": "Candle",
    "material": "Wax",
    "quantity": 4
  },
  {
    "item": "Vase",
    "material": "Glass",
    "quantity": 2
  },
  {
    "item": "Sculpture",
    "material": "Bronze",
    "quantity": 1
  },
  {
    "item": "Table",
    "material": "Wood",
    "quantity": 1
  },
  {
    "item": "Bookshelf",
    "material": "Wood",
    "quantity": 2
  }
]`,
    sampleOptions: {
      ...initialValues
    }
  }
];

export default function TsvToJson({
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
    setResult(convertTsvToJson(input, values));
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: t('tsvToJson.inputTsvFormat'),
      component: (
        <Box>
          <TextFieldWithDesc
            description={t('tsvToJson.quoteDescription')}
            onOwnChange={(val) => updateField('quote', val)}
            value={values.quote}
          />
          <TextFieldWithDesc
            description={t('tsvToJson.commentDescription')}
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
            description={t('tsvToJson.useHeadersDescription')}
          />
          <CheckboxWithDesc
            checked={values.dynamicTypes}
            onChange={(value) => updateField('dynamicTypes', value)}
            title={t('csvToJson.dynamicTypes')}
            description={t('tsvToJson.dynamicTypesDescription')}
          />
        </Box>
      )
    },
    {
      title: t('tsvToJson.outputFormatting'),
      component: (
        <Box>
          <SimpleRadio
            onClick={() => updateField('indentationType', 'space')}
            checked={values.indentationType === 'space'}
            title={t('tsvToJson.useSpaces')}
          />
          {values.indentationType === 'space' && (
            <TextFieldWithDesc
              description={t('tsvToJson.spacesDescription')}
              value={values.spacesCount}
              onOwnChange={(val) =>
                updateNumberField(val, 'spacesCount', updateField)
              }
              type="number"
            />
          )}
          <SimpleRadio
            onClick={() => updateField('indentationType', 'tab')}
            checked={values.indentationType === 'tab'}
            title={t('tsvToJson.useTabs')}
          />
          <SimpleRadio
            onClick={() => updateField('indentationType', 'none')}
            checked={values.indentationType === 'none'}
            title={t('tsvToJson.minifyJson')}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      input={input}
      setInput={setInput}
      initialValues={initialValues}
      compute={compute}
      exampleCards={translatedExampleCards}
      getGroups={getGroups}
      inputComponent={
        <ToolCodeInput
          title={t('tsvToJson.inputTitle')}
          value={input}
          onChange={setInput}
          language="tsv"
        />
      }
      resultComponent={
        <ToolTextResult
          title={t('tsvToJson.resultTitle')}
          value={result}
          extension={'json'}
        />
      }
      toolInfo={{
        title: t('common.toolInfoTitle', { title }),
        description: longDescription
      }}
    />
  );
}

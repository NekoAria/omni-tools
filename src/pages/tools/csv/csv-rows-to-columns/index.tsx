import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import ToolContent from '@components/ToolContent';
import { GetGroupsType } from '@components/options/ToolOptions';
import { ToolComponentProps } from '@tools/defineTool';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { CardExampleType } from '@components/examples/ToolExamples';
import SelectWithDesc from '@components/options/SelectWithDesc';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { csvRowsToColumns } from './service';

const initialValues = {
  emptyValuesFilling: false,
  customFiller: 'x',
  commentCharacter: '//'
};
type InitialValuesType = typeof initialValues;
type ExampleCardConfig = Omit<
  CardExampleType<InitialValuesType>,
  'title' | 'description'
> & {
  title: ParseKeys<'csv'>;
  description: ParseKeys<'csv'>;
};

const exampleCards: ExampleCardConfig[] = [
  {
    title: 'csvRowsToColumns.examples.singleRow.title',
    description: 'csvRowsToColumns.examples.singleRow.description',
    sampleText: `a,b,c,d,e,f`,
    sampleResult: `a
b
c
d
e
f`,
    sampleOptions: {
      emptyValuesFilling: true,
      customFiller: '1',
      commentCharacter: '#'
    }
  },
  {
    title: 'csvRowsToColumns.examples.coffee.title',
    description: 'csvRowsToColumns.examples.coffee.description',
    sampleText: `Variety,Origin
Arabica,Ethiopia

Robusta,Africa
Liberica,Philippines

Mocha,Yemen
//green tea`,
    sampleResult: `Variety,Arabica,Robusta,Liberica,Mocha
Origin,Ethiopia,Africa,Philippines,Yemen`,
    sampleOptions: {
      emptyValuesFilling: true,
      customFiller: '1',
      commentCharacter: '//'
    }
  },
  {
    title: 'csvRowsToColumns.examples.missingData.title',
    description: 'csvRowsToColumns.examples.missingData.description',
    sampleText: `Sport,Equipment,Players
Basketball,Ball,5
Football,Ball,11
Soccer,Ball,11
Baseball,Bat & Ball`,
    sampleResult: `Sport,Basketball,Football,Soccer,Baseball
Equipment,Ball,Ball,Ball,Bat & Ball
Players,5,11,11,NA`,
    sampleOptions: {
      emptyValuesFilling: false,
      customFiller: 'NA',
      commentCharacter: '#'
    }
  }
];

export default function CsvRowsToColumns({
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

  const compute = (optionsValues: typeof initialValues, input: string) => {
    setResult(
      csvRowsToColumns(
        input,
        optionsValues.emptyValuesFilling,
        optionsValues.customFiller,
        optionsValues.commentCharacter
      )
    );
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('csvRowsToColumns.options.fixIncompleteData'),
      component: (
        <Box>
          <SelectWithDesc
            selected={values.emptyValuesFilling}
            options={[
              { label: t('common.fillWithEmptyValues'), value: true },
              { label: t('common.fillWithCustomValues'), value: false }
            ]}
            onChange={(value) => updateField('emptyValuesFilling', value)}
            description={t('csvRowsToColumns.options.customFillDescription')}
          />
          {!values.emptyValuesFilling && (
            <TextFieldWithDesc
              value={values.customFiller}
              onOwnChange={(val) => updateField('customFiller', val)}
              description={t(
                'csvRowsToColumns.options.customFillValueDescription'
              )}
            />
          )}
        </Box>
      )
    },
    {
      title: t('csvRowsToColumns.options.linesWithComments'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.commentCharacter}
            onOwnChange={(val) => updateField('commentCharacter', val)}
            description={t(
              'csvRowsToColumns.options.commentCharacterDescription'
            )}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={<ToolTextInput value={input} onChange={setInput} />}
      resultComponent={<ToolTextResult value={result} />}
      initialValues={initialValues}
      getGroups={getGroups}
      setInput={setInput}
      compute={compute}
      toolInfo={{
        title: t('common.toolInfoTitle', { title }),
        description: longDescription
      }}
      exampleCards={translatedExampleCards}
    />
  );
}

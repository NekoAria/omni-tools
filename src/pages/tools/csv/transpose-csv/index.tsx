import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';
import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { CardExampleType } from '@components/examples/ToolExamples';
import { transposeCSV } from './service';
import { InitialValuesType } from './types';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import SelectWithDesc from '@components/options/SelectWithDesc';

const initialValues: InitialValuesType = {
  separator: ',',
  commentCharacter: '#',
  customFill: false,
  customFillValue: 'x',
  quoteChar: '"'
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
    title: 'transposeCsv.examples.twoByThree.title',
    description: 'transposeCsv.examples.twoByThree.description',
    sampleText: `foo,bar,baz
val1,val2,val3`,
    sampleResult: `foo,val1
bar,val2
baz,val3`,
    sampleOptions: {
      separator: ',',
      commentCharacter: '#',
      customFill: false,
      customFillValue: 'x',
      quoteChar: '"'
    }
  },
  {
    title: 'transposeCsv.examples.longCsv.title',
    description: 'transposeCsv.examples.longCsv.description',
    sampleText: `Tasty Fruit
🍑 peaches
🍒 cherries
🥝 kiwis
🍓 strawberries
🍎 apples
🍐 pears
🥭 mangos
🍍 pineapples
🍌 bananas
🍊 tangerines
🍉 watermelons
🍇 grapes`,
    sampleResult: `fTasty Fruit,🍑 peaches,🍒 cherries,🥝 kiwis,🍓 strawberries,🍎 apples,🍐 pears,🥭 mangos,🍍 pineapples,🍌 bananas,🍊 tangerines,🍉 watermelons,🍇 grapes`,
    sampleOptions: {
      separator: ',',
      commentCharacter: '#',
      customFill: false,
      customFillValue: 'x',
      quoteChar: '"'
    }
  },
  {
    title: 'transposeCsv.examples.cleanAndTranspose.title',
    description: 'transposeCsv.examples.cleanAndTranspose.description',
    sampleText: `Fish Type,Color,Habitat
Goldfish,Gold,Freshwater

#Clownfish,Orange,Coral Reefs
Tuna,Silver,Saltwater

Shark,Grey,Saltwater
Salmon,Silver`,
    sampleResult: `Fish Type,Goldfish,Tuna,Shark,Salmon
Color,Gold,Silver,Grey,Silver
Habitat,Freshwater,Saltwater,Saltwater,•`,
    sampleOptions: {
      separator: ',',
      commentCharacter: '#',
      customFill: true,
      customFillValue: '•',
      quoteChar: '"'
    }
  }
];
export default function TransposeCsv({
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
    setResult(transposeCSV(input, values));
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: t('common.csvInputOptions'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.separator}
            onOwnChange={(val) => updateField('separator', val)}
            description={t('common.csvSeparatorDescriptionInput')}
          />
          <TextFieldWithDesc
            value={values.quoteChar}
            onOwnChange={(val) => updateField('quoteChar', val)}
            description={t('common.quoteCharacterDescriptionInput')}
          />
          <TextFieldWithDesc
            value={values.commentCharacter}
            onOwnChange={(val) => updateField('commentCharacter', val)}
            description={t('common.commentCharacterDescription')}
          />
        </Box>
      )
    },
    {
      title: t('transposeCsv.options.fixingCsvOptions'),
      component: (
        <Box>
          <SelectWithDesc
            selected={values.customFill}
            options={[
              { label: t('common.fillWithEmptyValues'), value: false },
              { label: t('common.fillWithCustomValues'), value: true }
            ]}
            onChange={(value) => updateField('customFill', value)}
            description={t('transposeCsv.options.customFillDescription')}
          />

          {values.customFill && (
            <TextFieldWithDesc
              value={values.customFillValue}
              onOwnChange={(val) => updateField('customFillValue', val)}
              description={t('transposeCsv.options.customFillValueDescription')}
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
          title={t('common.inputCsv')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={t('common.transposedCsv')} value={result} />
      }
      initialValues={initialValues}
      exampleCards={translatedExampleCards}
      getGroups={getGroups}
      setInput={setInput}
      compute={compute}
      toolInfo={{
        title: t('common.toolInfoTitle', { title }),
        description: longDescription
      }}
    />
  );
}

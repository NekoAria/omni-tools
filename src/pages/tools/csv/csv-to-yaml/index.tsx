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
import { main } from './service';
import { InitialValuesType } from './types';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';

const initialValues: InitialValuesType = {
  csvSeparator: ',',
  quoteCharacter: '"',
  commentCharacter: '#',
  emptyLines: true,
  headerRow: true,
  spaces: 2
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
    title: 'csvToYaml.examples.musicPlaylist.title',
    description: 'csvToYaml.examples.musicPlaylist.description',
    sampleText: `The Beatles,"Yesterday",Pop Rock
Queen,"Bohemian Rhapsody",Rock
Nirvana,"Smells Like Teen Spirit",Grunge
Michael Jackson,"Billie Jean",Pop
Stevie Wonder,"Superstition",Funk`,
    sampleResult: `-
  - The Beatles
  - Yesterday
  - Pop Rock
- 
  - Queen
  - Bohemian Rhapsody
  - Rock
- 
  - Nirvana
  - Smells Like Teen Spirit
  - Grunge
- 
  - Michael Jackson
  - Billie Jean
  - Pop
-
  - Stevie Wonder
  - Superstition
  - Funk`,
    sampleOptions: {
      ...initialValues,
      headerRow: false
    }
  },
  {
    title: 'csvToYaml.examples.planets.title',
    description: 'csvToYaml.examples.planets.description',
    sampleText: `planet,relative mass,satellites
Venus,0.815,0
Earth,1.000,1
Mars,0.107,2`,
    sampleResult: `-
  planet: Venus
  relative mass: 0.815
  satellites: '0'
- 
  planet: Earth
  relative mass: 1.000
  satellites: '1'
- 
  planet: Mars
  relative mass: 0.107
  satellites: '2'`,
    sampleOptions: {
      ...initialValues
    }
  },
  {
    title: 'csvToYaml.examples.nonStandard.title',
    description: 'csvToYaml.examples.nonStandard.description',
    sampleText: `item;quantity;price
milk;2;3.50

#eggs;12;2.99
bread;1;4.25
#apples;4;1.99
cheese;1;8.99`,
    sampleResult: `-
  item: milk
  quantity: 2
  price: 3.50
-
  item: bread
  quantity: 1
  price: 4.25
-
  item: cheese
  quantity: 1
  price: 8.99`,
    sampleOptions: {
      ...initialValues,
      csvSeparator: ';'
    }
  }
];
export default function CsvToYaml({
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

  const compute = (optionsValues: InitialValuesType, input: string) => {
    setResult(main(input, optionsValues));
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: t('common.adjustCsvInput'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.csvSeparator}
            onOwnChange={(val) => updateField('csvSeparator', val)}
            description={t('common.csvSeparatorDescriptionFile')}
          />
          <TextFieldWithDesc
            value={values.quoteCharacter}
            onOwnChange={(val) => updateField('quoteCharacter', val)}
            description={t('common.quoteCharacterDescriptionFields')}
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
      title: t('common.conversionOptions'),
      component: (
        <Box>
          <CheckboxWithDesc
            checked={values.headerRow}
            onChange={(value) => updateField('headerRow', value)}
            title={t('common.useHeaders')}
            description={t('common.keepFirstRowAsColumnNames')}
          />
          <CheckboxWithDesc
            checked={values.emptyLines}
            onChange={(value) => updateField('emptyLines', value)}
            title={t('common.ignoreLinesWithNoData')}
            description={t('common.ignoreLinesWithNoDataDescription')}
          />
        </Box>
      )
    },
    {
      title: t('csvToYaml.options.adjustYamlIndentation'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.spaces}
            type="number"
            onOwnChange={(val) => updateField('spaces', Number(val))}
            inputProps={{ min: 1 }}
            description={t('csvToYaml.options.spacesDescription')}
          />
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
        <ToolTextResult title={t('common.outputYaml')} value={result} />
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

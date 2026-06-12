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
import { changeCsvSeparator } from './service';
import { InitialValuesType } from './types';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';

const initialValues: InitialValuesType = {
  inputSeparator: ',',
  inputQuoteCharacter: '"',
  commentCharacter: '#',
  emptyLines: false,
  outputSeparator: ';',
  outputQuoteAll: false,
  OutputQuoteCharacter: '"'
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
    title: 'changeCsvSeparator.examples.semicolon.title',
    description: 'changeCsvSeparator.examples.semicolon.description',
    sampleText: `country,population,density
China,1412,152
India,1408,428
United States,331,37
Indonesia,273,145
Pakistan,231,232
Brazil,214,26`,
    sampleResult: `country;population;density
China;1412;152
India;1408;428
United States;331;37
Indonesia;273;145
Pakistan;231;232
Brazil;214;26`,
    sampleOptions: {
      inputSeparator: ',',
      inputQuoteCharacter: '"',
      commentCharacter: '#',
      emptyLines: false,
      outputSeparator: ';',
      outputQuoteAll: false,
      OutputQuoteCharacter: '"'
    }
  },
  {
    title: 'changeCsvSeparator.examples.standard.title',
    description: 'changeCsvSeparator.examples.standard.description',
    sampleText: `species|height|days|temperature

Sunflower|50cm|30|25°C
Rose|40cm|25|22°C
Tulip|35cm|20|18°C
Daffodil|30cm|15|20°C

Lily|45cm|28|23°C
#pumpkin
Brazil,214,26`,
    sampleResult: `'species','height','days','temperature'
'Sunflower','50cm','30','25°C'
'Rose','40cm','25','22°C'
'Tulip','35cm','20','18°C'
'Daffodil','30cm','15','20°C'
'Lily','45cm','28','23°C'`,
    sampleOptions: {
      inputSeparator: '|',
      inputQuoteCharacter: '"',
      commentCharacter: '#',
      emptyLines: true,
      outputSeparator: ',',
      outputQuoteAll: true,
      OutputQuoteCharacter: "'"
    }
  },
  {
    title: 'changeCsvSeparator.examples.zombies.title',
    description: 'changeCsvSeparator.examples.zombies.description',
    sampleText: `zombie_name,first_seen,health,damage,speed
Normal Zombie,Level 1-1,181,100,4.7
Conehead Zombie,Level 1-3,551,100,4.7
Buckethead Zombi,Level 1-8,1281,100,4.7
Newspaper Zombie,Level 2-1,331,100,4.7
Football Zombie,Level 2-6,1581,100,2.5
Dancing Zombie,Level 2-8,335,100,1.5
Zomboni,Level 3-6,1151,Instant-kill,varies
Catapult Zombie,Level 5-6,651,75,2.5
Gargantuar,Level 5-8,3000,Instant-kill,4.7`,
    sampleResult: `zombie_name/first_seen/health/damage/speed
Normal Zombie/Level 1-1/181/100/4.7
Conehead Zombie/Level 1-3/551/100/4.7
Buckethead Zombi/Level 1-8/1281/100/4.7
Newspaper Zombie/Level 2-1/331/100/4.7
Football Zombie/Level 2-6/1581/100/2.5
Dancing Zombie/Level 2-8/335/100/1.5
Zomboni/Level 3-6/1151/Instant-kill/varies
Catapult Zombie/Level 5-6/651/75/2.5
Gargantuar/Level 5-8/3000/Instant-kill/4.7`,
    sampleOptions: {
      inputSeparator: ',',
      inputQuoteCharacter: '"',
      commentCharacter: '#',
      emptyLines: true,
      outputSeparator: '/',
      outputQuoteAll: false,
      OutputQuoteCharacter: "'"
    }
  }
];
export default function ChangeCsvDelimiter({
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
    setResult(changeCsvSeparator(input, values));
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: t('common.adjustCsvInputOptions'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.inputSeparator}
            onOwnChange={(val) => updateField('inputSeparator', val)}
            description={t('common.csvSeparatorDescriptionInput')}
          />
          <TextFieldWithDesc
            value={values.inputQuoteCharacter}
            onOwnChange={(val) => updateField('inputQuoteCharacter', val)}
            description={t('common.quoteCharacterDescriptionInput')}
          />
          <TextFieldWithDesc
            value={values.commentCharacter}
            onOwnChange={(val) => updateField('commentCharacter', val)}
            description={t('common.commentCharacterDescription')}
          />
          <CheckboxWithDesc
            checked={values.emptyLines}
            onChange={(value) => updateField('emptyLines', value)}
            title={t('common.deleteLinesWithNoData')}
            description={t('common.deleteLinesWithNoDataDescription')}
          />
        </Box>
      )
    },
    {
      title: t('common.outputOptions'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.outputSeparator}
            onOwnChange={(val) => updateField('outputSeparator', val)}
            description={t('common.csvSeparatorDescriptionOutput')}
          />
          <CheckboxWithDesc
            checked={values.outputQuoteAll}
            onChange={(value) => updateField('outputQuoteAll', value)}
            title={t('changeCsvSeparator.options.quoteAllOutputFields')}
            description={t(
              'changeCsvSeparator.options.quoteAllOutputFieldsDescription'
            )}
          />
          {values.outputQuoteAll && (
            <TextFieldWithDesc
              value={values.OutputQuoteCharacter}
              onOwnChange={(val) => updateField('OutputQuoteCharacter', val)}
              description={t('common.quoteCharacterDescriptionOutput')}
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
        <ToolTextResult title={t('common.outputCsv')} value={result} />
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

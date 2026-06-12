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
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { csvToTsv } from './service';

const initialValues = {
  delimiter: ',',
  quoteCharacter: '"',
  commentCharacter: '#',
  header: true,
  emptyLines: true
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
    title: 'csvToTsv.examples.gameData.title',
    description: 'csvToTsv.examples.gameData.description',
    sampleText: `player_name,score,time,goals
ToniJackson,2500,30:00,15
HenryDalton,1800,25:00,12
DavidLee,3200,40:00,20
EmmaJones,2100,35:00,17
KrisDavis,1500,20:00,10`,
    sampleResult: `player_name	score	time	goals
ToniJackson	2500	30:00	15
HenryDalton	1800	25:00	12
DavidLee	3200	40:00	20
EmmaJones	2100	35:00	17
KrisDavis	1500	20:00	10`,
    sampleOptions: {
      delimiter: ',',
      quoteCharacter: '"',
      commentCharacter: '#',
      header: true,
      emptyLines: true
    }
  },
  {
    title: 'csvToTsv.examples.mythicalCreatures.title',
    description: 'csvToTsv.examples.mythicalCreatures.description',
    sampleText: `creature;origin;habitat;powers
Unicorn;Mythology;Forest;Magic horn
Mermaid;Mythology;Ocean;Hypnotic singing
Vampire;Mythology;Castles;Immortality
Phoenix;Mythology;Desert;Rebirth from ashes

#Dragon;Mythology;Mountains;Fire breathing
#Werewolf;Mythology;Forests;Shape shifting`,
    sampleResult: `Unicorn	Mythology	Forest	Magic horn
Mermaid	Mythology	Ocean	Hypnotic singing
Vampire	Mythology	Castles	Immortality
Phoenix	Mythology	Desert	Rebirth from ashes`,
    sampleOptions: {
      delimiter: ';',
      quoteCharacter: '"',
      commentCharacter: '#',
      header: false,
      emptyLines: true
    }
  },
  {
    title: 'csvToTsv.examples.fitnessTracker.title',
    description: 'csvToTsv.examples.fitnessTracker.description',
    sampleText: `day,steps,distance,calories

Mon,7500,3.75,270
Tue,12000,6.00,420

Wed,8000,4.00,300
Thu,9500,4.75,330
Fri,10000,5.00,350`,
    sampleResult: `day	steps	distance	calories
Mon	7500	3.75	270
Tue	12000	6.00	420
Wed	8000	4.00	300
Thu	9500	4.75	330
Fri	10000	5.00	350`,
    sampleOptions: {
      delimiter: ',',
      quoteCharacter: '"',
      commentCharacter: '#',
      header: true,
      emptyLines: true
    }
  }
];

export default function CsvToTsv({
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
      csvToTsv(
        input,
        optionsValues.delimiter,
        optionsValues.quoteCharacter,
        optionsValues.commentCharacter,
        optionsValues.header,
        optionsValues.emptyLines
      )
    );
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('common.csvFormatOptions'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.delimiter}
            onOwnChange={(val) => updateField('delimiter', val)}
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
            checked={values.header}
            onChange={(value) => updateField('header', value)}
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

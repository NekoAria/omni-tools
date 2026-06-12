import { Box } from '@mui/material';
import { useState } from 'react';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { censorText } from './service';
import ToolTextInput from '@components/input/ToolTextInput';
import { InitialValuesType } from './types';
import ToolContent from '@components/ToolContent';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import SelectWithDesc from '@components/options/SelectWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';

const initialValues: InitialValuesType = {
  wordsToCensor: '',
  censoredBySymbol: true,
  censorSymbol: '█',
  eachLetter: true,
  censorWord: 'CENSORED'
};

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'string:censor.ui.title1',
    description: 'string:censor.ui.description1',
    sampleText:
      'Motivation alone is not enough. If you have an idiot and you motivate him, now you have a motivated idiot. Jim Rohn',
    sampleResult:
      'Motivation alone is not enough. If you have an ☺ and you motivate him, now you have a motivated ☺. Jim Rohn',
    sampleOptions: {
      ...initialValues,
      wordsToCensor: 'idiot',
      censorSymbol: '☺',
      eachLetter: false
    }
  },
  {
    title: 'string:censor.ui.title2',
    description: 'string:censor.ui.description2',
    sampleText:
      '“In the mirrors of the many judgments, my hands are the color of blood. I sometimes fancy myself an evil which exists to oppose other evils; and on that great Day of which the prophets speak but in which they do not truly believe, on the day the world is utterly cleansed of evil, then I too will go down into darkness, swallowing curses. Until then, I will not wash my hands nor let them hang useless.” ― Roger Zelazny, The Guns of Avalon',
    sampleResult:
      '“In the mirrors of the many judgments, my hands are the color of █████. I sometimes fancy myself an ████ which exists to oppose other █████; and on that great Day of which the prophets speak but in which they do not truly believe, on the day the world is utterly cleansed of ████, then I too will go down into ████████, swallowing ██████. Until then, I will not wash my hands nor let them hang useless.” ― Roger Zelazny, The Guns of Avalon',
    sampleOptions: {
      ...initialValues,
      wordsToCensor: 'blood\nevil\ndarkness\ncurses',
      eachLetter: true
    }
  },
  {
    title: 'string:censor.ui.title3',
    description: 'string:censor.ui.description3',
    sampleText:
      'My name is John and I am an undercover FBI agent. I usually write my name in lowercase as "john" because I find uppercase letters scary. Unfortunately, in documents, my name is properly capitalized as John and it makes me upset.',
    sampleResult:
      'My name is Agent 007 and I am an undercover FBI agent. I usually write my name in lowercase as "Agent 007" because I find uppercase letters scary. Unfortunately, in documents, my name is properly capitalized as Agent 007 and it makes me upset.',
    sampleOptions: {
      ...initialValues,
      censoredBySymbol: false,
      wordsToCensor: 'john',
      censorWord: 'Agent 007'
    }
  }
];

export default function CensorText({
  title,
  longDescription
}: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  function compute(initialValues: InitialValuesType, input: string) {
    setResult(censorText(input, initialValues));
  }

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: 'string:censor.ui.title4',
      component: (
        <Box>
          <TextFieldWithDesc
            multiline
            rows={3}
            value={values.wordsToCensor}
            onOwnChange={(val) => updateField('wordsToCensor', val)}
            description="string:censor.ui.description6"
          />
        </Box>
      )
    },
    {
      title: 'string:censor.ui.title5',
      component: (
        <Box>
          <SelectWithDesc
            selected={values.censoredBySymbol}
            options={[
              { label: 'string:censor.ui.label1', value: true },
              { label: 'string:censor.ui.label2', value: false }
            ]}
            onChange={(value) => updateField('censoredBySymbol', value)}
            description={'string:censor.ui.description4'}
          />

          {values.censoredBySymbol && (
            <TextFieldWithDesc
              value={values.censorSymbol}
              onOwnChange={(val) => updateField('censorSymbol', val)}
              description="string:censor.ui.description7"
            />
          )}

          {values.censoredBySymbol && (
            <CheckboxWithDesc
              checked={values.eachLetter}
              onChange={(value) => updateField('eachLetter', value)}
              title="string:censor.ui.title6"
              description="string:censor.ui.description5"
            />
          )}

          {!values.censoredBySymbol && (
            <TextFieldWithDesc
              value={values.censorWord}
              onOwnChange={(val) => updateField('censorWord', val)}
              description="string:censor.ui.description8"
            />
          )}
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      getGroups={getGroups}
      compute={compute}
      input={input}
      setInput={setInput}
      inputComponent={
        <ToolTextInput
          title={'string:censor.ui.title7'}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={'string:censor.ui.title8'} value={result} />
      }
      toolInfo={{
        title: 'string:censor.ui.title9',
        description: longDescription
      }}
      exampleCards={exampleCards}
    />
  );
}

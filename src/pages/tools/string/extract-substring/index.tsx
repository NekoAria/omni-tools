import React, { useState } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { extractSubstring } from './service';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import ToolContent from '@components/ToolContent';

const initialValues = {
  start: '1',
  length: '5',
  multiLine: false,
  reverse: false
};

const exampleCards: CardExampleType<typeof initialValues>[] = [
  {
    title: 'string:extractSubstring.ui.title1',
    description: 'string:extractSubstring.ui.description1',
    sampleText: 'The quick brown fox jumps over the lazy dog.',
    sampleResult: 'The q',
    sampleOptions: {
      ...initialValues,
      start: '1',
      length: '5'
    }
  },
  {
    title: 'string:extractSubstring.ui.title2',
    description: 'string:extractSubstring.ui.description2',
    sampleText: 'The quick brown fox jumps over the lazy dog.',
    sampleResult: 'brown fox',
    sampleOptions: {
      ...initialValues,
      start: '11',
      length: '10'
    }
  },
  {
    title: 'string:extractSubstring.ui.title3',
    description: 'string:extractSubstring.ui.description3',
    sampleText: 'First line\nSecond line\nThird line',
    sampleResult: 'riF\nceS\nihT',
    sampleOptions: {
      ...initialValues,
      start: '1',
      length: '3',
      multiLine: true,
      reverse: true
    }
  }
];

export default function ExtractSubstring({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const computeExternal = (
    optionsValues: typeof initialValues,
    input: string
  ) => {
    const { start, length, multiLine, reverse } = optionsValues;
    try {
      setResult(
        extractSubstring(
          input,
          parseInt(start, 10),
          parseInt(length, 10),
          multiLine,
          reverse
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult('An unknown error occurred');
      }
    }
  };

  const getGroups: GetGroupsType<typeof initialValues> = ({
    values,
    updateField
  }) => [
    {
      title: 'string:extractSubstring.ui.title4',
      component: [
        <TextFieldWithDesc
          key="start"
          value={values.start}
          onOwnChange={(value) => updateField('start', value)}
          description="string:extractSubstring.ui.description4"
          type="number"
        />,
        <TextFieldWithDesc
          key="length"
          value={values.length}
          onOwnChange={(value) => updateField('length', value)}
          description="string:extractSubstring.ui.description5"
          type="number"
        />,
        <CheckboxWithDesc
          key="multiLine"
          checked={values.multiLine}
          title="string:extractSubstring.ui.title5"
          description="string:extractSubstring.ui.description6"
          onChange={(val) => updateField('multiLine', val)}
        />,
        <CheckboxWithDesc
          key="reverse"
          checked={values.reverse}
          title="string:extractSubstring.ui.title6"
          description="string:extractSubstring.ui.description7"
          onChange={(val) => updateField('reverse', val)}
        />
      ]
    }
  ];

  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      getGroups={getGroups}
      compute={computeExternal}
      input={input}
      setInput={setInput}
      inputComponent={
        <ToolTextInput
          title={'string:extractSubstring.ui.title7'}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult
          title={'string:extractSubstring.ui.title8'}
          value={result}
        />
      }
      exampleCards={exampleCards}
    />
  );
}

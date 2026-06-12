import React, { useState } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { createPalindromeList } from './service';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import ToolContent from '@components/ToolContent';

const initialValues = {
  lastChar: true,
  multiLine: false
};

const exampleCards: CardExampleType<typeof initialValues>[] = [
  {
    title: 'string:createPalindrome.ui.title1',
    description: 'string:createPalindrome.ui.description1',
    sampleText: 'level',
    sampleResult: 'levellevel',
    sampleOptions: {
      ...initialValues,
      lastChar: true
    }
  },
  {
    title: 'string:createPalindrome.ui.title2',
    description: 'string:createPalindrome.ui.description2',
    sampleText: 'radar',
    sampleResult: 'radarada',
    sampleOptions: {
      ...initialValues,
      lastChar: false
    }
  },
  {
    title: 'string:createPalindrome.ui.title3',
    description: 'string:createPalindrome.ui.description3',
    sampleText: 'mom\ndad\nwow',
    sampleResult: 'mommom\ndaddad\nwowwow',
    sampleOptions: {
      ...initialValues,
      lastChar: true,
      multiLine: true
    }
  }
];

export default function CreatePalindrome({
  title,
  longDescription
}: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const computeExternal = (
    optionsValues: typeof initialValues,
    input: string
  ) => {
    const { lastChar, multiLine } = optionsValues;
    setResult(createPalindromeList(input, lastChar, multiLine));
  };

  const getGroups: GetGroupsType<typeof initialValues> = ({
    values,
    updateField
  }) => [
    {
      title: 'string:createPalindrome.ui.title4',
      component: [
        <CheckboxWithDesc
          key="lastChar"
          checked={values.lastChar}
          title="string:createPalindrome.ui.title5"
          description="string:createPalindrome.ui.description4"
          onChange={(val) => updateField('lastChar', val)}
        />,
        <CheckboxWithDesc
          key="multiLine"
          checked={values.multiLine}
          title="string:createPalindrome.ui.title6"
          description="string:createPalindrome.ui.description5"
          onChange={(val) => updateField('multiLine', val)}
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
          title={'string:createPalindrome.ui.title7'}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult
          title={'string:createPalindrome.ui.title8'}
          value={result}
        />
      }
      toolInfo={{
        title: 'string:createPalindrome.ui.title9',
        description: longDescription
      }}
      exampleCards={exampleCards}
    />
  );
}

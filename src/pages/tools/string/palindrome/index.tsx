import { Box } from '@mui/material';
import React, { useState, useRef } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import ToolOptions, { GetGroupsType } from '@components/options/ToolOptions';
import { palindromeList, SplitOperatorType } from './service';
import RadioWithTextField from '@components/options/RadioWithTextField';
import ToolInputAndResult from '@components/ToolInputAndResult';
import ToolExamples, {
  CardExampleType
} from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { FormikProps } from 'formik';
import ToolContent from '@components/ToolContent';

const initialValues = {
  splitOperatorType: 'symbol' as SplitOperatorType,
  symbolValue: ' ',
  regexValue: '\\s+'
};

const splitOperators: {
  title: string;
  description: string;
  type: SplitOperatorType;
}[] = [
  {
    title: 'string:palindrome.ui.title1',
    description: 'string:palindrome.ui.description1',
    type: 'symbol'
  },
  {
    title: 'string:palindrome.ui.title2',
    type: 'regex',
    description: 'string:palindrome.ui.description2'
  }
];

const exampleCards: CardExampleType<typeof initialValues>[] = [
  {
    title: 'string:palindrome.ui.title3',
    description: 'string:palindrome.ui.description3',
    sampleText: 'radar level hello anna',
    sampleResult: 'true true false true',
    sampleOptions: {
      ...initialValues,
      symbolValue: ' '
    }
  },
  {
    title: 'string:palindrome.ui.title4',
    description: 'string:palindrome.ui.description4',
    sampleText: 'mom,dad,wow,test',
    sampleResult: 'true true true false',
    sampleOptions: {
      ...initialValues,
      symbolValue: ','
    }
  },
  {
    title: 'string:palindrome.ui.title5',
    description: 'string:palindrome.ui.description5',
    sampleText: 'level:madam;noon|test',
    sampleResult: 'true true true false',
    sampleOptions: {
      ...initialValues,
      splitOperatorType: 'regex',
      regexValue: '[:|;]|\\|'
    }
  }
];

export default function Palindrome({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const computeExternal = (
    optionsValues: typeof initialValues,
    input: string
  ) => {
    const { splitOperatorType, symbolValue, regexValue } = optionsValues;
    const separator = splitOperatorType === 'symbol' ? symbolValue : regexValue;
    setResult(palindromeList(splitOperatorType, input, separator));
  };

  const getGroups: GetGroupsType<typeof initialValues> = ({
    values,
    updateField
  }) => [
    {
      title: 'string:palindrome.ui.title6',
      component: splitOperators.map(({ title, description, type }) => (
        <RadioWithTextField
          key={type}
          checked={type === values.splitOperatorType}
          title={title}
          fieldName={'splitOperatorType'}
          description={description}
          value={values[`${type}Value`]}
          onRadioClick={() => updateField('splitOperatorType', type)}
          onTextChange={(val) => updateField(`${type}Value`, val)}
        />
      ))
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
      inputComponent={<ToolTextInput value={input} onChange={setInput} />}
      resultComponent={
        <ToolTextResult title={'string:palindrome.ui.title7'} value={result} />
      }
      exampleCards={exampleCards}
    />
  );
}

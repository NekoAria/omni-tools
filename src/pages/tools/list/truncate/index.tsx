import React, { useState } from 'react';
import { Box } from '@mui/material';
import ToolContent from '@components/ToolContent';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { SplitOperatorType, truncateList } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { GetGroupsType } from '@components/options/ToolOptions';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import SimpleRadio from '@components/options/SimpleRadio';
import * as Yup from 'yup';

interface InitialValuesType {
  splitOperatorType: SplitOperatorType;
  splitSeparator: string;
  joinSeparator: string;
  end: boolean;
  length: string;
}

const initialValues: InitialValuesType = {
  splitOperatorType: 'symbol',
  splitSeparator: ',',
  joinSeparator: ',',
  end: true,
  length: '3'
};

const validationSchema = Yup.object({
  splitSeparator: Yup.string().required('The separator is required'),
  joinSeparator: Yup.string().required('The join separator is required'),
  length: Yup.number()
    .typeError('Length must be a number')
    .min(0, 'Length must be a positive number')
    .required('Length is required')
});

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'list:truncate.ui.title1',
    description: 'list:truncate.ui.description1',
    sampleText: 'apple, pineapple, lemon, orange, mango',
    sampleResult: 'apple,pineapple,lemon',
    sampleOptions: {
      splitOperatorType: 'symbol',
      splitSeparator: ', ',
      joinSeparator: ',',
      end: true,
      length: '3'
    }
  },
  {
    title: 'list:truncate.ui.title2',
    description: 'list:truncate.ui.description2',
    sampleText: 'apple, pineapple, lemon, orange, mango',
    sampleResult: 'orange,mango',
    sampleOptions: {
      splitOperatorType: 'symbol',
      splitSeparator: ', ',
      joinSeparator: ',',
      end: false,
      length: '2'
    }
  },
  {
    title: 'list:truncate.ui.title3',
    description: 'list:truncate.ui.description3',
    sampleText: 'apple | pineapple | lemon | orange | mango',
    sampleResult: 'apple - pineapple - lemon',
    sampleOptions: {
      splitOperatorType: 'symbol',
      splitSeparator: ' | ',
      joinSeparator: ' - ',
      end: true,
      length: '3'
    }
  }
];

export default function Truncate({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (optionsValues: InitialValuesType, input: string) => {
    if (input) {
      try {
        const length = parseInt(optionsValues.length, 10);
        setResult(
          truncateList(
            optionsValues.splitOperatorType,
            input,
            optionsValues.splitSeparator,
            optionsValues.joinSeparator,
            optionsValues.end,
            length
          )
        );
      } catch (error) {
        if (error instanceof Error) {
          setResult(`Error: ${error.message}`);
        } else {
          setResult('An unknown error occurred');
        }
      }
    }
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: 'list:truncate.ui.title4',
      component: (
        <Box>
          <SimpleRadio
            onClick={() => updateField('splitOperatorType', 'symbol')}
            checked={values.splitOperatorType === 'symbol'}
            title={'list:truncate.ui.title5'}
          />
          <SimpleRadio
            onClick={() => updateField('splitOperatorType', 'regex')}
            checked={values.splitOperatorType === 'regex'}
            title={'list:truncate.ui.title6'}
          />
          <TextFieldWithDesc
            value={values.splitSeparator}
            onOwnChange={(val) => updateField('splitSeparator', val)}
            description={'list:truncate.ui.description4'}
          />
          <TextFieldWithDesc
            value={values.joinSeparator}
            onOwnChange={(val) => updateField('joinSeparator', val)}
            description={'list:truncate.ui.description5'}
          />
        </Box>
      )
    },
    {
      title: 'list:truncate.ui.title7',
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.length}
            onOwnChange={(val) => updateField('length', val)}
            description={'list:truncate.ui.description6'}
            type="number"
          />
          <SimpleRadio
            onClick={() => updateField('end', true)}
            checked={values.end}
            title={'list:truncate.ui.title8'}
          />
          <SimpleRadio
            onClick={() => updateField('end', false)}
            checked={!values.end}
            title={'list:truncate.ui.title9'}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      inputComponent={
        <ToolTextInput
          title="list:truncate.ui.title10"
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title="list:truncate.ui.title11" value={result} />
      }
      initialValues={initialValues}
      getGroups={getGroups}
      validationSchema={validationSchema}
      toolInfo={{
        title: 'list:truncate.ui.title12',
        description: 'list:truncate.ui.description7'
      }}
      exampleCards={exampleCards}
      input={input}
      setInput={setInput}
      compute={compute}
    />
  );
}

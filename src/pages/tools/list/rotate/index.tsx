import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { rotateList, SplitOperatorType } from './service';
import SimpleRadio from '@components/options/SimpleRadio';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { formatNumber } from '../../../../utils/number';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';

const initialValues = {
  splitOperatorType: 'symbol' as SplitOperatorType,
  input: '',
  splitSeparator: ',',
  joinSeparator: ',',
  right: true,
  step: 1
};
const splitOperators: {
  title: string;
  description: string;
  type: SplitOperatorType;
}[] = [
  {
    title: 'list:rotate.ui.title1',
    description: 'list:rotate.ui.description1',
    type: 'symbol'
  },
  {
    title: 'list:rotate.ui.title2',
    type: 'regex',
    description: 'list:rotate.ui.description2'
  }
];
const rotationDirections: {
  title: string;
  description: string;
  value: boolean;
}[] = [
  {
    title: 'list:rotate.ui.title3',
    description: 'list:rotate.ui.description3',
    value: true
  },
  {
    title: 'list:rotate.ui.title4',
    description: 'list:rotate.ui.description4',
    value: false
  }
];

export default function Rotate({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const compute = (optionsValues: typeof initialValues, input: any) => {
    const { splitOperatorType, splitSeparator, joinSeparator, right, step } =
      optionsValues;

    setResult(
      rotateList(
        splitOperatorType,
        input,
        splitSeparator,
        joinSeparator,
        right,
        step
      )
    );
  };

  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={
        <ToolTextInput
          title={'list:rotate.ui.title5'}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={'list:rotate.ui.title6'} value={result} />
      }
      initialValues={initialValues}
      getGroups={({ values, updateField }) => [
        {
          title: 'list:rotate.ui.title7',
          component: (
            <Box>
              {splitOperators.map(({ title, description, type }) => (
                <SimpleRadio
                  key={type}
                  onClick={() => updateField('splitOperatorType', type)}
                  title={title}
                  description={description}
                  checked={values.splitOperatorType === type}
                />
              ))}
              <TextFieldWithDesc
                description={'list:rotate.ui.description5'}
                value={values.splitSeparator}
                onOwnChange={(val) => updateField('splitSeparator', val)}
              />
            </Box>
          )
        },
        {
          title: 'list:rotate.ui.title8',
          component: (
            <Box>
              {rotationDirections.map(({ title, description, value }) => (
                <SimpleRadio
                  key={`${value}`}
                  onClick={() => updateField('right', value)}
                  title={title}
                  description={description}
                  checked={values.right === value}
                />
              ))}
              <TextFieldWithDesc
                description={'list:rotate.ui.description6'}
                value={values.step}
                onOwnChange={(val) => updateField('step', formatNumber(val, 1))}
              />
            </Box>
          )
        },
        {
          title: 'list:rotate.ui.title9',
          component: (
            <Box>
              <TextFieldWithDesc
                value={values.joinSeparator}
                onOwnChange={(value) => updateField('joinSeparator', value)}
                description={'list:rotate.ui.description7'}
              />
            </Box>
          )
        }
      ]}
      compute={compute}
      setInput={setInput}
    />
  );
}

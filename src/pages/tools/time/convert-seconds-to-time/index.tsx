import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { CardExampleType } from '@components/examples/ToolExamples';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { convertSecondsToTime } from './service';
import { useTranslation } from 'react-i18next';

const initialValues = {
  paddingFlag: false
};
type InitialValuesType = typeof initialValues;
const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'time:convertSecondsToTime.examples.basic.title',
    description: 'time:convertSecondsToTime.examples.basic.description',
    sampleText: `1
60
3600`,
    sampleResult: `0:0:1
0:1:0
1:0:0`,
    sampleOptions: { paddingFlag: false }
  },
  {
    title: 'time:convertSecondsToTime.examples.digitalClock.title',
    description: 'time:convertSecondsToTime.examples.digitalClock.description',
    sampleText: `0
46
890
18305
40271
86399`,
    sampleResult: `00:00:00
00:00:46
00:14:50
05:05:05
11:11:11
23:59:59`,
    sampleOptions: { paddingFlag: true }
  },
  {
    title: 'time:convertSecondsToTime.examples.moreThanDay.title',
    description: 'time:convertSecondsToTime.examples.moreThanDay.description',
    sampleText: `86401
123456
2159999

3600000
101010101`,
    sampleResult: `24:00:01
34:17:36
599:59:59

1000:00:00
28058:21:41`,
    sampleOptions: { paddingFlag: true }
  }
];

export default function SecondsToTime({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('time');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (optionsValues: typeof initialValues, input: string) => {
    setResult(convertSecondsToTime(input, optionsValues.paddingFlag));
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: t('convertSecondsToTime.timePadding'),
      component: (
        <Box>
          <CheckboxWithDesc
            onChange={(val) => updateField('paddingFlag', val)}
            checked={values.paddingFlag}
            title={t('convertSecondsToTime.addPadding')}
            description={t('convertSecondsToTime.addPaddingDescription')}
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
        title: t('convertSecondsToTime.toolInfo.title', { title }),
        description: longDescription
      }}
      exampleCards={exampleCards}
    />
  );
}

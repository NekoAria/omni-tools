import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { CardExampleType } from '@components/examples/ToolExamples';
import { main } from './service';
import { useTranslation } from 'react-i18next';

const initialValues = {};

type InitialValuesType = typeof initialValues;

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'time:crontabGuru.examples.weekdays.title',
    description: 'time:crontabGuru.examples.weekdays.description',
    sampleText: '35 16 * * 0-5',
    sampleResult: 'At 04:35 PM, Sunday through Friday',
    sampleOptions: {}
  },
  {
    title: 'time:crontabGuru.examples.everyMinute.title',
    description: 'time:crontabGuru.examples.everyMinute.description',
    sampleText: '* * * * *',
    sampleResult: 'Every minute',
    sampleOptions: {}
  },
  {
    title: 'time:crontabGuru.examples.everyFiveMinutes.title',
    description: 'time:crontabGuru.examples.everyFiveMinutes.description',
    sampleText: '*/5 * * * *',
    sampleResult: 'Every 5 minutes',
    sampleOptions: {}
  },
  {
    title: 'time:crontabGuru.examples.monthlyNoon.title',
    description: 'time:crontabGuru.examples.monthlyNoon.description',
    sampleText: '0 12 1 * *',
    sampleResult: 'At 12:00 PM, on day 1 of the month',
    sampleOptions: {}
  }
];

export default function CrontabGuru({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('time');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (values: InitialValuesType, input: string) => {
    setResult(main(input));
  };

  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={
        <ToolTextInput
          value={input}
          onChange={setInput}
          placeholder={t('crontabGuru.inputPlaceholder')}
        />
      }
      resultComponent={<ToolTextResult value={result} />}
      initialValues={initialValues}
      exampleCards={exampleCards}
      getGroups={null}
      setInput={setInput}
      compute={compute}
      toolInfo={{
        title: t('crontabGuru.toolInfo.title', { title }),
        description: longDescription
      }}
    />
  );
}

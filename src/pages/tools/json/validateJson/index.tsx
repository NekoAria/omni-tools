import React, { useState } from 'react';
import ToolCodeInput from '@components/input/ToolCodeInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { CardExampleType } from '@components/examples/ToolExamples';
import { validateJson } from './service';
import { ToolComponentProps } from '@tools/defineTool';
import ToolContent from '@components/ToolContent';
import { useTranslation } from 'react-i18next';

const exampleCards: CardExampleType<{}>[] = [
  {
    title: 'json:validateJson.ui.title1',
    description: 'json:validateJson.ui.description1',
    sampleText: `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`,
    sampleResult: '✅ Valid JSON',
    sampleOptions: {}
  },
  {
    title: 'json:validateJson.ui.title2',
    description: 'json:validateJson.ui.description2',
    sampleText: `{
  name: "John",
  age: 30,
  city: "New York"
}`,
    sampleResult: "❌ Error: Expected property name or '}' in JSON",
    sampleOptions: {}
  },
  {
    title: 'json:validateJson.ui.title3',
    description: 'json:validateJson.ui.description3',
    sampleText: `{
  "name": "John",
  "age": 30,
  "city": "New York",
}`,
    sampleResult: '❌ Error: Expected double-quoted property name',
    sampleOptions: {}
  }
];

export default function ValidateJson({ title }: ToolComponentProps) {
  const { t } = useTranslation('json');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (options: any, input: string) => {
    const { valid, error } = validateJson(input);

    if (valid) {
      setResult(t('validateJson.validJson'));
    } else {
      setResult(t('validateJson.invalidJson', { error }));
    }
  };

  return (
    <ToolContent
      title={title}
      inputComponent={
        <ToolCodeInput
          title={t('validateJson.inputTitle')}
          value={input}
          onChange={setInput}
          language="json"
        />
      }
      resultComponent={
        <ToolTextResult title={t('validateJson.resultTitle')} value={result} />
      }
      initialValues={{}}
      getGroups={null}
      toolInfo={{
        title: t('validateJson.toolInfo.title'),
        description: t('validateJson.toolInfo.description')
      }}
      exampleCards={exampleCards}
      input={input}
      setInput={setInput}
      compute={compute}
    />
  );
}

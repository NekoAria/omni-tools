import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolCodeInput from '@components/input/ToolCodeInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { minifyJson } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { useTranslation } from 'react-i18next';

type InitialValuesType = Record<string, never>;

const initialValues: InitialValuesType = {};

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'json:minify.ui.title1',
    description: 'json:minify.ui.description1',
    sampleText: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}`,
    sampleResult: `{"name":"John Doe","age":30,"city":"New York"}`,
    sampleOptions: {}
  },
  {
    title: 'json:minify.ui.title2',
    description: 'json:minify.ui.description2',
    sampleText: `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "hobbies": ["reading", "gaming"]
    },
    {
      "id": 2,
      "name": "Bob",
      "hobbies": ["swimming", "coding"]
    }
  ]
}`,
    sampleResult: `{"users":[{"id":1,"name":"Alice","hobbies":["reading","gaming"]},{"id":2,"name":"Bob","hobbies":["swimming","coding"]}]}`,
    sampleOptions: {}
  }
];

export default function MinifyJson({ title }: ToolComponentProps) {
  const { t } = useTranslation('json');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (_: InitialValuesType, input: string) => {
    if (input) setResult(minifyJson(input));
  };

  return (
    <ToolContent
      title={title}
      inputComponent={
        <ToolCodeInput
          title={t('minify.inputTitle')}
          value={input}
          onChange={setInput}
          language="json"
        />
      }
      resultComponent={
        <ToolTextResult
          title={t('minify.resultTitle')}
          value={result}
          extension={'json'}
        />
      }
      initialValues={initialValues}
      getGroups={null}
      toolInfo={{
        title: t('minify.toolInfo.title'),
        description: t('minify.toolInfo.description')
      }}
      exampleCards={exampleCards}
      input={input}
      setInput={setInput}
      compute={compute}
    />
  );
}

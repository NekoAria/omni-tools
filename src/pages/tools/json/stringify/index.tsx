import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolCodeInput from '@components/input/ToolCodeInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { stringifyJson } from './service';
import { ToolComponentProps } from '@tools/defineTool';
import RadioWithTextField from '@components/options/RadioWithTextField';
import SimpleRadio from '@components/options/SimpleRadio';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { isNumber, updateNumberField } from '@utils/string';
import { CardExampleType } from '@components/examples/ToolExamples';

type InitialValuesType = {
  indentationType: 'tab' | 'space';
  spacesCount: number;
  escapeHtml: boolean;
};

const initialValues: InitialValuesType = {
  indentationType: 'space',
  spacesCount: 2,
  escapeHtml: false
};

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'json:stringify.ui.title1',
    description: 'json:stringify.ui.description1',
    sampleText: `{ name: "John", age: 30 }`,
    sampleResult: `{
  "name": "John",
  "age": 30
}`,
    sampleOptions: {
      indentationType: 'space',
      spacesCount: 2,
      escapeHtml: false
    }
  },
  {
    title: 'json:stringify.ui.title2',
    description: 'json:stringify.ui.description2',
    sampleText: `[1, "hello", true, null, { x: 10 }]`,
    sampleResult: `[
    1,
    "hello",
    true,
    null,
    {
        "x": 10
    }
]`,
    sampleOptions: {
      indentationType: 'space',
      spacesCount: 4,
      escapeHtml: false
    }
  },
  {
    title: 'json:stringify.ui.title3',
    description: 'json:stringify.ui.description3',
    sampleText: `{
  html: "<div>Hello & Welcome</div>",
  message: "Special chars: < > & ' \\""
}`,
    sampleResult: `{
  &quot;html&quot;: &quot;&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;&quot;,
  &quot;message&quot;: &quot;Special chars: &lt; &gt; &amp; &#039; &quot;&quot;
}`,
    sampleOptions: {
      indentationType: 'space',
      spacesCount: 2,
      escapeHtml: true
    }
  }
];

export default function StringifyJson({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (values: InitialValuesType, input: string) => {
    if (input) {
      setResult(
        stringifyJson(
          input,
          values.indentationType,
          values.spacesCount,
          values.escapeHtml
        )
      );
    }
  };

  return (
    <ToolContent
      title={title}
      input={input}
      setInput={setInput}
      initialValues={initialValues}
      compute={compute}
      exampleCards={exampleCards}
      inputComponent={
        <ToolCodeInput
          title="json:stringify.ui.title4"
          value={input}
          onChange={setInput}
          language="json"
        />
      }
      resultComponent={
        <ToolTextResult
          title="json:stringify.ui.title5"
          value={result}
          extension={'json'}
        />
      }
      getGroups={({ values, updateField }) => [
        {
          title: 'Indentation',
          component: (
            <Box>
              <RadioWithTextField
                checked={values.indentationType === 'space'}
                title="json:stringify.ui.title6"
                fieldName="indentationType"
                description="json:stringify.ui.description4"
                value={values.spacesCount.toString()}
                onRadioClick={() => updateField('indentationType', 'space')}
                onTextChange={(val) =>
                  updateNumberField(val, 'spacesCount', updateField)
                }
              />
              <SimpleRadio
                onClick={() => updateField('indentationType', 'tab')}
                checked={values.indentationType === 'tab'}
                description="json:stringify.ui.description5"
                title="json:stringify.ui.title7"
              />
            </Box>
          )
        },
        {
          title: 'Options',
          component: (
            <CheckboxWithDesc
              checked={values.escapeHtml}
              onChange={(value) => updateField('escapeHtml', value)}
              title="json:stringify.ui.title8"
              description="json:stringify.ui.description6"
            />
          )
        }
      ]}
      toolInfo={{
        title: 'json:stringify.ui.title9',
        description: 'json:stringify.ui.description7'
      }}
    />
  );
}

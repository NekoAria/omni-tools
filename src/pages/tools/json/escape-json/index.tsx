import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolCodeInput from '@components/input/ToolCodeInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { escapeJson } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { GetGroupsType } from '@components/options/ToolOptions';
import { Box } from '@mui/material';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';

const initialValues = {
  wrapInQuotesFlag: false
};

type InitialValuesType = typeof initialValues;

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'json:escapeJson.ui.title1',
    description: 'json:escapeJson.ui.description1',
    sampleText: `{"country": "Spain", "capital": "Madrid"}`,
    sampleResult: `{{\\"country\\": \\"Spain\\", \\"capital\\": \\"Madrid\\"}`,
    sampleOptions: {
      wrapInQuotesFlag: false
    }
  },
  {
    title: 'json:escapeJson.ui.title2',
    description: 'json:escapeJson.ui.description2',
    sampleText: `{
  "name": "Pizza Margherita",
  "ingredients": [
    "tomato sauce",
    "mozzarella cheese",
    "fresh basil"
  ],
  "price": 12.50,
  "vegetarian": true
}`,
    sampleResult: `"{\\n  \\"name\\": \\"Pizza Margherita\\",\\n  \\"ingredients\\": [\\n\\"tomato sauce\\",\\n    \\"mozzarella cheese\\",\\n    \\"fresh basil\\"\\n  ],\\n  \\"price\\": 12.50,\\n  \\"vegetarian\\": true\\n}"`,
    sampleOptions: {
      wrapInQuotesFlag: true
    }
  },
  {
    title: 'json:escapeJson.ui.title3',
    description: 'json:escapeJson.ui.description3',
    sampleText: `[1, 2, 3]`,
    sampleResult: `[1, 2, 3]`,
    sampleOptions: {
      wrapInQuotesFlag: false
    }
  }
];

export default function EscapeJsonTool({
  title,
  longDescription
}: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (options: InitialValuesType, input: string) => {
    setResult(escapeJson(input, options.wrapInQuotesFlag));
  };

  const getGroups: GetGroupsType<InitialValuesType> | null = ({
    values,
    updateField
  }) => [
    {
      title: 'json:escapeJson.ui.title4',
      component: (
        <Box>
          <CheckboxWithDesc
            onChange={(val) => updateField('wrapInQuotesFlag', val)}
            checked={values.wrapInQuotesFlag}
            title={'json:escapeJson.ui.title5'}
            description={'json:escapeJson.ui.description4'}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      inputComponent={
        <ToolCodeInput
          title="json:escapeJson.ui.title6"
          value={input}
          onChange={setInput}
          language="json"
        />
      }
      resultComponent={
        <ToolTextResult
          title="json:escapeJson.ui.title7"
          value={result}
          keepSpecialCharacters
          extension={'json'}
        />
      }
      initialValues={initialValues}
      getGroups={getGroups}
      toolInfo={{
        title: 'json:escapeJson.ui.title8',
        description: longDescription
      }}
      exampleCards={exampleCards}
      input={input}
      setInput={setInput}
      compute={compute}
    />
  );
}

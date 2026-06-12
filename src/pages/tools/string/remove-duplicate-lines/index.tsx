import { Box } from '@mui/material';
import React, { useRef, useState } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import SimpleRadio from '@components/options/SimpleRadio';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import ToolExamples, {
  CardExampleType
} from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { FormikProps } from 'formik';
import removeDuplicateLines, {
  DuplicateRemovalMode,
  DuplicateRemoverOptions,
  NewlineOption
} from './service';
import ToolContent from '@components/ToolContent';

// Initial values for our form
const initialValues: DuplicateRemoverOptions = {
  mode: 'all',
  newlines: 'filter',
  sortLines: false,
  trimTextLines: false
};

// Operation mode options
const operationModes = [
  {
    title: 'string:removeDuplicateLines.ui.title1',
    description: 'string:removeDuplicateLines.ui.description1',
    value: 'all' as DuplicateRemovalMode
  },
  {
    title: 'string:removeDuplicateLines.ui.title2',
    description: 'string:removeDuplicateLines.ui.description2',
    value: 'consecutive' as DuplicateRemovalMode
  },
  {
    title: 'string:removeDuplicateLines.ui.title3',
    description: 'string:removeDuplicateLines.ui.description3',
    value: 'unique' as DuplicateRemovalMode
  }
];

// Newlines options
const newlineOptions = [
  {
    title: 'string:removeDuplicateLines.ui.title4',
    description: 'string:removeDuplicateLines.ui.description4',
    value: 'preserve' as NewlineOption
  },
  {
    title: 'string:removeDuplicateLines.ui.title5',
    description: 'string:removeDuplicateLines.ui.description5',
    value: 'filter' as NewlineOption
  },
  {
    title: 'string:removeDuplicateLines.ui.title6',
    description: 'string:removeDuplicateLines.ui.description6',
    value: 'delete' as NewlineOption
  }
];

// Example cards for demonstration
const exampleCards: CardExampleType<typeof initialValues>[] = [
  {
    title: 'string:removeDuplicateLines.ui.title7',
    description: 'string:removeDuplicateLines.ui.description7',
    sampleText: `Apples
Bananas
Milk
Eggs
Bread
Milk
Cheese
Apples
Yogurt`,
    sampleResult: `Apples
Bananas
Milk
Eggs
Bread
Cheese
Yogurt`,
    sampleOptions: {
      ...initialValues,
      mode: 'all',
      newlines: 'filter',
      sortLines: false,
      trimTextLines: false
    }
  },
  {
    title: 'string:removeDuplicateLines.ui.title8',
    description: 'string:removeDuplicateLines.ui.description8',
    sampleText: `[INFO] Application started
[ERROR] Connection failed
[ERROR] Connection failed
[ERROR] Connection failed
[INFO] Retrying connection
[ERROR] Authentication error
[ERROR] Authentication error
[INFO] Connection established`,
    sampleResult: `[INFO] Application started
[ERROR] Connection failed
[INFO] Retrying connection
[ERROR] Authentication error
[INFO] Connection established`,
    sampleOptions: {
      ...initialValues,
      mode: 'consecutive',
      newlines: 'filter',
      sortLines: false,
      trimTextLines: false
    }
  },
  {
    title: 'string:removeDuplicateLines.ui.title9',
    description: 'string:removeDuplicateLines.ui.description9',
    sampleText: `Red
Blue
Green
Blue
Yellow
Purple
Red
Orange`,
    sampleResult: `Green
Yellow
Purple
Orange`,
    sampleOptions: {
      ...initialValues,
      mode: 'unique',
      newlines: 'filter',
      sortLines: false,
      trimTextLines: false
    }
  },
  {
    title: 'string:removeDuplicateLines.ui.title10',
    description: 'string:removeDuplicateLines.ui.description10',
    sampleText: `  Apple
Banana
 Cherry
Apple
   Banana
Dragonfruit
 Elderberry `,
    sampleResult: `Apple
Banana
Cherry
Dragonfruit
Elderberry`,
    sampleOptions: {
      ...initialValues,
      mode: 'all',
      newlines: 'filter',
      sortLines: true,
      trimTextLines: true
    }
  }
];

export default function RemoveDuplicateLines({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const computeExternal = (
    optionsValues: typeof initialValues,
    inputText: string
  ) => {
    setResult(removeDuplicateLines(inputText, optionsValues));
  };

  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={<ToolTextInput value={input} onChange={setInput} />}
      resultComponent={
        <ToolTextResult
          title={'string:removeDuplicateLines.ui.title11'}
          value={result}
        />
      }
      initialValues={initialValues}
      getGroups={({ values, updateField }) => [
        {
          title: 'string:removeDuplicateLines.ui.title12',
          component: operationModes.map(({ title, description, value }) => (
            <SimpleRadio
              key={value}
              checked={value === values.mode}
              title={title}
              description={description}
              onClick={() => updateField('mode', value)}
            />
          ))
        },
        {
          title: 'string:removeDuplicateLines.ui.title13',
          component: [
            ...newlineOptions.map(({ title, description, value }) => (
              <SimpleRadio
                key={value}
                checked={value === values.newlines}
                title={title}
                description={description}
                onClick={() => updateField('newlines', value)}
              />
            )),
            <CheckboxWithDesc
              key="trimTextLines"
              checked={values.trimTextLines}
              title="string:removeDuplicateLines.ui.title14"
              description="string:removeDuplicateLines.ui.description11"
              onChange={(checked) => updateField('trimTextLines', checked)}
            />
          ]
        },
        {
          title: 'string:removeDuplicateLines.ui.title15',
          component: [
            <CheckboxWithDesc
              key="sortLines"
              checked={values.sortLines}
              title="string:removeDuplicateLines.ui.title16"
              description="string:removeDuplicateLines.ui.description12"
              onChange={(checked) => updateField('sortLines', checked)}
            />
          ]
        }
      ]}
      compute={computeExternal}
      setInput={setInput}
      exampleCards={exampleCards}
    />
  );
}

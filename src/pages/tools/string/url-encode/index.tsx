import { Box } from '@mui/material';
import { useState } from 'react';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import { encodeString } from './service';
import ToolTextInput from '@components/input/ToolTextInput';
import { InitialValuesType } from './types';
import ToolContent from '@components/ToolContent';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { useTranslation } from 'react-i18next';

const initialValues: InitialValuesType = {
  nonSpecialChar: false
};

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'string:urlEncode.ui.title1',
    description: 'string:urlEncode.ui.description1',
    sampleText: 'https://omnitools.app/',
    sampleResult: 'https%3A%2F%2Fomnitools.app%2F',
    sampleOptions: initialValues
  },
  {
    title: 'string:urlEncode.ui.title2',
    description: 'string:urlEncode.ui.description2',
    sampleText: "I can't believe it's not butter!",
    sampleResult:
      '%49%20%63%61%6E%27%74%20%62%65%6C%69%65%76%65%20%69%74%27%73%20%6E%6F%74%20%62%75%74%74%65%72%21',
    sampleOptions: {
      nonSpecialChar: true
    }
  }
];

export default function EncodeString({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('string');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  function compute(initialValues: InitialValuesType, input: string) {
    setResult(encodeString(input, initialValues));
  }

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('urlEncode.encodingOption.title'),
      component: (
        <Box>
          <CheckboxWithDesc
            checked={values.nonSpecialChar}
            onChange={(value) => updateField('nonSpecialChar', value)}
            title={t('urlEncode.encodingOption.nonSpecialCharPlaceholder')}
            description={t(
              'urlEncode.encodingOption.nonSpecialCharDescription'
            )}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      getGroups={getGroups}
      compute={compute}
      input={input}
      setInput={setInput}
      inputComponent={
        <ToolTextInput
          title={t('urlEncode.inputTitle')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={t('urlEncode.resultTitle')} value={result} />
      }
      toolInfo={{
        title: t('urlEncode.toolInfo.title', { title }),
        description: longDescription
      }}
      exampleCards={exampleCards}
    />
  );
}

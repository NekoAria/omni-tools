import React, { useState } from 'react';
import * as Yup from 'yup';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import ToolContent from '@components/ToolContent';
import { GetGroupsType } from '@components/options/ToolOptions';
import { mergeText } from './service';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { useTranslation } from 'react-i18next';

const initialValues = {
  joinCharacter: '',
  deleteBlank: true,
  deleteTrailing: true
};
type InitialValuesType = typeof initialValues;
const validationSchema = Yup.object().shape({
  joinCharacter: Yup.string().required('Join character is required'),
  deleteBlank: Yup.boolean().required('Delete blank is required'),
  deleteTrailing: Yup.boolean().required('Delete trailing is required')
});

const mergeOptions = {
  placeholder: 'string:join.ui.placeholder1',
  description:
    'Symbol that connects broken\n' + 'pieces of text. (Space by default.)\n',
  accessor: 'joinCharacter' as keyof InitialValuesType
};

const blankTrailingOptions: {
  title: string;
  description: string;
  accessor: keyof Omit<InitialValuesType, 'joinCharacter'>;
}[] = [
  {
    title: 'string:join.ui.title1',
    description: 'string:join.ui.description1',
    accessor: 'deleteBlank'
  },
  {
    title: 'string:join.ui.title2',
    description: 'string:join.ui.description2',
    accessor: 'deleteTrailing'
  }
];

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'string:join.ui.title3',
    description: 'string:join.ui.description3',
    sampleText: `clean the house

go shopping
feed the cat

make dinner
build a rocket ship and fly away`,
    sampleResult: `clean the house and go shopping and feed the cat and make dinner and build a rocket ship and fly away`,
    sampleOptions: {
      joinCharacter: 'and',
      deleteBlank: true,
      deleteTrailing: true
    }
  },
  {
    title: 'string:join.ui.title4',
    description: 'string:join.ui.description4',
    sampleText: `computer
memory
processor
mouse
keyboard`,
    sampleResult: `computer, memory, processor, mouse, keyboard`,
    sampleOptions: {
      joinCharacter: ',',
      deleteBlank: false,
      deleteTrailing: false
    }
  },
  {
    title: 'string:join.ui.title5',
    description: 'string:join.ui.description5',
    sampleText: `T
e
x
t
a
b
u
l
o
u
s
!`,
    sampleResult: `Textabulous!`,
    sampleOptions: {
      joinCharacter: '',
      deleteBlank: false,
      deleteTrailing: false
    }
  }
];

export default function JoinText({ title }: ToolComponentProps) {
  const { t } = useTranslation('string');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const compute = (optionsValues: InitialValuesType, input: any) => {
    const { joinCharacter, deleteBlank, deleteTrailing } = optionsValues;
    setResult(mergeText(input, deleteBlank, deleteTrailing, joinCharacter));
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('join.textMergedOptions'),
      component: (
        <TextFieldWithDesc
          placeholder={t('join.joinCharacterPlaceholder')}
          value={values['joinCharacter']}
          onOwnChange={(value) => updateField(mergeOptions.accessor, value)}
          description={t('join.joinCharacterDescription')}
        />
      )
    },
    {
      title: t('join.blankLinesAndTrailingSpaces'),
      component: blankTrailingOptions.map((option) => (
        <CheckboxWithDesc
          key={option.accessor}
          title={t(`join.${option.accessor}Title`)}
          checked={!!values[option.accessor]}
          onChange={(value) => updateField(option.accessor, value)}
          description={t(`join.${option.accessor}Description`)}
        />
      ))
    }
  ];
  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      compute={compute}
      input={input}
      setInput={setInput}
      inputComponent={
        <ToolTextInput
          title={t('join.inputTitle')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={t('join.resultTitle')} value={result} />
      }
      getGroups={getGroups}
      toolInfo={{
        title: t('join.toolInfo.title'),
        description: t('join.toolInfo.description')
      }}
      exampleCards={exampleCards}
    />
  );
}

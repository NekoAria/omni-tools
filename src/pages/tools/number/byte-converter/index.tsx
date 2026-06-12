import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { byteConverter } from './service';
import { CardExampleType } from '@components/examples/ToolExamples';
import SelectWithDesc from '@components/options/SelectWithDesc';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { ToolComponentProps } from '@tools/defineTool';
import { useTranslation } from 'react-i18next';
import { InitialValuesType, DATA_UNITS } from './types';

const initialValues: InitialValuesType = {
  fromUnit: 'GB',
  toUnit: 'KB',
  precision: 2
};

export const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'number:byteConverter.examples.gbToMb.title',
    description: 'number:byteConverter.examples.gbToMb.description',
    sampleText: `1
2.5
10
0.75
50`,
    sampleResult: `1000
2500
10000
750
50000`,
    sampleOptions: {
      fromUnit: 'GB',
      toUnit: 'MB',
      precision: 0
    }
  },
  {
    title: 'number:byteConverter.examples.mibToGib.title',
    description: 'number:byteConverter.examples.mibToGib.description',
    sampleText: `1024
2048
5120
256
8192`,
    sampleResult: `1
2
5
0.25
8`,
    sampleOptions: {
      fromUnit: 'MiB',
      toUnit: 'GiB',
      precision: 2
    }
  },
  {
    title: 'number:byteConverter.examples.gbToGib.title',
    description: 'number:byteConverter.examples.gbToGib.description',
    sampleText: `1
5
10
50
100`,
    sampleResult: `0.931
4.655
9.313
46.566
93.132`,
    sampleOptions: {
      fromUnit: 'GB',
      toUnit: 'GiB',
      precision: 3
    }
  },
  {
    title: 'number:byteConverter.examples.bytesToBits.title',
    description: 'number:byteConverter.examples.bytesToBits.description',
    sampleText: `1
5
10
50
100`,
    sampleResult: `8
40
80
400
800`,
    sampleOptions: {
      fromUnit: 'B',
      toUnit: 'b',
      precision: 0
    }
  }
];

export default function ByteConverter({ title }: ToolComponentProps) {
  const { t } = useTranslation('number');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const compute = (optionsValues: InitialValuesType, input: any) => {
    setResult(byteConverter(input, optionsValues));
  };

  return (
    <ToolContent
      title={title}
      input={input}
      setInput={setInput}
      exampleCards={exampleCards}
      initialValues={initialValues}
      inputComponent={
        <ToolTextInput
          title={t('byteConverter.inputTitle')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={t('byteConverter.outputTitle')} value={result} />
      }
      getGroups={({ values, updateField }) => [
        {
          title: t('byteConverter.unit.title'),
          component: (
            <Box>
              <SelectWithDesc
                selected={values.fromUnit}
                options={DATA_UNITS.map((unit) => ({
                  label: unit,
                  value: unit
                }))}
                onChange={(value) => updateField('fromUnit', value)}
                description={t('byteConverter.unit.from')}
              />

              <SelectWithDesc
                selected={values.toUnit}
                options={DATA_UNITS.map((unit) => ({
                  label: unit,
                  value: unit
                }))}
                onChange={(value) => updateField('toUnit', value)}
                description={t('byteConverter.unit.to')}
              />

              <TextFieldWithDesc
                description={t('byteConverter.unit.precision')}
                value={values.precision}
                onOwnChange={(val) => updateField('precision', Number(val))}
                type={'number'}
              />
            </Box>
          )
        }
      ]}
      compute={compute}
    />
  );
}

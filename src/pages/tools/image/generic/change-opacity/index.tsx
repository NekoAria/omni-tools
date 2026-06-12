import React, { useState } from 'react';
import ToolImageInput from '@components/input/ToolImageInput';
import ToolFileResult from '@components/result/ToolFileResult';
import { changeOpacity } from './service';
import ToolContent from '@components/ToolContent';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { CardExampleType } from '@components/examples/ToolExamples';
import { ToolComponentProps } from '@tools/defineTool';
import { updateNumberField } from '@utils/string';
import { Box } from '@mui/material';
import SimpleRadio from '@components/options/SimpleRadio';
import { useTranslation } from 'react-i18next';

type InitialValuesType = {
  opacity: number;
  mode: 'solid' | 'gradient';
  gradientType: 'linear' | 'radial';
  gradientDirection: 'left-to-right' | 'inside-out';
  areaLeft: number;
  areaTop: number;
  areaWidth: number;
  areaHeight: number;
};

const initialValues: InitialValuesType = {
  opacity: 0.5,
  mode: 'solid',
  gradientType: 'linear',
  gradientDirection: 'left-to-right',
  areaLeft: 0,
  areaTop: 0,
  areaWidth: 100,
  areaHeight: 100
};

const exampleCards: CardExampleType<InitialValuesType>[] = [
  {
    title: 'changeOpacity.examples.semiTransparent.title',
    description: 'changeOpacity.examples.semiTransparent.description',
    sampleOptions: {
      opacity: 0.5,
      mode: 'solid',
      gradientType: 'linear',
      gradientDirection: 'left-to-right',
      areaLeft: 0,
      areaTop: 0,
      areaWidth: 100,
      areaHeight: 100
    },
    sampleResult: ''
  },
  {
    title: 'changeOpacity.examples.slightlyFaded.title',
    description: 'changeOpacity.examples.slightlyFaded.description',
    sampleOptions: {
      opacity: 0.8,
      mode: 'solid',
      gradientType: 'linear',
      gradientDirection: 'left-to-right',
      areaLeft: 0,
      areaTop: 0,
      areaWidth: 100,
      areaHeight: 100
    },
    sampleResult: ''
  },
  {
    title: 'changeOpacity.examples.radialGradient.title',
    description: 'changeOpacity.examples.radialGradient.description',
    sampleOptions: {
      opacity: 0.8,
      mode: 'gradient',
      gradientType: 'radial',
      gradientDirection: 'inside-out',
      areaLeft: 25,
      areaTop: 25,
      areaWidth: 50,
      areaHeight: 50
    },
    sampleResult: ''
  }
];

export default function ChangeOpacity({ title }: ToolComponentProps) {
  const { t } = useTranslation('image');
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);

  const compute = (values: InitialValuesType, input: any) => {
    if (input) {
      changeOpacity(input, values).then(setResult);
    }
  };
  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={
        <ToolImageInput
          value={input}
          onChange={setInput}
          accept={['image/*']}
          title={t('changeOpacity.inputTitle')}
        />
      }
      resultComponent={
        <ToolFileResult title={t('changeOpacity.resultTitle')} value={result} />
      }
      initialValues={initialValues}
      // exampleCards={exampleCards}
      getGroups={({ values, updateField }) => [
        {
          title: t('changeOpacity.options.opacitySettings'),
          component: (
            <Box>
              <TextFieldWithDesc
                description={t('changeOpacity.options.opacityDescription')}
                value={values.opacity}
                onOwnChange={(val) =>
                  updateNumberField(val, 'opacity', updateField)
                }
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 1 }}
              />
              <SimpleRadio
                onClick={() => updateField('mode', 'solid')}
                checked={values.mode === 'solid'}
                description={t('changeOpacity.options.solidDescription')}
                title={t('changeOpacity.options.solidTitle')}
              />
              <SimpleRadio
                onClick={() => updateField('mode', 'gradient')}
                checked={values.mode === 'gradient'}
                description={t('changeOpacity.options.gradientDescription')}
                title={t('changeOpacity.options.gradientTitle')}
              />
            </Box>
          )
        },
        {
          title: t('changeOpacity.options.gradientOptions'),
          component: (
            <Box>
              <SimpleRadio
                onClick={() => updateField('gradientType', 'linear')}
                checked={values.gradientType === 'linear'}
                description={t('changeOpacity.options.linearDescription')}
                title={t('changeOpacity.options.linearTitle')}
              />
              <SimpleRadio
                onClick={() => updateField('gradientType', 'radial')}
                checked={values.gradientType === 'radial'}
                description={t('changeOpacity.options.radialDescription')}
                title={t('changeOpacity.options.radialTitle')}
              />
            </Box>
          )
        },
        {
          title: t('changeOpacity.options.opacityArea'),
          component: (
            <Box>
              <TextFieldWithDesc
                description={t('changeOpacity.options.leftPosition')}
                value={values.areaLeft}
                onOwnChange={(val) =>
                  updateNumberField(val, 'areaLeft', updateField)
                }
                type="number"
              />
              <TextFieldWithDesc
                description={t('changeOpacity.options.topPosition')}
                value={values.areaTop}
                onOwnChange={(val) =>
                  updateNumberField(val, 'areaTop', updateField)
                }
                type="number"
              />
              <TextFieldWithDesc
                description={t('changeOpacity.options.width')}
                value={values.areaWidth}
                onOwnChange={(val) =>
                  updateNumberField(val, 'areaWidth', updateField)
                }
                type="number"
              />
              <TextFieldWithDesc
                description={t('changeOpacity.options.height')}
                value={values.areaHeight}
                onOwnChange={(val) =>
                  updateNumberField(val, 'areaHeight', updateField)
                }
                type="number"
              />
            </Box>
          )
        }
      ]}
      compute={compute}
    />
  );
}

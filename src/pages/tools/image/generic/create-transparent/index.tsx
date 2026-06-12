import { Box } from '@mui/material';
import React, { useState } from 'react';
import * as Yup from 'yup';
import ToolImageInput from '@components/input/ToolImageInput';
import ToolFileResult from '@components/result/ToolFileResult';
import ColorSelector from '@components/options/ColorSelector';
import Color from 'color';
import TextFieldWithDesc from 'components/options/TextFieldWithDesc';
import { areColorsSimilar } from 'utils/color';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import { GetGroupsType } from '@components/options/ToolOptions';
import { useTranslation } from 'react-i18next';

const initialValues = {
  fromColor: 'white',
  similarity: '10',
  backgroundColor: '#ffffff' // NEW
};

const validationSchema = Yup.object({
  // splitSeparator: Yup.string().required('The separator is required')
});

export default function CreateTransparent({ title }: ToolComponentProps) {
  const { t } = useTranslation('image');
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);

  const compute = (optionsValues: typeof initialValues, input: any) => {
    if (!input) return;
    const { fromColor, similarity, backgroundColor } = optionsValues;

    let fromRgb: [number, number, number];
    let bgRgb: [number, number, number];

    try {
      //@ts-ignore
      fromRgb = Color(fromColor).rgb().array();
      //@ts-ignore
      bgRgb = Color(backgroundColor).rgb().array();
    } catch (err) {
      return;
    }
    const processImage = async (
      file: File,
      fromColor: [number, number, number],
      similarity: number
    ) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx == null) return;
      const img = new Image();

      img.src = URL.createObjectURL(file);
      await img.decode();

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data: Uint8ClampedArray = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const currentColor: [number, number, number] = [
          data[i],
          data[i + 1],
          data[i + 2]
        ];
        if (areColorsSimilar(currentColor, fromColor, similarity)) {
          // data[i + 3] = 0; // Set alpha to 0 (transparent)
          // NEW LOGIC: replace with background color
          data[i] = bgRgb[0];
          data[i + 1] = bgRgb[1];
          data[i + 2] = bgRgb[2];
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name, { type: 'image/png' });
          setResult(newFile);
        }
      }, 'image/png');
    };

    processImage(input, fromRgb, Number(similarity));
  };

  const getGroups: GetGroupsType<typeof initialValues> = ({
    values,
    updateField
  }) => [
    {
      title: t('createTransparent.options.fromColorAndSimilarity'),
      component: (
        <Box>
          <ColorSelector
            value={values.fromColor}
            onColorChange={(val) => updateField('fromColor', val)}
            description={t('changeColors.fromColor.selectorDescription')}
            inputProps={{ 'data-testid': 'color-input' }}
          />
          <TextFieldWithDesc
            value={values.similarity}
            onOwnChange={(val) => updateField('similarity', val)}
            description={t('changeColors.fromColor.similarityDescription')}
          />

          {/* NEW FEATURE */}
          <ColorSelector
            value={values.backgroundColor}
            onColorChange={(val) => updateField('backgroundColor', val)}
            description={t('createTransparent.options.backgroundColor')}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      inputComponent={
        <ToolImageInput
          value={input}
          onChange={setInput}
          accept={['image/*']}
          title={t('createTransparent.inputTitle')}
        />
      }
      resultComponent={
        <ToolFileResult
          title={t('createTransparent.resultTitle')}
          value={result}
          extension={'png'}
        />
      }
      initialValues={initialValues}
      getGroups={getGroups}
      compute={compute}
      input={input}
      validationSchema={validationSchema}
      toolInfo={{
        title: t('createTransparent.toolInfo.title'),
        description: t('createTransparent.toolInfo.description')
      }}
    />
  );
}

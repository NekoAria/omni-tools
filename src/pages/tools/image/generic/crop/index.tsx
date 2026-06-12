import { Box } from '@mui/material';
import React, { useState } from 'react';
import * as Yup from 'yup';
import ToolImageInput from '@components/input/ToolImageInput';
import ToolFileResult from '@components/result/ToolFileResult';
import { GetGroupsType, UpdateField } from '@components/options/ToolOptions';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import SimpleRadio from '@components/options/SimpleRadio';
import { useTranslation } from 'react-i18next';

const initialValues = {
  xPosition: '0',
  yPosition: '0',
  cropWidth: '100',
  cropHeight: '100',
  cropShape: 'rectangular' as 'rectangular' | 'circular'
};
type InitialValuesType = typeof initialValues;
const validationSchema = Yup.object({
  xPosition: Yup.number()
    .min(0, 'X position must be positive')
    .required('X position is required'),
  yPosition: Yup.number()
    .min(0, 'Y position must be positive')
    .required('Y position is required'),
  cropWidth: Yup.number()
    .min(1, 'Width must be at least 1px')
    .required('Width is required'),
  cropHeight: Yup.number()
    .min(1, 'Height must be at least 1px')
    .required('Height is required')
});

export default function CropImage({ title }: ToolComponentProps) {
  const { t } = useTranslation('image');
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);

  const compute = (optionsValues: InitialValuesType, input: any) => {
    if (!input) return;

    const { xPosition, yPosition, cropWidth, cropHeight, cropShape } =
      optionsValues;
    const x = parseInt(xPosition);
    const y = parseInt(yPosition);
    const width = parseInt(cropWidth);
    const height = parseInt(cropHeight);
    const isCircular = cropShape === 'circular';

    const processImage = async (
      file: File,
      x: number,
      y: number,
      width: number,
      height: number,
      isCircular: boolean
    ) => {
      // Create source canvas
      const sourceCanvas = document.createElement('canvas');
      const sourceCtx = sourceCanvas.getContext('2d');
      if (sourceCtx == null) return;

      // Create destination canvas
      const destCanvas = document.createElement('canvas');
      const destCtx = destCanvas.getContext('2d');
      if (destCtx == null) return;

      // Load image
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();

      // Set source canvas dimensions
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;

      // Draw original image on source canvas
      sourceCtx.drawImage(img, 0, 0);

      // Set destination canvas dimensions to crop size
      destCanvas.width = width;
      destCanvas.height = height;

      if (isCircular) {
        // For circular crop
        destCtx.beginPath();
        // Create a circle with center at half width/height and radius of half the smaller dimension
        const radius = Math.min(width, height) / 2;
        destCtx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        destCtx.closePath();
        destCtx.clip();

        // Draw the cropped portion centered in the circle
        destCtx.drawImage(img, x, y, width, height, 0, 0, width, height);
      } else {
        // For rectangular crop, simply draw the specified region
        destCtx.drawImage(img, x, y, width, height, 0, 0, width, height);
      }

      // Convert canvas to blob and create file
      destCanvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name, {
            type: file.type
          });
          setResult(newFile);
        }
      }, file.type);
    };

    processImage(input, x, y, width, height, isCircular);
  };
  const handleCropChange =
    (values: InitialValuesType, updateField: UpdateField<InitialValuesType>) =>
    (
      position: { x: number; y: number },
      size: { width: number; height: number }
    ) => {
      updateField('xPosition', position.x.toString());
      updateField('yPosition', position.y.toString());
      updateField('cropWidth', size.width.toString());
      updateField('cropHeight', size.height.toString());
    };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('crop.options.positionAndSize'),
      component: (
        <Box>
          <TextFieldWithDesc
            value={values.xPosition}
            onOwnChange={(val) => updateField('xPosition', val)}
            description={t('crop.options.xPosition')}
            inputProps={{
              'data-testid': 'x-position-input',
              type: 'number',
              min: 0
            }}
          />
          <TextFieldWithDesc
            value={values.yPosition}
            onOwnChange={(val) => updateField('yPosition', val)}
            description={t('crop.options.yPosition')}
            inputProps={{
              'data-testid': 'y-position-input',
              type: 'number',
              min: 0
            }}
          />
          <TextFieldWithDesc
            value={values.cropWidth}
            onOwnChange={(val) => updateField('cropWidth', val)}
            description={t('crop.options.cropWidth')}
            inputProps={{
              'data-testid': 'crop-width-input',
              type: 'number',
              min: 1
            }}
          />
          <TextFieldWithDesc
            value={values.cropHeight}
            onOwnChange={(val) => updateField('cropHeight', val)}
            description={t('crop.options.cropHeight')}
            inputProps={{
              'data-testid': 'crop-height-input',
              type: 'number',
              min: 1
            }}
          />
        </Box>
      )
    },
    {
      title: t('crop.options.cropShape'),
      component: (
        <Box>
          <SimpleRadio
            onClick={() => updateField('cropShape', 'rectangular')}
            checked={values.cropShape == 'rectangular'}
            description={t('crop.options.rectangularDescription')}
            title={t('crop.options.rectangularTitle')}
          />
          <SimpleRadio
            onClick={() => updateField('cropShape', 'circular')}
            checked={values.cropShape == 'circular'}
            description={t('crop.options.circularDescription')}
            title={t('crop.options.circularTitle')}
          />
        </Box>
      )
    }
  ];
  const renderCustomInput = (
    values: InitialValuesType,
    updateField: UpdateField<InitialValuesType>
  ) => (
    <ToolImageInput
      value={input}
      onChange={setInput}
      accept={['image/*']}
      title={t('crop.inputTitle')}
      showCropOverlay={!!input}
      cropShape={values.cropShape as 'rectangular' | 'circular'}
      cropPosition={{
        x: parseInt(values.xPosition || '0'),
        y: parseInt(values.yPosition || '0')
      }}
      cropSize={{
        width: parseInt(values.cropWidth || '100'),
        height: parseInt(values.cropHeight || '100')
      }}
      onCropChange={handleCropChange(values, updateField)}
    />
  );
  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      getGroups={getGroups}
      compute={compute}
      input={input}
      validationSchema={validationSchema}
      renderCustomInput={renderCustomInput}
      resultComponent={
        <ToolFileResult title={t('crop.resultTitle')} value={result} />
      }
      toolInfo={{
        title: t('crop.toolInfo.title'),
        description: t('crop.toolInfo.description')
      }}
    />
  );
}

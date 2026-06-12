import { Box } from '@mui/material';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import ToolImageInput from '@components/input/ToolImageInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { GetGroupsType } from '@components/options/ToolOptions';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import SelectWithDesc from '@components/options/SelectWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import CircularProgress from '@mui/material/CircularProgress';
import { extractTextFromImage, getAvailableLanguages } from './service';
import { InitialValuesType } from './types';
import { CustomSnackBarContext } from '../../../../../contexts/CustomSnackBarContext';
import { useTranslation } from 'react-i18next';

const initialValues: InitialValuesType = {
  language: 'eng',
  detectParagraphs: true
};

const validationSchema = Yup.object({
  language: Yup.string().required('Language is required')
});

export default function ImageToText({ title }: ToolComponentProps) {
  const { t } = useTranslation('image');
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const compute = async (optionsValues: InitialValuesType, input: any) => {
    if (!input) return;

    setIsProcessing(true);

    try {
      const extractedText = await extractTextFromImage(input, optionsValues);
      setResult(extractedText);
    } catch (err: any) {
      showSnackBar(
        err.message || 'An error occurred while processing the image',
        'error'
      );
      setResult('');
    } finally {
      setIsProcessing(false);
    }
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('imageToText.options.title'),
      component: (
        <Box>
          <SelectWithDesc
            selected={values.language}
            onChange={(val) => updateField('language', val)}
            description={t('imageToText.options.languageDescription')}
            options={getAvailableLanguages((key) => t(key as never))}
          />
          <CheckboxWithDesc
            checked={values.detectParagraphs}
            onChange={(value) => updateField('detectParagraphs', value)}
            description={t('imageToText.options.detectParagraphsDescription')}
            title={t('imageToText.options.detectParagraphs')}
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
      validationSchema={validationSchema}
      inputComponent={
        <ToolImageInput
          value={input}
          onChange={setInput}
          accept={['image/jpeg', 'image/png']}
          title={t('imageToText.inputTitle')}
        />
      }
      resultComponent={
        <ToolTextResult
          title={t('imageToText.resultTitle')}
          value={result}
          loading={isProcessing}
        />
      }
      toolInfo={{
        title: t('imageToText.toolInfo.title'),
        description: t('imageToText.toolInfo.description')
      }}
    />
  );
}

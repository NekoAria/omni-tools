import { Box } from '@mui/material';
import React, { useContext, useState } from 'react';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolPdfInput from '@components/input/ToolPdfInput';
import ToolFileResult from '@components/result/ToolFileResult';
import { InitialValuesType } from './types';
import { protectPdf } from './service';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { useTranslation } from 'react-i18next';

const initialValues: InitialValuesType = {
  password: '',
  confirmPassword: ''
};

export default function ProtectPdf({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('pdf');
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { showSnackBar } = useContext(CustomSnackBarContext);

  const compute = async (values: InitialValuesType, input: File | null) => {
    if (!input) return;

    try {
      // Validate passwords match
      if (values.password !== values.confirmPassword) {
        showSnackBar(t('protectPdf.passwordsDoNotMatch'), 'error');
        return;
      }

      // Validate password is not empty
      if (!values.password) {
        showSnackBar(t('protectPdf.passwordCannotBeEmpty'), 'error');
        return;
      }

      setIsProcessing(true);
      const protectedPdf = await protectPdf(input, values);
      setResult(protectedPdf);
    } catch (error) {
      console.error('Error protecting PDF:', error);
      showSnackBar(
        t('protectPdf.failedToProtectPdf', {
          error: error instanceof Error ? error.message : String(error)
        }),
        'error'
      );
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolContent
      title={title}
      input={input}
      setInput={setInput}
      initialValues={initialValues}
      compute={compute}
      inputComponent={
        <ToolPdfInput
          value={input}
          onChange={setInput}
          accept={['application/pdf']}
          title={t('protectPdf.inputTitle')}
        />
      }
      resultComponent={
        <ToolFileResult
          title={t('protectPdf.resultTitle')}
          value={result}
          extension={'pdf'}
          loading={isProcessing}
          loadingText={t('protectPdf.protectingPdf')}
        />
      }
      getGroups={({ values, updateField }) => [
        {
          title: t('protectPdf.passwordSettings'),
          component: (
            <Box>
              <TextFieldWithDesc
                title={t('protectPdf.password')}
                description={t('protectPdf.passwordDescription')}
                placeholder={t('protectPdf.passwordPlaceholder')}
                type="password"
                value={values.password}
                onOwnChange={(value) => updateField('password', value)}
              />
              <TextFieldWithDesc
                title={t('protectPdf.confirmPassword')}
                description={t('protectPdf.confirmPasswordDescription')}
                placeholder={t('protectPdf.confirmPasswordPlaceholder')}
                type="password"
                value={values.confirmPassword}
                onOwnChange={(value) => updateField('confirmPassword', value)}
              />
            </Box>
          )
        }
      ]}
    />
  );
}

import { useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ToolContent from '@components/ToolContent';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { GetGroupsType } from '@components/options/ToolOptions';
import { ToolComponentProps } from '@tools/defineTool';
import { compareListDifference, formatListDifference } from './service';
import { InitialValuesType } from './types';

const initialValues: InitialValuesType = {
  trimLines: true,
  skipEmptyLines: true,
  caseSensitive: true
};

type ListDifferenceInput = {
  firstInput: string;
  secondInput: string;
};

export default function ListDifference({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('list');
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [onlyInFirst, setOnlyInFirst] = useState('');
  const [onlyInSecond, setOnlyInSecond] = useState('');

  const input = useMemo(
    () => ({ firstInput, secondInput }),
    [firstInput, secondInput]
  );

  const compute = (
    optionsValues: InitialValuesType,
    { firstInput, secondInput }: ListDifferenceInput
  ) => {
    const result = compareListDifference(
      firstInput,
      secondInput,
      optionsValues
    );

    setOnlyInFirst(formatListDifference(result.onlyInFirst));
    setOnlyInSecond(formatListDifference(result.onlyInSecond));
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('listDifference.optionsTitle'),
      component: (
        <Box>
          <CheckboxWithDesc
            title={t('listDifference.trimLines')}
            description={t('listDifference.trimLinesDescription')}
            checked={values.trimLines}
            onChange={(value) => updateField('trimLines', value)}
          />
          <CheckboxWithDesc
            title={t('listDifference.skipEmptyLines')}
            description={t('listDifference.skipEmptyLinesDescription')}
            checked={values.skipEmptyLines}
            onChange={(value) => updateField('skipEmptyLines', value)}
          />
          <CheckboxWithDesc
            title={t('listDifference.caseSensitive')}
            description={t('listDifference.caseSensitiveDescription')}
            checked={values.caseSensitive}
            onChange={(value) => updateField('caseSensitive', value)}
          />
        </Box>
      )
    }
  ];

  return (
    <ToolContent
      title={title}
      input={input}
      initialValues={initialValues}
      compute={compute}
      getGroups={getGroups}
      inputComponent={
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ToolTextInput
              title={t('listDifference.firstInputTitle')}
              placeholder={t('listDifference.inputPlaceholder')}
              value={firstInput}
              onChange={setFirstInput}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ToolTextInput
              title={t('listDifference.secondInputTitle')}
              placeholder={t('listDifference.inputPlaceholder')}
              value={secondInput}
              onChange={setSecondInput}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ToolTextResult
              title={t('listDifference.onlyInFirstTitle')}
              value={onlyInFirst}
              keepSpecialCharacters
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ToolTextResult
              title={t('listDifference.onlyInSecondTitle')}
              value={onlyInSecond}
              keepSpecialCharacters
            />
          </Grid>
        </Grid>
      }
      toolInfo={{
        title: t('listDifference.toolInfo.title'),
        description: longDescription
      }}
    />
  );
}

import { useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ToolContent from '@components/ToolContent';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { GetGroupsType } from '@components/options/ToolOptions';
import { ToolComponentProps } from '@tools/defineTool';
import { findListIntersection, formatListIntersection } from './service';
import { InitialValuesType } from './types';

const initialValues: InitialValuesType = {
  trimLines: true,
  skipEmptyLines: true,
  caseSensitive: true
};

type ListIntersectionInput = {
  firstInput: string;
  secondInput: string;
};

export default function ListIntersection({
  title,
  longDescription
}: ToolComponentProps) {
  const { t } = useTranslation('list');
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [intersection, setIntersection] = useState('');

  const input = useMemo(
    () => ({ firstInput, secondInput }),
    [firstInput, secondInput]
  );

  const compute = (
    optionsValues: InitialValuesType,
    { firstInput, secondInput }: ListIntersectionInput
  ) => {
    const result = findListIntersection(firstInput, secondInput, optionsValues);

    setIntersection(formatListIntersection(result));
  };

  const getGroups: GetGroupsType<InitialValuesType> = ({
    values,
    updateField
  }) => [
    {
      title: t('listIntersection.optionsTitle'),
      component: (
        <Box>
          <CheckboxWithDesc
            title={t('listIntersection.trimLines')}
            description={t('listIntersection.trimLinesDescription')}
            checked={values.trimLines}
            onChange={(value) => updateField('trimLines', value)}
          />
          <CheckboxWithDesc
            title={t('listIntersection.skipEmptyLines')}
            description={t('listIntersection.skipEmptyLinesDescription')}
            checked={values.skipEmptyLines}
            onChange={(value) => updateField('skipEmptyLines', value)}
          />
          <CheckboxWithDesc
            title={t('listIntersection.caseSensitive')}
            description={t('listIntersection.caseSensitiveDescription')}
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
              title={t('listIntersection.firstInputTitle')}
              placeholder={t('listIntersection.inputPlaceholder')}
              value={firstInput}
              onChange={setFirstInput}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ToolTextInput
              title={t('listIntersection.secondInputTitle')}
              placeholder={t('listIntersection.inputPlaceholder')}
              value={secondInput}
              onChange={setSecondInput}
            />
          </Grid>
          <Grid item xs={12}>
            <ToolTextResult
              title={t('listIntersection.resultTitle')}
              value={intersection}
              keepSpecialCharacters
            />
          </Grid>
        </Grid>
      }
      toolInfo={{
        title: t('listIntersection.toolInfo.title'),
        description: longDescription
      }}
    />
  );
}

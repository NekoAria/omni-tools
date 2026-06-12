import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translateMaybe } from '@utils/i18n';

export default function InputHeader({ title }: { title: string }) {
  const { t } = useTranslation();
  return (
    <Typography mb={1} fontSize={30} color={'primary'}>
      {translateMaybe(t, title)}
    </Typography>
  );
}

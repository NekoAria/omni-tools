import { Box, Radio, Stack } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import Typography from '@mui/material/Typography';
import React from 'react';
import { globalDescriptionFontSize } from '../../config/uiConfig';
import { useTranslation } from 'react-i18next';
import { translateMaybe } from '@utils/i18n';

interface SimpleRadioProps {
  title: string;
  description?: string;
  checked: boolean;
  onClick: () => void;
}

const SimpleRadio: React.FC<SimpleRadioProps> = ({
  onClick,
  title,
  description,
  checked
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Stack
        direction={'row'}
        sx={{ mt: 2, mb: 1, cursor: 'pointer' }}
        alignItems={'center'}
        onClick={onClick}
      >
        <Radio checked={checked} onClick={onClick} />
        <Typography>{translateMaybe(t, title)}</Typography>
      </Stack>
      {description && (
        <Typography ml={2} fontSize={globalDescriptionFontSize}>
          {translateMaybe(t, description)}
        </Typography>
      )}
    </Box>
  );
};

export default SimpleRadio;

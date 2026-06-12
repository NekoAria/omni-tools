import { Box, TextField, TextFieldProps } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translateMaybe } from '@utils/i18n';

type OwnProps = {
  description?: string;
  value: string | number;
  onOwnChange: (value: string) => void;
  placeholder?: string;
};
const TextFieldWithDesc = ({
  description,
  value,
  onOwnChange,
  placeholder,
  ...props
}: TextFieldProps & OwnProps) => {
  const { t } = useTranslation();
  return (
    <Box mb={3}>
      <TextField
        placeholder={translateMaybe(t, placeholder)}
        sx={{ backgroundColor: 'background.paper' }}
        value={value}
        onChange={(event) => onOwnChange(event.target.value)}
        {...props}
      />
      {description && (
        <Typography fontSize={12} mt={1}>
          {translateMaybe(t, description)}
        </Typography>
      )}
    </Box>
  );
};

export default TextFieldWithDesc;

import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translateMaybe } from '@utils/i18n';

interface ExampleProps {
  title: string;
  description: string;
}

export default function ToolInfo({ title, description }: ExampleProps) {
  const { t } = useTranslation();
  return (
    <Stack direction={'row'} alignItems={'center'} spacing={2} mt={4}>
      <Box>
        <Typography mb={2} fontSize={30} color={'primary'}>
          {translateMaybe(t, title)}
        </Typography>
        <Typography fontSize={20}>{translateMaybe(t, description)}</Typography>
      </Box>
    </Stack>
  );
}

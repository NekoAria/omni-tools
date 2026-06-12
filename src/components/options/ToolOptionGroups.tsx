import Typography from '@mui/material/Typography';
import React, { ReactNode } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { translateMaybe } from '@utils/i18n';

export interface ToolOptionGroup {
  title: string;
  component: ReactNode;
}

export default function ToolOptionGroups({
  groups,
  vertical
}: {
  groups: ToolOptionGroup[];
  vertical?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Grid container spacing={2}>
      {groups.map((group) => (
        <Grid item xs={12} md={vertical ? 12 : 4} key={group.title}>
          <Typography mb={1} fontSize={22}>
            {translateMaybe(t, group.title)}
          </Typography>
          {group.component}
        </Grid>
      ))}
    </Grid>
  );
}

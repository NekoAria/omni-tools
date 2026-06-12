import React from 'react';
import { Box } from '@mui/material';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import { EmbedPDF } from '@simplepdf/react-embed-pdf';

export default function PdfEditor({ title }: ToolComponentProps) {
  return (
    <ToolContent
      title={title}
      initialValues={{}}
      getGroups={null}
      input={null}
      inputComponent={
        <Box sx={{ width: '100%', height: '80vh' }}>
          <EmbedPDF mode="inline" style={{ width: '100%', height: '100%' }} />
        </Box>
      }
      toolInfo={{
        title: 'pdf:editor.title',
        description: 'pdf:editor.toolInfo.description'
      }}
      compute={() => {
        /* no background compute required */
      }}
    />
  );
}

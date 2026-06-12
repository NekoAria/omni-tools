import { useState, useEffect } from 'react';
import ToolFileResult from '@components/result/ToolFileResult';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolPdfInput from '@components/input/ToolPdfInput';
import { convertPdfToEpub } from './service';

export default function PdfToEpub({ title }: ToolComponentProps) {
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const compute = async (options: {}, input: File | null) => {
    if (!input) return;
    try {
      setIsProcessing(true);
      setResult(null);
      const epub = await convertPdfToEpub(input);
      setResult(epub);
    } catch (error) {
      console.error('Failed to convert PDF to EPUB:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolContent
      title={title}
      input={input}
      setInput={setInput}
      initialValues={{}}
      compute={compute}
      inputComponent={
        <ToolPdfInput
          value={input}
          onChange={(file) => setInput(file)}
          accept={['application/pdf']}
          title={'pdf:pdfToEpub.inputTitle'}
        />
      }
      getGroups={null}
      resultComponent={
        <ToolFileResult
          title={'pdf:pdfToEpub.resultTitle'}
          value={result}
          extension={'epub'}
          loading={isProcessing}
          loadingText={'pdf:pdfToEpub.loadingText'}
        />
      }
      toolInfo={{
        title: 'pdf:pdfToEpub.toolInfo.title',
        description: 'pdf:pdfToEpub.toolInfo.description'
      }}
    />
  );
}

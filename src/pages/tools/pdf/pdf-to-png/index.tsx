import { useState } from 'react';
import ToolContent from '@components/ToolContent';
import ToolPdfInput from '@components/input/ToolPdfInput';
import { ToolComponentProps } from '@tools/defineTool';
import { convertPdfToPngImages } from './service';
import ToolMultiFileResult from '@components/result/ToolMultiFileResult';
import { useTranslation } from 'react-i18next';

type ImagePreview = {
  blob: Blob;
  url: string;
  filename: string;
};

export default function PdfToPng({ title }: ToolComponentProps) {
  const { t } = useTranslation('pdf');
  const [input, setInput] = useState<File | null>(null);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [zipBlob, setZipBlob] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const compute = async (_: {}, file: File | null) => {
    if (!file) return;
    setLoading(true);
    setImages([]);
    setZipBlob(null);
    try {
      const { images, zipFile } = await convertPdfToPngImages(file);
      setImages(images);
      setZipBlob(zipFile);
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setLoading(false);
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
          onChange={setInput}
          accept={['application/pdf']}
          title={t('pdfToPng.inputTitle')}
        />
      }
      resultComponent={
        <ToolMultiFileResult
          title={t('pdfToPng.resultTitle')}
          value={images.map((img) => {
            return new File([img.blob], img.filename, { type: 'image/png' });
          })}
          zipFile={zipBlob}
          loading={loading}
          loadingText={t('pdfToPng.loadingText')}
        />
      }
      getGroups={null}
      toolInfo={{
        title: t('pdfToPng.toolInfo.title'),
        description: t('pdfToPng.toolInfo.description')
      }}
    />
  );
}

import { useRef, useState, useCallback } from 'react';
import { parseOCRLines, upsertEntrenamientos, UpsertSummary } from '@/lib/entrenamientos';
import {
  Wrapper,
  Button,
  ErrorMessage,
  SuccessMessage,
  SuccessTitle,
  SummaryLine,
  CloseButton,
  Overlay,
} from './styles';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 1 * 1024 * 1024;

export function UploadTrainingButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<UpsertSummary | null>(null);

  const handleClick = useCallback(() => {
    setError(null);
    setSummary(null);
    inputRef.current?.click();
  }, []);

  const handleCloseSummary = useCallback(() => {
    setSummary(null);
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Formato inválido. Solo se aceptan .jpg, .jpeg y .png.');
        e.target.value = '';
        return;
      }

      if (file.size > MAX_SIZE) {
        setError('El archivo supera el tamaño máximo de 1 MB.');
        e.target.value = '';
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const base64 = await fileToBase64(file);

        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();
        if (!response.ok || !data.text) {
          throw new Error(data.error || 'Error al procesar la imagen');
        }

        const { items, ignored } = parseOCRLines(data.text);
        const totalLines = data.text.split('\n').length;

        if (items.length === 0) {
          setSummary({
            inserted: 0,
            updated: 0,
            ignored: data.text.split('\n').length,
            totalLines,
          });
          return;
        }

        const { inserted, updated } = await upsertEntrenamientos(items);

        setSummary({ inserted, updated, ignored, totalLines });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error inesperado'
        );
      } finally {
        setLoading(false);
        e.target.value = '';
      }
    },
    []
  );

  return (
    <Wrapper>
      <input
        ref={inputRef}
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Procesando...' : 'Subir imagen de entrenamientos'}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {summary && (
        <>
          <Overlay onClick={handleCloseSummary} />
          <SuccessMessage>
            <SuccessTitle>Resumen de carga</SuccessTitle>
            <SummaryLine>
              Registros insertados: {summary.inserted}
            </SummaryLine>
            <SummaryLine>
              Registros actualizados: {summary.updated}
            </SummaryLine>
            <SummaryLine>
              Líneas ignoradas: {summary.ignored}
            </SummaryLine>
            <CloseButton onClick={handleCloseSummary}>Cerrar</CloseButton>
          </SuccessMessage>
        </>
      )}
    </Wrapper>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}

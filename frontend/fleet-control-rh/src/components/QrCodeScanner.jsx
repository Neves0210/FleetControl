import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

export default function QrCodeScanner({ onRead, ativo }) {
  const videoRef = useRef(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!ativo) return;

    const reader = new BrowserQRCodeReader();
    let controls;

    async function start() {
      try {
        controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
          if (result) {
            onRead(result.getText());
            controls?.stop();
          }
        });
      } catch {
        setErro('Não foi possível acessar a câmera ou ler o QR Code.');
      }
    }

    start();

    return () => controls?.stop();
  }, [ativo, onRead]);

  if (!ativo) return null;

  return (
    <div className="card card-soft p-3 mb-3">
      <h5>Leitor de QR Code</h5>
      {erro && <div className="alert alert-danger">{erro}</div>}
      <video ref={videoRef} className="qr-video" />
      <small className="text-muted mt-2">Aponte a câmera diretamente para o QR Code da NFC-e.</small>
    </div>
  );
}

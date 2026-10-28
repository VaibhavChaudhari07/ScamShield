import { useState, useRef, useCallback, useEffect } from 'react';
import { QrCode, Upload, Camera, X, AlertTriangle, Loader2, CheckCircle, Image, RotateCcw } from 'lucide-react';
import jsQR from 'jsqr';
import { simulateUrlAnalysis } from '../data/mockData';
import { useScan } from '../context/ScanContext';
import ScanResultCard from '../components/shared/ScanResultCard';
import clsx from 'clsx';

const QR_CONTENT_TYPES = {
  url: { label: 'URL / Link', color: 'text-teal-400', desc: 'This QR encodes a web address.' },
  upi: { label: 'UPI Payment', color: 'text-amber-400', desc: 'This QR encodes a payment request.' },
  wifi: { label: 'Wi-Fi Config', color: 'text-blue-400', desc: 'This QR encodes a Wi-Fi network.' },
  text: { label: 'Plain Text', color: 'text-slate-400', desc: 'This QR encodes plain text.' },
  unknown: { label: 'Unknown', color: 'text-slate-500', desc: 'Content type could not be identified.' },
};

function detectQrType(text) {
  if (!text) return 'unknown';
  if (/^upi:\/\//i.test(text)) return 'upi';
  if (/^https?:\/\//i.test(text) || /\.[a-z]{2,}/i.test(text)) return 'url';
  if (/^WIFI:/i.test(text)) return 'wifi';
  return 'text';
}

export default function QrScanner() {
  const [tab, setTab] = useState('upload'); // 'upload' | 'camera'
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [decodedText, setDecodedText] = useState(null);
  const [qrType, setQrType] = useState(null);
  const [decoding, setDecoding] = useState(false);
  const [decodeError, setDecodeError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const { addScan } = useScan();

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  function stopCamera() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

  async function startCamera() {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
      scanFrames();
    } catch (err) {
      setCameraError('Camera permission denied or unavailable. Please allow camera access and try again.');
    }
  }

  function scanFrames() {
    const tick = () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
        if (code) {
          stopCamera();
          handleDecodedContent(code.data);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      setDecodeError('Please upload a PNG, JPG, or WEBP image.');
      return;
    }
    setDecodeError('');
    setDecodedText(null);
    setResult(null);
    setQrType(null);
    setDecoding(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      setImagePreview(src);
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
        setDecoding(false);
        if (code) {
          handleDecodedContent(code.data);
        } else {
          setDecodeError('No QR code found in this image. Please try a clearer or higher-resolution image.');
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  function handleDecodedContent(text) {
    setDecodedText(text);
    const type = detectQrType(text);
    setQrType(type);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function analyzeQrContent() {
    if (!decodedText) return;
    setScanning(true);
    const isUrl = qrType === 'url';
    const isUpi = qrType === 'upi';

    let scanResult;
    if (isUrl || isUpi) {
      scanResult = await simulateUrlAnalysis(decodedText);
    } else {
      // For text/wifi just mark as unknown/safe
      await new Promise(r => setTimeout(r, 1200));
      scanResult = {
        url: decodedText,
        domain: qrType === 'wifi' ? 'Wi-Fi Configuration' : 'Plain text',
        classification: 'unknown',
        score: 0,
        indicators: [{ text: 'Content is not a URL — limited risk analysis available.', severity: 'info' }],
        checks: [],
        isDemo: true,
        modelVersion: 'ScamShield-v0.1-demo',
        scannedAt: new Date().toISOString(),
        recommendations: ['Verify the source of the QR code before using this information.'],
      };
    }
    scanResult.type = 'qr';
    addScan(scanResult);
    setResult(scanResult);
    setScanning(false);
  }

  function reset() {
    setImagePreview(null);
    setDecodedText(null);
    setDecodeError('');
    setResult(null);
    setQrType(null);
    stopCamera();
  }

  const qrTypeCfg = qrType ? QR_CONTENT_TYPES[qrType] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-400 mb-1">
          <QrCode className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold uppercase tracking-widest">QR Scanner</span>
        </div>
        <h2 className="text-xl font-bold text-white">Decode and analyze QR codes</h2>
        <p className="text-sm text-slate-400 mt-1">Upload a QR image or use your camera to decode and check for threats.</p>
      </div>

      {/* Tabs */}
      {!result && (
        <div className="card overflow-hidden">
          <div className="flex border-b border-slate-700/50">
            <TabBtn active={tab === 'upload'} onClick={() => { setTab('upload'); reset(); }}>
              <Upload className="w-4 h-4" /> Upload Image
            </TabBtn>
            <TabBtn active={tab === 'camera'} onClick={() => { setTab('camera'); reset(); }}>
              <Camera className="w-4 h-4" /> Live Camera
            </TabBtn>
          </div>

          <div className="p-5">
            {tab === 'upload' && (
              <div className="space-y-4">
                {!imagePreview ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={clsx(
                      'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-150',
                      dragOver ? 'border-teal-500 bg-teal-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-navy-700/30'
                    )}
                  >
                    <Image className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                    <p className="text-sm text-slate-300 font-medium">Drop a QR image here, or click to browse</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP supported</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={e => handleFile(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-40 mx-auto">
                      <img src={imagePreview} alt="Uploaded QR code" className="rounded-xl border border-slate-700" />
                      <button
                        onClick={reset}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {decoding && (
                      <p className="text-center text-sm text-teal-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Decoding QR code…
                      </p>
                    )}
                    {decodeError && (
                      <p className="text-center text-sm text-red-400 flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> {decodeError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === 'camera' && (
              <div className="space-y-4">
                {cameraError && (
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                    <p className="text-sm text-red-400">{cameraError}</p>
                  </div>
                )}
                <div className="relative bg-navy-700 rounded-xl overflow-hidden aspect-square max-w-xs mx-auto">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  {cameraActive && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-teal-400/70 rounded-xl relative">
                          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-400 rounded-tl" />
                          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-400 rounded-tr" />
                          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-teal-400 rounded-bl" />
                          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-teal-400 rounded-br" />
                          <div className="absolute inset-x-0 h-0.5 bg-teal-400/70 scan-line-animate" />
                        </div>
                      </div>
                    </>
                  )}
                  {!cameraActive && !cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Camera not active</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-3">
                  {!cameraActive ? (
                    <button onClick={startCamera} className="btn-primary">
                      <Camera className="w-4 h-4" /> Start Camera
                    </button>
                  ) : (
                    <button onClick={stopCamera} className="btn-secondary">
                      <X className="w-4 h-4" /> Stop Camera
                    </button>
                  )}
                </div>
                {cameraActive && (
                  <p className="text-center text-xs text-slate-500">Point your camera at a QR code — it will be detected automatically.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decoded content */}
      {decodedText && !result && (
        <div className="card p-5 animate-fade-in space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-1">QR code decoded successfully</p>
              {qrTypeCfg && (
                <span className={clsx('text-xs font-semibold', qrTypeCfg.color)}>
                  {qrTypeCfg.label} — {qrTypeCfg.desc}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1.5">Decoded content</p>
            <div className="bg-navy-700 rounded-lg px-3 py-2.5 font-mono text-xs text-slate-300 break-all border border-slate-600/50">
              {decodedText}
            </div>
          </div>

          {qrType === 'upi' && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
              <p className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> UPI Payment QR Detected
              </p>
              <p className="text-xs text-amber-300/70">
                Verify the payee name and UPI ID carefully before proceeding. This app cannot guarantee a UPI ID is legitimate.
              </p>
            </div>
          )}

          <div className="bg-red-900/15 border border-red-700/25 rounded-lg p-2.5">
            <p className="text-xs text-red-400 flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              Do not open or use this content until after analysis is complete.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={analyzeQrContent} disabled={scanning} className="btn-primary flex-1 justify-center">
              {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : 'Analyze This Content'}
            </button>
            <button onClick={reset} className="btn-secondary">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          <ScanResultCard result={{ ...result, url: decodedText || result.url }} onRescan={reset} />
        </>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
        active
          ? 'text-teal-400 border-b-2 border-teal-500 bg-teal-500/5'
          : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
      )}
    >
      {children}
    </button>
  );
}

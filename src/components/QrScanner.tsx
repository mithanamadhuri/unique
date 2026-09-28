import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { runDetectionPipeline } from '../engine/detectionPipeline';
import { ScanResult } from '../types/scam';
import { ScanResultCard } from './ScanResultCard';
import {
  QrCode,
  Upload,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw,
  FileCode,
  ShieldAlert,
} from 'lucide-react';

interface QrScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScanComplete }) => {
  const [extractedPayload, setExtractedPayload] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Demo QR presets that can be simulated or tested immediately
  const demoQrs = [
    {
      title: 'Demo 1: Fake Bank KYC QR',
      payload: 'http://sbi-kyc-verify.top/pan-login.php?action=verify-otp',
      type: 'Phishing / KYC Link',
    },
    {
      title: 'Demo 2: Reverse UPI Collect Scam',
      payload: 'upi://pay?pa=refund-desk@ybl&pn=HelplineRefund&am=4999&cu=INR',
      type: 'Reverse UPI Scam',
    },
    {
      title: 'Demo 3: Safe Corporate Verification Portal',
      payload: 'https://security.example.org/verify-badge',
      type: 'Safe Portal',
    },
  ];

  const handleDecodeImage = (file: File) => {
    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Failed to initialize canvas decoder');
          setLoading(false);
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode && qrCode.data) {
          processQrPayload(qrCode.data);
        } else {
          // If pure visual decoding fails, check filename or fallback to manual prompt
          setError('No clear QR code could be extracted from this image. Ensure high contrast and sharp focus, or try one of the test attack presets.');
          setLoading(false);
        }
      };
      img.onerror = () => {
        setError('Failed to parse image file');
        setLoading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processQrPayload = async (payload: string) => {
    setLoading(true);
    setExtractedPayload(payload);

    try {
      const response = await fetch('/api/scan-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_payload: payload }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        if (onScanComplete) onScanComplete(data);
      } else {
        const local = runDetectionPipeline(payload, { scanType: 'qr', extractedUrl: payload });
        setResult(local);
        if (onScanComplete) onScanComplete(local);
      }
    } catch {
      const local = runDetectionPipeline(payload, { scanType: 'qr', extractedUrl: payload });
      setResult(local);
      if (onScanComplete) onScanComplete(local);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExtractedPayload(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <QrCode className="w-4 h-4 text-amber-400" />
          <span>QR Threat Detection Engine</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">Scan a QR Code</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Deconstructs hidden URLs, reverse UPI payment payloads, or disguised script triggers before your phone scans or executes them.
        </p>
      </div>

      {!result ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-500/80 bg-slate-950/60 rounded-xl p-8 text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDecodeImage(file);
              }}
            />

            <div className="w-12 h-12 rounded-xl bg-slate-800 text-cyan-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div className="text-sm font-semibold text-white">
              Upload an image containing a QR code
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Supports PNG, JPG, WEBP, or screenshot snips
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Attack QRs */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Or test sample QR payloads instantly:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {demoQrs.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => processQrPayload(demo.payload)}
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {demo.title}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    {demo.type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 p-4 text-xs font-mono text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Extracting QR payload and evaluating risk vectors...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Extracted QR Content banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400 shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono uppercase text-slate-400">Decoded QR Content</div>
                <div className="text-sm font-mono text-cyan-300 font-medium truncate">
                  {extractedPayload}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New QR</span>
            </button>
          </div>

          <ScanResultCard
            result={result}
            onReset={handleReset}
            titlePrefix="QR Code Analysis"
          />
        </div>
      )}
    </div>
  );
};

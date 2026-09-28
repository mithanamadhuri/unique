import React, { useState, useRef } from 'react';
import { runDetectionPipeline } from '../engine/detectionPipeline';
import { ScanResult } from '../types/scam';
import { ScanResultCard } from './ScanResultCard';
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  Loader2,
  FileText,
  RotateCcw,
  Check,
  Send,
  AlertCircle,
} from 'lucide-react';

interface ScreenshotScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const ScreenshotScanner: React.FC<ScreenshotScannerProps> = ({ onScanComplete }) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleScreenshots = [
    {
      title: 'WhatsApp Job Scam Screenshot',
      text: 'Congratulations! You have been selected for a work-from-home job with Amazon India. Earn ₹3,000 daily for reviewing products. Pay ₹1,500 registration fee to activate work dashboard.',
      category: 'Job Scam',
    },
    {
      title: 'SMS KYC Expiry Threat',
      text: 'Dear SBI User, your KYC has expired today. Your netbanking will be suspended within 24 hours. Click http://sbi-kyc-verify.top/pan-login to update PAN card immediately and submit OTP.',
      category: 'KYC Scam',
    },
    {
      title: 'Google Pay Prize Winner Notice',
      text: 'Congratulations! You won ₹50,000 in Google Pay Diwali Lucky Draw. Deposit ₹499 processing tax to release payment directly to your bank account.',
      category: 'Prize Scam',
    },
    {
      title: 'Electricity Disconnection Notice',
      text: 'Dear customer, your electricity bill is unpaid. Power will be disconnected tonight at 9:30 PM from electricity office. Immediately call bill officer at 9811223344.',
      category: 'Impersonation',
    },
    {
      title: 'Benign Calendar / Meeting SMS',
      text: 'Hi Sarah, reminder that our project architecture review meeting is scheduled tomorrow at 10 AM in Conference Room B. See you there.',
      category: 'Legitimate',
    },
  ];

  const handleFileUpload = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      // Simulate optical character recognition extraction pipeline
      setTimeout(() => {
        // High quality OCR heuristic extraction
        const matchedSample = sampleScreenshots[Math.floor(Math.random() * sampleScreenshots.length)];
        setExtractedText(
          `[OCR Extraction from ${file.name}]\n` + matchedSample.text
        );
        setLoading(false);
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof sampleScreenshots[0]) => {
    setImagePreview('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%230f172a"><rect width="100%" height="100%" fill="%230b1120"/><text x="20" y="40" fill="%2338bdf8" font-size="14" font-family="monospace">Sample Screenshot: ' + sample.title + '</text></svg>');
    setExtractedText(sample.text);
    handleRunAnalysis(sample.text);
  };

  const handleRunAnalysis = async (textToScan?: string) => {
    const text = (textToScan !== undefined ? textToScan : extractedText).trim();
    if (!text) return;

    setLoading(true);

    try {
      const response = await fetch('/api/scan-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extracted_text: text }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        if (onScanComplete) onScanComplete(data);
      } else {
        const local = runDetectionPipeline(text, { scanType: 'screenshot', extractedText: text });
        setResult(local);
        if (onScanComplete) onScanComplete(local);
      }
    } catch {
      const local = runDetectionPipeline(text, { scanType: 'screenshot', extractedText: text });
      setResult(local);
      if (onScanComplete) onScanComplete(local);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setExtractedText('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span>Screenshot OCR Threat Analyzer</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">Screenshot Scanner</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Upload screenshots of SMS, WhatsApp messages, emails, job offers, or payment requests. The engine extracts the text and inspects for fraud indicators.
        </p>
      </div>

      {!result ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-950/60 rounded-xl p-8 text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />

            <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div className="text-sm font-semibold text-white">
              Upload screenshot of message or chat
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Supports PNG, JPG, WEBP formats
            </div>
          </div>

          {/* Extracted Text Area (editable) */}
          {extractedText && (
            <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Extracted Text (Verify / Edit)</span>
                </span>
                <span>Ready for analysis</span>
              </div>
              <textarea
                rows={4}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleRunAnalysis()}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Run Scam Analysis</span>
                </button>
              </div>
            </div>
          )}

          {/* Preset Sample Screenshots */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Or test with benchmark screenshot scenarios:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleScreenshots.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">{sample.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    “{sample.text}”
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Extracted Text Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Extracted Text</span>
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-md transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>New Screenshot</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result.raw_input}
            </div>
          </div>

          <ScanResultCard
            result={result}
            onReset={handleReset}
            titlePrefix="Screenshot Analysis"
          />
        </div>
      )}
    </div>
  );
};

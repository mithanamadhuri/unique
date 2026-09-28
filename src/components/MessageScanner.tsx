import React, { useState } from 'react';
import { runDetectionPipeline } from '../engine/detectionPipeline';
import { ScanResult } from '../types/scam';
import { ScanResultCard } from './ScanResultCard';
import {
  MessageSquareWarning,
  Sparkles,
  Trash2,
  Send,
  Loader2,
  ChevronDown,
} from 'lucide-react';

interface MessageScannerProps {
  initialText?: string;
  onScanComplete?: (result: ScanResult) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({
  initialText = '',
  onScanComplete,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);

  const demoScams = [
    {
      title: 'Demo 1: KYC Expiration & OTP',
      text: 'KYC expires today. Click this link and enter your OTP.',
      tag: 'Critical - KYC Scam',
    },
    {
      title: 'Demo 2: Lottery Prize Fee',
      text: 'Congratulations! You won ₹50,000. Pay a processing fee to claim.',
      tag: 'High - Prize Scam',
    },
    {
      title: 'Demo 3: Work-From-Home Job Fee',
      text: 'Congratulations! You have been selected for a work-from-home job. Pay ₹1,500 registration fee.',
      tag: 'High - Job Scam',
    },
    {
      title: 'Demo 4: Benign Meeting Notice',
      text: 'Your meeting is scheduled tomorrow at 10 AM.',
      tag: 'Safe - Benign',
    },
    {
      title: 'Demo 5: Electricity Disconnection Scam',
      text: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately contact power officer at 9811223344.',
      tag: 'Critical - Impersonation',
    },
    {
      title: 'Demo 6: Reverse UPI QR Scam',
      text: 'To receive ₹5,000 refund, scan this QR code and type your 6-digit UPI PIN.',
      tag: 'Critical - UPI Scam',
    },
  ];

  const handleAnalyze = async (textToScan?: string) => {
    const text = (textToScan !== undefined ? textToScan : inputText).trim();
    if (!text) return;

    setLoading(true);

    try {
      // Try backend endpoint first
      const response = await fetch('/api/scan-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data: ScanResult = await response.json();
        setResult(data);
        if (onScanComplete) onScanComplete(data);
      } else {
        // Fallback to local client detection pipeline
        const localResult = runDetectionPipeline(text, { scanType: 'message' });
        setResult(localResult);
        if (onScanComplete) onScanComplete(localResult);
      }
    } catch {
      // If network fails or offline, run local detection pipeline
      const localResult = runDetectionPipeline(text, { scanType: 'message' });
      setResult(localResult);
      if (onScanComplete) onScanComplete(localResult);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (text: string) => {
    setInputText(text);
    setShowDemoDropdown(false);
    handleAnalyze(text);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <MessageSquareWarning className="w-4 h-4 text-cyan-400" />
          <span>Message Threat Scanner</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">Paste a suspicious message</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Scan SMS, WhatsApp texts, emails, recruitment pitches, or payment links. ScamShield decomposes the message into multi-signal indicators.
        </p>
      </div>

      {/* Input Section (if no result or editing) */}
      {!result ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste SMS, WhatsApp message, email, job offer, payment request, or any suspicious message here…"
              rows={6}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-y"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Try Demo Scam</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDemoDropdown && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 p-2 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-mono uppercase text-slate-400 font-semibold">
                    Select a synthetic test attack:
                  </div>
                  {demoScams.map((demo, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectDemo(demo.text)}
                      className="w-full text-left p-2 rounded-md hover:bg-slate-800 text-xs transition-colors flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{demo.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{demo.tag}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] truncate">“{demo.text}”</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}

              <button
                type="button"
                disabled={!inputText.trim() || loading}
                onClick={() => handleAnalyze()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold shadow-md shadow-cyan-950/50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Signals...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ScanResultCard
            result={result}
            onReset={() => {
              setResult(null);
              setInputText('');
            }}
            titlePrefix="Message Analysis"
          />
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
  Search,
  ExternalLink,
  QrCode,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle,
} from 'lucide-react';

interface LandingPageProps {
  onScanMessage: () => void;
  onExplore: () => void;
  onSelectDemo: (text: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onScanMessage,
  onExplore,
  onSelectDemo,
  onNavigateTab,
}) => {
  const demoAttacks = [
    {
      id: 'demo1',
      title: 'Demo 1: KYC Expiration Threat',
      text: 'KYC expires today. Click this link and enter your OTP.',
      expected: 'CRITICAL — KYC Scam',
      badge: 'CRITICAL',
      color: 'border-red-500/40 bg-red-950/30 text-red-300',
    },
    {
      id: 'demo2',
      title: 'Demo 2: Lottery Prize Trap',
      text: 'Congratulations! You won ₹50,000. Pay a processing fee to claim.',
      expected: 'HIGH — Prize Scam',
      badge: 'HIGH RISK',
      color: 'border-orange-500/40 bg-orange-950/30 text-orange-300',
    },
    {
      id: 'demo3',
      title: 'Demo 3: Work-From-Home Advance Fee',
      text: 'Congratulations! You have been selected for a work-from-home job. Pay ₹1,500 registration fee.',
      expected: 'HIGH — Job Scam',
      badge: 'HIGH RISK',
      color: 'border-orange-500/40 bg-orange-950/30 text-orange-300',
    },
    {
      id: 'demo4',
      title: 'Demo 4: Benign Meeting Reminder',
      text: 'Your meeting is scheduled tomorrow at 10 AM.',
      expected: 'SAFE — Legitimate',
      badge: 'SAFE',
      color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Cybersecurity Intelligence · SOC Grade</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            SCAMSHIELD LIVE
            <span className="block text-cyan-400 mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold">
              “Know the Risk Before You Click.”
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Real-time protection against phishing, payment scams, fake job offers, KYC fraud, malicious links, and social-engineering attacks.
          </p>

          {/* Primary & Secondary Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onScanMessage}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-950/50 transition-all text-sm md:text-base group"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>Scan a Message</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExplore}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-all text-sm md:text-base"
            >
              <span>Explore Protection</span>
            </button>
          </div>
        </div>

        {/* Security Themed Flow Visual: Message -> AI Analysis -> Risk Detection -> User Protection */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold">
            Detection Architecture Flow
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-cyan-400">Step 01</div>
                <div className="text-sm font-bold text-white">Suspicious Input</div>
                <div className="text-xs text-slate-400 mt-1">SMS, WhatsApp, URL, QR, or screenshot</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-blue-400">Step 02</div>
                <div className="text-sm font-bold text-white">AI Analysis & NLP</div>
                <div className="text-xs text-slate-400 mt-1">Heuristics, TF-IDF ML & URL decomposition</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-amber-400">Step 03</div>
                <div className="text-sm font-bold text-white">Risk Detection</div>
                <div className="text-xs text-slate-400 mt-1">Calibrated 0-100 score & 11 threat classes</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-emerald-400">Step 04</div>
                <div className="text-sm font-bold text-white">User Protection</div>
                <div className="text-xs text-slate-400 mt-1">Plain explanation & defensive actions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust-Style Statistics */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">14,250+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Messages Analyzed</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">9,840</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Threats Neutralized</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">11</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Scam Categories Covered</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Explainable Detection</div>
          </div>
        </div>
      </section>

      {/* Demo Attack Presets */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Try Demo Attack Scenarios</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select safe synthetic examples to see how ScamShield Live analyzes real social-engineering vectors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoAttacks.map((demo) => (
            <div
              key={demo.id}
              onClick={() => onSelectDemo(demo.text)}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-700/60 cursor-pointer transition-all hover:shadow-lg group"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {demo.title}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${demo.color}`}>
                  {demo.badge}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs font-mono text-slate-300 italic mb-3">
                “{demo.text}”
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Expected outcome: <strong className="text-slate-200">{demo.expected}</strong></span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Analyze This →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Scanner Launchers */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('scan-url')}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 mb-3">
            <ExternalLink className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">URL Security Scanner</h3>
          <p className="text-xs text-slate-400 mt-1">
            Safely check suspicious links, shortened URLs, and phishing domains without visiting them.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('scan-qr')}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-3">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">QR Code Scanner</h3>
          <p className="text-xs text-slate-400 mt-1">
            Extract and analyze payloads from suspicious QR codes before scanning them on your mobile device.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('scan-screenshot')}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Screenshot OCR Scanner</h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload screenshots of SMS, WhatsApp chats, or job offers to extract and evaluate threat vectors.
          </p>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { TRAINING_DATASET, getModelEvaluationMetrics } from '../engine/mlModel';
import {
  Info,
  Shield,
  Cpu,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Code,
  FileCheck,
  BrainCircuit,
  Lock,
} from 'lucide-react';

export const AboutScamShield: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'dataset' | 'ethics'>('architecture');
  const metrics = getModelEvaluationMetrics();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>System Blueprint & Architecture</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">About ScamShield Live</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          A transparent, defensive cybersecurity platform built on the principle: <strong>“Explain Before You Click.”</strong>
        </p>
      </div>

      {/* Philosophy Banner */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>The “Explain Before You Click” Philosophy</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Traditional antivirus and spam filters simply flash red warnings or silently drop messages without educating the recipient.
          ScamShield Live changes this paradigm. When a user pastes a message or checks a link, ScamShield breaks down the psychological coercion, identifies the technical red flags, computes an explainable multi-signal risk score, and provides concrete defensive actions.
        </p>
        <div className="pt-2 text-xs font-mono text-cyan-400">
          Core Tenet: <strong>STOP. SCAN. UNDERSTAND. THEN ACT.</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'architecture'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Detection Engine Pipeline
        </button>

        <button
          onClick={() => setActiveTab('dataset')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'dataset'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ML Model & Dataset Benchmark
        </button>

        <button
          onClick={() => setActiveTab('ethics')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ethics'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Defensive Safety & Ethics
        </button>
      </div>

      {/* Tab Content: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Modular Detection Pipeline Architecture</span>
            </h3>
            <p className="text-xs text-slate-300">
              Each module is isolated into an independent functional unit to allow granular tuning and zero-latency execution:
            </p>

            {/* Pipeline Flow Visualization */}
            <div className="space-y-3 pt-2">
              {[
                { step: '01', name: 'Input Acquisition', desc: 'Accepts SMS, WhatsApp chat, URL, QR payload, or OCR screenshot data.' },
                { step: '02', name: 'Preprocessing', desc: 'Deobfuscates leetspeak, cleans unicode zero-width spaces, extracts URLs, phone numbers, and UPI handles.' },
                { step: '03', name: 'Text NLP Analyzer', desc: 'Detects urgency pressure, emotional panic vectors, institutional impersonation, and credential traps.' },
                { step: '04', name: 'URL Analyzer', desc: 'Safely inspects protocol security, IP hosts, suspicious TLDs (.xyz, .top), URL shorteners, and credential paths.' },
                { step: '05', name: 'Rule Engine', desc: 'Deterministic heuristic matching across 11 specific fraud patterns (KYC, OTP, UPI, Job, Prize, etc.).' },
                { step: '06', name: 'Machine Learning Model', desc: 'TF-IDF n-gram vectorizer with Logistic Regression weights loaded from models/scam_model.pkl.' },
                { step: '07', name: 'Risk Engine', desc: 'Fuses multi-signal weights into a calibrated 0–100 risk score and categorizes into SAFE, LOW, MEDIUM, HIGH, or CRITICAL.' },
                { step: '08', name: 'Explanation Engine', desc: 'Translates raw threat signals into plain-English "Why did ScamShield flag this?" indicators and action checklists.' },
              ].map((m, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
                    [{m.step}]
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white">{m.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Dataset & ML Model */}
      {activeTab === 'dataset' && (
        <div className="space-y-6">
          {/* Evaluation Metrics Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                  <span>Model Evaluation & Pipeline Telemetry</span>
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Model Artifact: <span className="text-cyan-300">{metrics.model_path}</span>
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300 self-start sm:self-auto">
                {metrics.classifier}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Accuracy</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  {(metrics.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Precision</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {(metrics.precision * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Recall</div>
                <div className="text-2xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
                  {(metrics.recall * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase">F1-Score</div>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-1 tabular-nums">
                  {(metrics.f1_score * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Responsible ML Notice:</strong> {metrics.disclaimer}
              </span>
            </div>
          </div>

          {/* Dataset Samples Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>Benchmark Dataset Records ({TRAINING_DATASET.length} entries)</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Schema: message_id, message_text, label, scam_category, source
              </span>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Sample Text</th>
                    <th className="px-3 py-2">Label</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {TRAINING_DATASET.slice(0, 15).map((row) => (
                    <tr key={row.message_id} className="hover:bg-slate-800/50">
                      <td className="px-3 py-2 font-mono text-cyan-400 whitespace-nowrap">{row.message_id}</td>
                      <td className="px-3 py-2 max-w-sm truncate font-mono text-[11px]">{row.message_text}</td>
                      <td className="px-3 py-2 font-mono font-bold whitespace-nowrap">
                        <span className={row.label === 1 ? 'text-red-400' : 'text-emerald-400'}>
                          {row.label} ({row.label === 1 ? 'Scam' : 'Safe'})
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold text-white whitespace-nowrap">{row.scam_category}</td>
                      <td className="px-3 py-2 font-mono text-slate-400 whitespace-nowrap">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Ethics & Safety */}
      {activeTab === 'ethics' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Defensive Cybersecurity Safety Boundaries</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ScamShield Live is strictly a defensive educational and triage platform designed to safeguard users without generating collateral vulnerabilities:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'ScamShield NEVER sends real OTPs or requests real verification credentials.',
              'ScamShield NEVER collects or stores banking passwords, ATM PINs, or PAN cards.',
              'ScamShield NEVER visits, downloads from, or automatically executes suspicious hyperlinks.',
              'ScamShield NEVER makes real financial debit requests or interacts with real banking rails.',
              'All demonstrated scenarios utilize synthetic benchmark data designed for defensive study.',
              'URLs are evaluated strictly via lexical decomposition, entropy checks, and TLD reputation.',
            ].map((rule, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

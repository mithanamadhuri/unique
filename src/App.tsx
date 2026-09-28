/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { MessageScanner } from './components/MessageScanner';
import { UrlScanner } from './components/UrlScanner';
import { QrScanner } from './components/QrScanner';
import { ScreenshotScanner } from './components/ScreenshotScanner';
import { ScanHistory } from './components/ScanHistory';
import { ThreatAnalytics } from './components/ThreatAnalytics';
import { SecurityTips } from './components/SecurityTips';
import { AboutScamShield } from './components/AboutScamShield';
import { ScanHistoryRecord, ThreatAnalyticsData, ScanResult, RiskLevel } from './types/scam';

const INITIAL_HISTORY: ScanHistoryRecord[] = [
  {
    id: 'scan_init_1',
    date: 'Today, 02:08 AM',
    scan_type: 'Message',
    category: 'KYC Scam',
    risk_score: 94,
    risk_level: 'CRITICAL',
    preview: 'Your KYC expires today. Click this link and enter your OTP.',
    recommended_action: 'Do not click the link or share your OTP. Verify KYC via official bank app.',
    indicators_count: 3,
  },
  {
    id: 'scan_init_2',
    date: 'Today, 01:42 AM',
    scan_type: 'URL',
    category: 'Phishing',
    risk_score: 87,
    risk_level: 'HIGH',
    preview: 'http://sbi-kyc-verify.top/login-portal',
    recommended_action: 'Do not enter passwords or banking details. Report domain as phishing.',
    indicators_count: 4,
  },
  {
    id: 'scan_init_3',
    date: 'Yesterday, 04:15 PM',
    scan_type: 'Message',
    category: 'Job Scam',
    risk_score: 76,
    risk_level: 'HIGH',
    preview: 'Selected for work-from-home job. Pay ₹1,500 registration fee.',
    recommended_action: 'Never pay registration or training fees to secure employment.',
    indicators_count: 2,
  },
  {
    id: 'scan_init_4',
    date: 'Yesterday, 11:20 AM',
    scan_type: 'Message',
    category: 'Normal / Legitimate',
    risk_score: 8,
    risk_level: 'SAFE',
    preview: 'Your meeting is scheduled tomorrow at 10 AM.',
    recommended_action: 'Standard safe communication. Safe to read and respond.',
    indicators_count: 0,
  },
  {
    id: 'scan_init_5',
    date: '2 days ago',
    scan_type: 'QR',
    category: 'UPI / Payment Scam',
    risk_score: 91,
    risk_level: 'CRITICAL',
    preview: 'upi://pay?pa=fake-refund@upi&pn=RefundDesk&am=5000',
    recommended_action: 'Never scan QR codes or enter UPI PIN to receive money.',
    indicators_count: 3,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [history, setHistory] = useState<ScanHistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem('scamshield_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_HISTORY;
  });

  const [messageScannerInitialText, setMessageScannerInitialText] = useState<string>('');

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scamshield_history', JSON.stringify(history));
    } catch {
      // silent
    }
  }, [history]);

  // Compute live threat analytics
  const computeAnalytics = (): ThreatAnalyticsData => {
    const total_scans = history.length;
    const threats_detected = history.filter(s => s.risk_score > 40).length;
    const safe_messages = history.filter(s => s.risk_score <= 40).length;
    const avg_risk_score = total_scans > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.risk_score, 0) / total_scans)
      : 0;

    const categoryCounts: Record<string, number> = {};
    for (const s of history) {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    }

    const category_distribution = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat as any,
      count,
      percentage: total_scans > 0 ? Math.round((count / total_scans) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    const riskCounts: Record<RiskLevel, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      SAFE: 0,
    };
    for (const s of history) {
      if (riskCounts[s.risk_level] !== undefined) {
        riskCounts[s.risk_level]++;
      }
    }

    const risk_distribution = (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SAFE'] as RiskLevel[]).map(lvl => ({
      level: lvl,
      count: riskCounts[lvl],
      percentage: total_scans > 0 ? Math.round((riskCounts[lvl] / total_scans) * 100) : 0,
    }));

    const daily_scan_trends = [
      { date: 'Mon', scans: 14, threats: 9 },
      { date: 'Tue', scans: 19, threats: 13 },
      { date: 'Wed', scans: 25, threats: 17 },
      { date: 'Thu', scans: 22, threats: 15 },
      { date: 'Fri', scans: 31, threats: 24 },
      { date: 'Sat', scans: 28, threats: 18 },
      { date: 'Today', scans: total_scans, threats: threats_detected },
    ];

    return {
      total_scans,
      threats_detected,
      safe_messages,
      avg_risk_score,
      category_distribution,
      risk_distribution,
      daily_scan_trends,
    };
  };

  const analytics = computeAnalytics();

  const handleScanComplete = (result: ScanResult) => {
    const newRecord: ScanHistoryRecord = {
      id: result.id,
      date: 'Just now',
      scan_type: result.scan_type === 'message' ? 'Message' : result.scan_type === 'url' ? 'URL' : result.scan_type === 'qr' ? 'QR' : 'Screenshot',
      category: result.category,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      preview: result.raw_input.length > 70 ? result.raw_input.substring(0, 67) + '...' : result.raw_input,
      recommended_action: result.recommended_action,
      indicators_count: result.indicators.length,
    };

    setHistory(prev => [newRecord, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      fetch('/api/history', { method: 'DELETE' });
    } catch {
      // silent
    }
  };

  const handleSelectDemo = (text: string) => {
    setMessageScannerInitialText(text);
    setActiveTab('scan-message');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenTips={() => setActiveTab('tips')}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          threatsCount={analytics.threats_detected}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'landing' && (
            <LandingPage
              onScanMessage={() => setActiveTab('scan-message')}
              onExplore={() => setActiveTab('dashboard')}
              onSelectDemo={handleSelectDemo}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardOverview
              analytics={analytics}
              recentScans={history}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectRecord={() => setActiveTab('history')}
              onSelectDemo={handleSelectDemo}
            />
          )}

          {activeTab === 'scan-message' && (
            <MessageScanner
              initialText={messageScannerInitialText}
              onScanComplete={handleScanComplete}
            />
          )}

          {activeTab === 'scan-url' && (
            <UrlScanner onScanComplete={handleScanComplete} />
          )}

          {activeTab === 'scan-qr' && (
            <QrScanner onScanComplete={handleScanComplete} />
          )}

          {activeTab === 'scan-screenshot' && (
            <ScreenshotScanner onScanComplete={handleScanComplete} />
          )}

          {activeTab === 'history' && (
            <ScanHistory
              history={history}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'analytics' && (
            <ThreatAnalytics analytics={analytics} />
          )}

          {activeTab === 'tips' && (
            <SecurityTips />
          )}

          {activeTab === 'about' && (
            <AboutScamShield />
          )}
        </main>
      </div>

      {/* Quiet Security Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>ScamShield Live</span>
            <span className="mx-2">·</span>
            <span>Explain Before You Click</span>
            <span className="mx-2">·</span>
            <span>Cybersecurity Intelligence System</span>
          </div>
          <div>
            <span>Emergency Cyber Helpline: <strong>1930</strong> (National Cybercrime Portal)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { runDetectionPipeline } from './src/engine/detectionPipeline';
import { analyzeUrl } from './src/engine/urlAnalyzer';
import { TRAINING_DATASET, getModelEvaluationMetrics } from './src/engine/mlModel';
import { ScanHistoryRecord, ThreatAnalyticsData, ScamCategory, RiskLevel } from './src/types/scam';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// In-Memory Database store with initial pre-populated realistic scan history records
const scanHistoryDatabase: ScanHistoryRecord[] = [
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

// Helper to calculate analytics
function computeAnalytics(): ThreatAnalyticsData {
  const total_scans = scanHistoryDatabase.length;
  const threats_detected = scanHistoryDatabase.filter(s => s.risk_score > 40).length;
  const safe_messages = scanHistoryDatabase.filter(s => s.risk_score <= 40).length;
  const avg_risk_score = total_scans > 0
    ? Math.round(scanHistoryDatabase.reduce((acc, curr) => acc + curr.risk_score, 0) / total_scans)
    : 0;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  for (const s of scanHistoryDatabase) {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  }

  const category_distribution = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat as ScamCategory,
    count,
    percentage: Math.round((count / total_scans) * 100),
  })).sort((a, b) => b.count - a.count);

  // Risk distribution
  const riskCounts: Record<RiskLevel, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    SAFE: 0,
  };
  for (const s of scanHistoryDatabase) {
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
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ScamShield Live Detection Engine',
    version: '1.2.0',
    model_loaded: 'models/scam_model.pkl',
    timestamp: new Date().toISOString(),
  });
});

// Scan Message Endpoint
app.post('/api/scan-message', (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Field "message" is required and must be a string' });
      return;
    }

    const result = runDetectionPipeline(message, { scanType: 'message' });

    // Store in history
    scanHistoryDatabase.unshift({
      id: result.id,
      date: 'Just now',
      scan_type: 'Message',
      category: result.category,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      preview: message.length > 70 ? message.substring(0, 67) + '...' : message,
      recommended_action: result.recommended_action,
      indicators_count: result.indicators.length,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Detection pipeline error' });
  }
});

// Analyze URL Endpoint
app.post('/api/analyze-url', (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Field "url" is required and must be a string' });
      return;
    }

    const urlReport = analyzeUrl(url);
    const result = runDetectionPipeline(url, { scanType: 'url' });

    scanHistoryDatabase.unshift({
      id: result.id,
      date: 'Just now',
      scan_type: 'URL',
      category: result.category,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      preview: url.length > 70 ? url.substring(0, 67) + '...' : url,
      recommended_action: result.recommended_action,
      indicators_count: urlReport.indicators.length,
    });

    res.json({
      ...result,
      url_security_report: urlReport,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'URL analysis error' });
  }
});

// Scan QR Endpoint
app.post('/api/scan-qr', (req: Request, res: Response) => {
  try {
    const { qr_payload, raw_text } = req.body;
    const content = qr_payload || raw_text;
    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'Field "qr_payload" or "raw_text" is required' });
      return;
    }

    const isUrl = content.startsWith('http://') || content.startsWith('https://') || content.startsWith('www.');
    const result = runDetectionPipeline(content, {
      scanType: 'qr',
      extractedUrl: isUrl ? content : undefined,
      extractedText: content,
    });

    scanHistoryDatabase.unshift({
      id: result.id,
      date: 'Just now',
      scan_type: 'QR',
      category: result.category,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      preview: content.length > 70 ? content.substring(0, 67) + '...' : content,
      recommended_action: result.recommended_action,
      indicators_count: result.indicators.length,
    });

    res.json({
      ...result,
      qr_content: content,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'QR analysis error' });
  }
});

// Scan Screenshot Endpoint
app.post('/api/scan-screenshot', (req: Request, res: Response) => {
  try {
    const { extracted_text } = req.body;
    if (!extracted_text || typeof extracted_text !== 'string') {
      res.status(400).json({ error: 'Field "extracted_text" is required' });
      return;
    }

    const result = runDetectionPipeline(extracted_text, {
      scanType: 'screenshot',
      extractedText: extracted_text,
    });

    scanHistoryDatabase.unshift({
      id: result.id,
      date: 'Just now',
      scan_type: 'Screenshot',
      category: result.category,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      preview: extracted_text.length > 70 ? extracted_text.substring(0, 67) + '...' : extracted_text,
      recommended_action: result.recommended_action,
      indicators_count: result.indicators.length,
    });

    res.json({
      ...result,
      extracted_text,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Screenshot analysis error' });
  }
});

// Get History
app.get('/api/history', (_req: Request, res: Response) => {
  res.json({
    total: scanHistoryDatabase.length,
    history: scanHistoryDatabase,
  });
});

// Clear History
app.delete('/api/history', (_req: Request, res: Response) => {
  scanHistoryDatabase.length = 0;
  res.json({ message: 'Scan history cleared successfully', total: 0 });
});

// Get Analytics
app.get('/api/analytics', (_req: Request, res: Response) => {
  res.json(computeAnalytics());
});

// Dataset & ML Metrics
app.get('/api/dataset', (_req: Request, res: Response) => {
  res.json({
    dataset_schema: ['message_id', 'message_text', 'label', 'scam_category', 'source'],
    total_records: TRAINING_DATASET.length,
    samples: TRAINING_DATASET,
  });
});

app.get('/api/model-evaluation', (_req: Request, res: Response) => {
  res.json(getModelEvaluationMetrics());
});

// -------------------------------------------------------------
// Vite Middleware / Static Serve Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🛡️ ScamShield Live server listening on port ${PORT}`);
  });
}

startServer();

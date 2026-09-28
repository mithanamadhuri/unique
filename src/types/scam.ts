export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScamCategory =
  | 'Phishing'
  | 'KYC Scam'
  | 'OTP Scam'
  | 'UPI / Payment Scam'
  | 'Job Scam'
  | 'Prize / Lottery Scam'
  | 'Investment Scam'
  | 'Banking Scam'
  | 'Impersonation'
  | 'Technical Support Scam'
  | 'Normal / Legitimate';

export interface ThreatIndicator {
  name: string;
  score: number; // 0 - 100
  explanation: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

export interface DetectionSignals {
  textScore: number;
  urlScore: number;
  ruleScore: number;
  socialEngineeringScore: number;
  mlScore: number;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  scan_type: 'message' | 'url' | 'qr' | 'screenshot';
  raw_input: string;
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  category: ScamCategory;
  indicators: ThreatIndicator[];
  recommended_action: string;
  explanation: string;
  signals: DetectionSignals;
  extracted_url?: string;
  extracted_text?: string;
  url_details?: UrlSecurityReport;
}

export interface UrlSecurityReport {
  url: string;
  protocol: 'https' | 'http' | 'other';
  hostname: string;
  is_ip_address: boolean;
  is_shortened: boolean;
  tld: string;
  subdomain_count: number;
  suspicious_keywords: string[];
  has_credential_harvesting_path: boolean;
  risk_score: number;
  risk_level: RiskLevel;
  indicators: string[];
  recommendation: string;
}

export interface ScanHistoryRecord {
  id: string;
  date: string;
  scan_type: 'Message' | 'URL' | 'QR' | 'Screenshot';
  category: ScamCategory;
  risk_score: number;
  risk_level: RiskLevel;
  preview: string;
  recommended_action: string;
  indicators_count: number;
}

export interface ThreatAnalyticsData {
  total_scans: number;
  threats_detected: number;
  safe_messages: number;
  avg_risk_score: number;
  category_distribution: {
    category: ScamCategory;
    count: number;
    percentage: number;
  }[];
  risk_distribution: {
    level: RiskLevel;
    count: number;
    percentage: number;
  }[];
  daily_scan_trends: {
    date: string;
    scans: number;
    threats: number;
  }[];
}

export interface DatasetItem {
  message_id: string;
  message_text: string;
  label: 0 | 1; // 0 = Safe, 1 = Scam
  scam_category: ScamCategory;
  source: string;
}

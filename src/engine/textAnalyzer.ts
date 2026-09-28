import { PreprocessedData } from './preprocessing';
import { ThreatIndicator } from '../types/scam';

/**
 * Text Analyzer Module
 * Extracts social-engineering triggers, emotional manipulation signals,
 * and credential-harvesting patterns from the message text.
 */

export interface TextAnalysisResult {
  score: number; // 0 - 100
  urgencyScore: number;
  authorityScore: number;
  financialScore: number;
  credentialScore: number;
  coercionScore: number;
  indicators: ThreatIndicator[];
}

export function analyzeText(prep: PreprocessedData): TextAnalysisResult {
  const text = prep.normalizedText;
  const indicators: ThreatIndicator[] = [];

  // 1. Urgency & Panic Analysis
  const urgencyPatterns = [
    { pattern: /\b(expires? today|expiring today|last date|due today)\b/, weight: 35, desc: 'Creates artificial deadline to force hasty compliance without verification' },
    { pattern: /\b(immediate(?:ly)?|urgent(?:ly)?|urgent attention|right away|act now)\b/, weight: 25, desc: 'Uses urgent call-to-action language common in phishing attacks' },
    { pattern: /\b(blocked?|suspended?|deactivated?|terminated?|closed?)\b/, weight: 30, desc: 'Threatens service disruption, account suspension, or immediate blockade' },
    { pattern: /\b(within (?:24|12|2|1|48) hours?|in 30 mins?|countdown)\b/, weight: 25, desc: 'Imposes short countdown window to induce anxiety' },
    { pattern: /\b(arrest warrant|police|court|legal notice|cbi|customs department|fir)\b/, weight: 40, desc: 'Simulates law enforcement intimidation and coercive threats' },
  ];

  let urgencyScore = 0;
  for (const item of urgencyPatterns) {
    if (item.pattern.test(text)) {
      urgencyScore += item.weight;
      indicators.push({
        name: 'Urgency & Fear Induction',
        score: Math.min(98, urgencyScore + 40),
        explanation: item.desc,
        severity: urgencyScore >= 40 ? 'critical' : 'high',
      });
      break; // One primary indicator for urgency
    }
  }

  // 2. Sensitive Information & Credential Harvesting
  const credentialPatterns = [
    { pattern: /\b(otp|one time password|verification code|security code)\b/, weight: 45, desc: 'Explicitly requests or references OTP (One Time Password), a primary authentication factor' },
    { pattern: /\b(password|passcode|pin|mpin|cvv|atm pin)\b/, weight: 45, desc: 'Demands financial PIN, MPIN, CVV, or account password' },
    { pattern: /\b(pan card|pan number|aadhaar|social security|ssn|date of birth)\b/, weight: 30, desc: 'Harvests critical government identity documentation (PAN / Aadhaar / SSN)' },
    { pattern: /\b(bank details|account number|debit card|credit card details)\b/, weight: 35, desc: 'Solicts direct banking credentials or payment card specifications' },
  ];

  let credentialScore = 0;
  for (const item of credentialPatterns) {
    if (item.pattern.test(text)) {
      credentialScore += item.weight;
      indicators.push({
        name: 'Sensitive Credential Request',
        score: Math.min(99, credentialScore + 45),
        explanation: item.desc,
        severity: 'critical',
      });
      break;
    }
  }

  // 3. Authority & Brand Impersonation
  const authorityPatterns = [
    { pattern: /\b(sbi|hdfc|icici|axis bank|punjab national bank|bank of baroda)\b/, name: 'Banking Institution' },
    { pattern: /\b(income tax department|incometax|rbi|reserve bank|refund office)\b/, name: 'Tax / Central Regulatory Authority' },
    { pattern: /\b(electricity board|power corporation|bijli vibhag|electricity officer)\b/, name: 'Public Utility / Electricity Board' },
    { pattern: /\b(fedex|dhl|customs parcel|postal department|speed post)\b/, name: 'Courier / Customs Agency' },
    { pattern: /\b(whatsapp support|microsoft support|apple care|customer care)\b/, name: 'Tech Platform Customer Support' },
  ];

  let authorityScore = 0;
  for (const item of authorityPatterns) {
    if (item.pattern.test(text)) {
      authorityScore += 30;
      indicators.push({
        name: 'Institutional Impersonation',
        score: 88,
        explanation: `Impersonates a known trusted organization (${item.name}) to establish false credibility.`,
        severity: 'high',
      });
      break;
    }
  }

  // 4. Financial Exploitation & Advance Fee Traps
  const financialPatterns = [
    { pattern: /\b(processing fee|registration fee|clearance charge|security deposit|refundable fee)\b/, weight: 40, desc: 'Requests advance upfront fee or deposit to release a promised benefit' },
    { pattern: /\b(won|winner|lottery|prize|congratulations|selected for reward|cashback won)\b/, weight: 35, desc: 'Promises large unexpected cash rewards or unearned lottery winnings' },
    { pattern: /\b(earn (?:daily|per day|monthly)|work from home|part[- ]time job|like and subscribe)\b/, weight: 35, desc: 'Advertises unrealistically simple work-from-home employment tasks' },
    { pattern: /\b(guaranteed returns?|100% risk free|double your money|crypto profit|forex trading)\b/, weight: 40, desc: 'Promises unrealistic guaranteed financial returns indicative of Ponzi schemes' },
  ];

  let financialScore = 0;
  for (const item of financialPatterns) {
    if (item.pattern.test(text)) {
      financialScore += item.weight;
      indicators.push({
        name: 'Financial Manipulation',
        score: Math.min(95, financialScore + 40),
        explanation: item.desc,
        severity: financialScore >= 35 ? 'high' : 'medium',
      });
      break;
    }
  }

  // 5. Coercion & Suspicious Actions
  const coercionPatterns = [
    { pattern: /\b(download (?:apk|app|file)|install (?:anydesk|teamviewer|quicksupport|rustdesk))\b/, weight: 45, desc: 'Attempts to trick user into downloading an unofficial APK or remote access surveillance tool' },
    { pattern: /\b(forward this sms|share this code|send otp to)\b/, weight: 40, desc: 'Demands forwarding authentication messages or security tokens' },
    { pattern: /\b(click (?:here|link|url)|open the link below|visit link)\b/, weight: 20, desc: 'Directs the victim to an external unverified hyperlink' },
    { pattern: /\b(scan (?:this )?qr (?:code)?|scan qr to receive)\b/, weight: 35, desc: 'Falsely claims scanning a QR code is required to receive funds (Reverse QR Scam)' },
  ];

  let coercionScore = 0;
  for (const item of coercionPatterns) {
    if (item.pattern.test(text)) {
      coercionScore += item.weight;
      indicators.push({
        name: 'Coercive Action Directive',
        score: Math.min(96, coercionScore + 45),
        explanation: item.desc,
        severity: 'high',
      });
      break;
    }
  }

  // Calculate composite text risk score
  const totalScore = Math.min(
    100,
    Math.round(
      urgencyScore * 0.3 +
      credentialScore * 0.4 +
      authorityScore * 0.2 +
      financialScore * 0.35 +
      coercionScore * 0.35
    )
  );

  return {
    score: totalScore,
    urgencyScore: Math.min(100, urgencyScore * 1.5),
    authorityScore: Math.min(100, authorityScore * 2),
    financialScore: Math.min(100, financialScore * 1.8),
    credentialScore: Math.min(100, credentialScore * 2),
    coercionScore: Math.min(100, coercionScore * 1.8),
    indicators,
  };
}

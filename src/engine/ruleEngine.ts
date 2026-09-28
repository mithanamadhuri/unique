import { PreprocessedData } from './preprocessing';
import { ScamCategory, ThreatIndicator } from '../types/scam';

/**
 * Deterministic Rule Engine Module
 * Evaluates domain heuristics and specialized multi-condition rules
 * to determine the primary scam category and rule-based risk score.
 */

export interface RuleEvaluation {
  matchedCategory: ScamCategory;
  ruleScore: number;
  confidence: number;
  matchedRules: string[];
  indicators: ThreatIndicator[];
}

export function evaluateRules(prep: PreprocessedData): RuleEvaluation {
  const text = prep.normalizedText;
  const matchedRules: string[] = [];
  const indicators: ThreatIndicator[] = [];

  // RULE 1: KYC / Banking Expiration Phishing
  const isKycScam =
    (text.includes('kyc') || text.includes('pan card') || text.includes('re-kyc') || text.includes('aadhaar')) &&
    (text.includes('expire') || text.includes('block') || text.includes('suspend') || text.includes('update') || text.includes('deactivate')) &&
    (text.includes('link') || text.includes('click') || text.includes('otp') || prep.urls.length > 0);

  if (isKycScam) {
    matchedRules.push('RULE_KYC_EXPIRY_COERCION');
    indicators.push({
      name: 'KYC Document Phishing Pattern',
      score: 96,
      explanation: 'Matches verified KYC phishing signature: combines fake compliance expiry threats with an urgent link or OTP demand.',
      severity: 'critical',
    });
    return {
      matchedCategory: 'KYC Scam',
      ruleScore: 95,
      confidence: 0.96,
      matchedRules,
      indicators,
    };
  }

  // RULE 2: OTP Interception / Theft
  const isOtpScam =
    (text.includes('otp') || text.includes('verification code') || text.includes('one time password')) &&
    (text.includes('share') || text.includes('enter') || text.includes('forward') || text.includes('verify') || text.includes('send to'));

  if (isOtpScam) {
    matchedRules.push('RULE_OTP_INTERCEPTION');
    indicators.push({
      name: 'Authentication Bypass / OTP Harvesting',
      score: 95,
      explanation: 'Directly attempts to extract One-Time Passwords (OTP). Legitimate institutions never ask for your OTP.',
      severity: 'critical',
    });
    return {
      matchedCategory: 'OTP Scam',
      ruleScore: 94,
      confidence: 0.95,
      matchedRules,
      indicators,
    };
  }

  // RULE 3: Job Scam (Fake Offer / Upfront Registration Fee)
  const isJobScam =
    (text.includes('job') || text.includes('work from home') || text.includes('part time') || text.includes('hiring') || text.includes('task') || text.includes('selected for')) &&
    (text.includes('registration fee') || text.includes('processing fee') || text.includes('deposit') || text.includes('earn ₹') || text.includes('earn $') || text.includes('daily income') || text.includes('telegram'));

  if (isJobScam) {
    matchedRules.push('RULE_JOB_OFFER_ADVANCE_FEE');
    indicators.push({
      name: 'Employment Advance-Fee Fraud',
      score: 89,
      explanation: 'Demands an upfront fee or offers unrealistic pay for minimal tasks (common Telegram/WhatsApp recruitment trap).',
      severity: 'high',
    });
    return {
      matchedCategory: 'Job Scam',
      ruleScore: 88,
      confidence: 0.92,
      matchedRules,
      indicators,
    };
  }

  // RULE 4: Prize / Lottery / Unsolicited Reward Scam
  const isPrizeScam =
    (text.includes('congratulations') || text.includes('won') || text.includes('winner') || text.includes('lottery') || text.includes('lucky draw') || text.includes('gift voucher')) &&
    (text.includes('claim') || text.includes('fee') || text.includes('charge') || text.includes('click') || text.includes('₹') || text.includes('$'));

  if (isPrizeScam) {
    matchedRules.push('RULE_PRIZE_LOTTERY_EXTORTION');
    indicators.push({
      name: 'Advance-Fee Lottery / Prize Scam',
      score: 87,
      explanation: 'Claims you won a reward you never signed up for and requires payment or personal data to release the prize.',
      severity: 'high',
    });
    return {
      matchedCategory: 'Prize / Lottery Scam',
      ruleScore: 86,
      confidence: 0.91,
      matchedRules,
      indicators,
    };
  }

  // RULE 5: UPI / Reverse Payment Scam
  const isUpiScam =
    (text.includes('upi') || text.includes('gpay') || text.includes('phonepe') || text.includes('paytm') || text.includes('qr')) &&
    (text.includes('scan qr to receive') || text.includes('enter pin to receive') || text.includes('refund request') || text.includes('collect request'));

  if (isUpiScam) {
    matchedRules.push('RULE_REVERSE_UPI_FRAUD');
    indicators.push({
      name: 'UPI Reverse Payment Trap',
      score: 93,
      explanation: 'Claims you need to scan a QR code or enter your UPI PIN to receive money. UPI PIN is ONLY needed to SEND money.',
      severity: 'critical',
    });
    return {
      matchedCategory: 'UPI / Payment Scam',
      ruleScore: 92,
      confidence: 0.94,
      matchedRules,
      indicators,
    };
  }

  // RULE 6: Investment / Ponzi / Crypto Doubling
  const isInvestmentScam =
    (text.includes('invest') || text.includes('crypto') || text.includes('trading') || text.includes('bitcoin') || text.includes('stock tips')) &&
    (text.includes('guaranteed') || text.includes('100% profit') || text.includes('double') || text.includes('daily returns') || text.includes('no risk'));

  if (isInvestmentScam) {
    matchedRules.push('RULE_UNREALISTIC_INVESTMENT_RETURN');
    indicators.push({
      name: 'Fraudulent High-Yield Investment Pattern',
      score: 88,
      explanation: 'Promises guaranteed returns with zero risk, a classic signature of fraudulent Ponzi schemes and pig butchering scams.',
      severity: 'high',
    });
    return {
      matchedCategory: 'Investment Scam',
      ruleScore: 86,
      confidence: 0.90,
      matchedRules,
      indicators,
    };
  }

  // RULE 7: Banking Account Suspension / Card Deactivation
  const isBankingScam =
    (text.includes('bank') || text.includes('debit card') || text.includes('credit card') || text.includes('account blocked') || text.includes('reward points')) &&
    (text.includes('click') || text.includes('link') || text.includes('immediately') || text.includes('contact support') || prep.urls.length > 0);

  if (isBankingScam) {
    matchedRules.push('RULE_BANK_ACCOUNT_SUSPENSION');
    indicators.push({
      name: 'Banking Channel Impersonation',
      score: 89,
      explanation: 'Claims your bank account or card is blocked to drive panic and redirect to a cloned portal.',
      severity: 'high',
    });
    return {
      matchedCategory: 'Banking Scam',
      ruleScore: 88,
      confidence: 0.89,
      matchedRules,
      indicators,
    };
  }

  // RULE 8: Technical Support / Remote Access Scam
  const isTechSupport =
    (text.includes('microsoft') || text.includes('apple') || text.includes('virus detected') || text.includes('windows defender') || text.includes('security alert')) &&
    (text.includes('call') || text.includes('toll free') || text.includes('anydesk') || text.includes('teamviewer') || text.includes('helpline'));

  if (isTechSupport) {
    matchedRules.push('RULE_TECH_SUPPORT_TAKEOVER');
    indicators.push({
      name: 'Rogue Tech Support Exploitation',
      score: 91,
      explanation: 'Fabricates virus alerts and directs the user to call a fake call center or install remote screen control tools.',
      severity: 'critical',
    });
    return {
      matchedCategory: 'Technical Support Scam',
      ruleScore: 90,
      confidence: 0.93,
      matchedRules,
      indicators,
    };
  }

  // RULE 9: General Authority / Police / Customs Impersonation
  const isImpersonation =
    (text.includes('police') || text.includes('customs') || text.includes('parcel detained') || text.includes('drugs found') || text.includes('electricity will be disconnected') || text.includes('eb officer')) &&
    (text.includes('call') || text.includes('contact') || text.includes('pay') || text.includes('bill'));

  if (isImpersonation) {
    matchedRules.push('RULE_GOVERNMENT_UTILITY_IMPERSONATION');
    indicators.push({
      name: 'Public Official / Utility Impersonation',
      score: 92,
      explanation: 'Falsely represents electricity departments, police, or courier customs to blackmail or extort immediate payments.',
      severity: 'critical',
    });
    return {
      matchedCategory: 'Impersonation',
      ruleScore: 90,
      confidence: 0.92,
      matchedRules,
      indicators,
    };
  }

  // RULE 10: Generic Phishing with suspicious URL
  if (prep.urls.length > 0 && (text.includes('verify') || text.includes('secure') || text.includes('login') || text.includes('click'))) {
    matchedRules.push('RULE_GENERIC_HYPERLINK_PHISHING');
    indicators.push({
      name: 'Unverified External Link Call-To-Action',
      score: 75,
      explanation: 'Directs recipients to authenticate or review account status via external third-party web destination.',
      severity: 'high',
    });
    return {
      matchedCategory: 'Phishing',
      ruleScore: 78,
      confidence: 0.85,
      matchedRules,
      indicators,
    };
  }

  // RULE 11: Normal / Legitimate Checks
  const isMeetingOrPersonal =
    (text.includes('meeting') || text.includes('calendar') || text.includes('lunch') || text.includes('coffee') || text.includes('project update') || text.includes('attached is the report') || text.includes('see you tomorrow')) &&
    !text.includes('otp') && !text.includes('fee') && !text.includes('blocked') && !text.includes('winner');

  if (isMeetingOrPersonal) {
    return {
      matchedCategory: 'Normal / Legitimate',
      ruleScore: 5,
      confidence: 0.95,
      matchedRules: ['RULE_BENIGN_PROFESSIONAL_COMMUNICATION'],
      indicators: [],
    };
  }

  // Default Fallback
  return {
    matchedCategory: 'Normal / Legitimate',
    ruleScore: 10,
    confidence: 0.70,
    matchedRules: ['RULE_DEFAULT_BASELINE'],
    indicators: [],
  };
}

import { preprocessInput } from './preprocessing';
import { analyzeUrl } from './urlAnalyzer';
import { analyzeText } from './textAnalyzer';
import { evaluateRules } from './ruleEngine';
import { predictMl } from './mlModel';
import { computeRiskScore } from './riskEngine';
import { generateExplanation } from './explanationEngine';
import { ScanResult, ThreatIndicator } from '../types/scam';

/**
 * Detection Pipeline Master Module
 * Orchestrates the complete end-to-end multi-signal detection pipeline:
 * Input -> Preprocessing -> Text Analyzer -> URL Analyzer -> Rule Engine
 *       -> ML Model -> Risk Engine -> Explanation Engine -> Final Result
 */

export interface PipelineOptions {
  scanType?: 'message' | 'url' | 'qr' | 'screenshot';
  extractedUrl?: string;
  extractedText?: string;
}

export function runDetectionPipeline(rawInput: string, options?: PipelineOptions): ScanResult {
  const scanType = options?.scanType || 'message';
  const id = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // 1. Preprocessing
  const prep = preprocessInput(rawInput);

  // 2. Text Analysis
  const textAnalysis = analyzeText(prep);

  // 3. URL Analysis
  // If raw input itself is a URL or contains extracted URLs
  const candidateUrls = [...prep.urls];
  if (scanType === 'url' && !candidateUrls.includes(rawInput.trim())) {
    candidateUrls.unshift(rawInput.trim());
  }

  let highestUrlRisk = 0;
  let primaryUrlReport = undefined;
  const urlIndicators: ThreatIndicator[] = [];

  for (const urlStr of candidateUrls) {
    const report = analyzeUrl(urlStr);
    if (!primaryUrlReport || report.risk_score > highestUrlRisk) {
      primaryUrlReport = report;
      highestUrlRisk = report.risk_score;
    }
  }

  if (primaryUrlReport && primaryUrlReport.indicators.length > 0) {
    urlIndicators.push({
      name: 'Malicious / Suspicious URL Characteristics',
      score: primaryUrlReport.risk_score,
      explanation: primaryUrlReport.indicators.slice(0, 2).join('; '),
      severity: primaryUrlReport.risk_level === 'CRITICAL' ? 'critical' : primaryUrlReport.risk_level === 'HIGH' ? 'high' : 'medium',
    });
  }

  // 4. Rule Engine Evaluation
  const ruleResult = evaluateRules(prep);

  // 5. Machine Learning TF-IDF & Logistic Regression
  const mlResult = predictMl(prep.cleanedText);

  // Determine Primary Category
  // If rule engine matched a specific scam category, prefer rule category
  let category = ruleResult.matchedCategory;
  if (category === 'Normal / Legitimate' && mlResult.mlScore > 65) {
    category = mlResult.predictedCategory;
  }
  // If URL analysis specifically indicates phishing
  if (category === 'Normal / Legitimate' && highestUrlRisk >= 75) {
    category = 'Phishing';
  }

  // Aggregate Indicators
  const allIndicators: ThreatIndicator[] = [
    ...ruleResult.indicators,
    ...textAnalysis.indicators,
    ...urlIndicators,
  ];

  // Deduplicate indicators by name
  const seenNames = new Set<string>();
  const uniqueIndicators: ThreatIndicator[] = [];
  for (const ind of allIndicators) {
    if (!seenNames.has(ind.name)) {
      seenNames.add(ind.name);
      uniqueIndicators.push(ind);
    }
  }

  // Compute Multi-Signal Weights
  const socialEngineeringScore = Math.max(
    textAnalysis.urgencyScore,
    textAnalysis.credentialScore,
    textAnalysis.financialScore,
    textAnalysis.authorityScore
  );

  const signals = {
    textScore: textAnalysis.score,
    urlScore: highestUrlRisk,
    ruleScore: ruleResult.ruleScore,
    socialEngineeringScore,
    mlScore: mlResult.mlScore,
  };

  // 6. Risk Engine Computation
  const riskComputation = computeRiskScore(signals);

  // If score is safe (<= 20), ensure category is Normal / Legitimate
  if (riskComputation.riskLevel === 'SAFE') {
    category = 'Normal / Legitimate';
  }

  // 7. Explanation Engine
  const explanation = generateExplanation(
    category,
    riskComputation.riskLevel,
    riskComputation.riskScore,
    uniqueIndicators
  );

  return {
    id,
    timestamp,
    scan_type: scanType,
    raw_input: rawInput,
    risk_score: riskComputation.riskScore,
    risk_level: riskComputation.riskLevel,
    category,
    indicators: uniqueIndicators,
    recommended_action: explanation.recommendedAction,
    explanation: explanation.summary,
    signals,
    extracted_url: candidateUrls[0],
    extracted_text: options?.extractedText,
    url_details: primaryUrlReport,
  };
}

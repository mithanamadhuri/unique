import { RiskLevel, DetectionSignals } from '../types/scam';

/**
 * Risk Engine Module
 * Fuses disparate heuristic, lexical, rule-based, URL, and machine-learning signals
 * into an authoritative, calibrated 0-100 Risk Score and categorical Risk Level.
 */

export interface RiskComputationResult {
  riskScore: number;
  riskLevel: RiskLevel;
  signals: DetectionSignals;
}

export function computeRiskScore(signals: DetectionSignals): RiskComputationResult {
  // If rule score indicates critical rule match (> 90), ensure risk score reflects the critical violation
  const isRuleCritical = signals.ruleScore >= 90;

  // Multi-signal weighted calculation:
  // Text (25%) + URL (25%) + Rule (25%) + Social Engineering (15%) + ML (10%)
  let weightedScore =
    signals.textScore * 0.25 +
    signals.urlScore * 0.25 +
    signals.ruleScore * 0.25 +
    signals.socialEngineeringScore * 0.15 +
    signals.mlScore * 0.10;

  // If a critical rule fired or ML and rule both agree heavily, ensure score stays high
  if (isRuleCritical && weightedScore < 85) {
    weightedScore = Math.max(weightedScore, signals.ruleScore);
  }

  // Ensure benign messages stay low
  if (signals.ruleScore <= 10 && signals.urlScore <= 10 && signals.textScore <= 10) {
    weightedScore = Math.min(weightedScore, 10);
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(weightedScore)));

  // Risk Level Mapping (Exact specification)
  let riskLevel: RiskLevel = 'SAFE';
  if (finalScore >= 81) {
    riskLevel = 'CRITICAL';
  } else if (finalScore >= 61) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 41) {
    riskLevel = 'MEDIUM';
  } else if (finalScore >= 21) {
    riskLevel = 'LOW';
  } else {
    riskLevel = 'SAFE';
  }

  return {
    riskScore: finalScore,
    riskLevel,
    signals,
  };
}

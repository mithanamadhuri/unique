import { RiskLevel, UrlSecurityReport } from '../types/scam';

/**
 * Safe URL Analyzer Module
 * Inspects URLs purely through lexical, structural, and heuristic features
 * WITHOUT visiting, fetching, or executing external destinations.
 */

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.tk', '.icu', '.buzz', '.club', '.work', '.rest',
  '.click', '.gq', '.cf', '.ml', '.ga', '.fit', '.fun', '.monster',
  '.sbs', '.cam', '.country', '.kim', '.uno', '.stream', '.live'
]);

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly', 'rb.gy',
  'tiny.cc', 'ow.ly', 'buff.ly', 'rebrand.ly', 'shorturl.at'
]);

const IMPERSONATED_BRANDS = [
  'sbi', 'hdfc', 'icici', 'axis', 'pnb', 'paypal', 'netflix', 'amazon',
  'apple', 'google', 'whatsapp', 'paytm', 'phonepe', 'gpay', 'rbi',
  'incometax', 'electricity', 'fedex', 'dhl', 'speedpost', 'indianoil'
];

const CREDENTIAL_HARVEST_KEYWORDS = [
  'login', 'signin', 'log-in', 'sign-in', 'verify', 'verification',
  'kyc', 'pan', 'aadhaar', 'update', 're-kyc', 'secure', 'auth',
  'authenticate', 'password', 'pin', 'otp', 'unlock', 'reactivate',
  'claim', 'reward', 'refund', 'bonus', 'airdrop', 'free'
];

export function analyzeUrl(rawUrl: string): UrlSecurityReport {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const indicators: string[] = [];
  let riskScore = 10; // baseline for unknown links

  let hostname = '';
  let protocol: 'https' | 'http' | 'other' = 'https';
  let pathname = '';
  let search = '';

  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.toLowerCase();
    protocol = parsed.protocol === 'https:' ? 'https' : parsed.protocol === 'http:' ? 'http' : 'other';
    pathname = parsed.pathname.toLowerCase();
    search = parsed.search.toLowerCase();
  } catch {
    // If malformed, fallback extraction
    hostname = url.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0].toLowerCase();
    protocol = url.startsWith('http://') ? 'http' : 'https';
  }

  // 1. Protocol check
  if (protocol === 'http') {
    riskScore += 25;
    indicators.push('Unencrypted connection (HTTP instead of HTTPS)');
  }

  // 2. IP address host check (e.g., http://192.168.1.1/login)
  const isIpAddress = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[') && hostname.endsWith(']');
  if (isIpAddress) {
    riskScore += 45;
    indicators.push('Uses direct numeric IP address instead of registered domain name');
  }

  // 3. Extract TLD
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? `.${domainParts[domainParts.length - 1]}` : '';
  if (SUSPICIOUS_TLDS.has(tld)) {
    riskScore += 30;
    indicators.push(`Uses high-risk low-cost TLD (${tld}) often abused for phishing campaigns`);
  }

  // 4. URL Shortener check
  const isShortened = KNOWN_SHORTENERS.has(hostname) || KNOWN_SHORTENERS.has(domainParts.slice(-2).join('.'));
  if (isShortened) {
    riskScore += 25;
    indicators.push('Uses URL shortening service to conceal true final destination');
  }

  // 5. Excessive subdomains check
  const subdomainCount = Math.max(0, domainParts.length - 2);
  if (subdomainCount >= 3) {
    riskScore += 25;
    indicators.push(`Excessive subdomains (${subdomainCount}) used to mimic legitimate infrastructure`);
  }

  // 6. Brand impersonation / typosquatting check
  const matchedBrands: string[] = [];
  for (const brand of IMPERSONATED_BRANDS) {
    if (hostname.includes(brand)) {
      // If hostname includes brand, check if it's the genuine official domain
      const isOfficial =
        (brand === 'sbi' && (hostname === 'onlinesbi.sbi' || hostname.endsWith('.sbi') || hostname === 'sbi.co.in')) ||
        (brand === 'hdfc' && (hostname === 'hdfcbank.com' || hostname.endsWith('.hdfcbank.com'))) ||
        (brand === 'icici' && (hostname === 'icicibank.com' || hostname.endsWith('.icicibank.com'))) ||
        (brand === 'axis' && (hostname === 'axisbank.com' || hostname.endsWith('.axisbank.com'))) ||
        (brand === 'paypal' && (hostname === 'paypal.com' || hostname.endsWith('.paypal.com'))) ||
        (brand === 'netflix' && (hostname === 'netflix.com' || hostname.endsWith('.netflix.com'))) ||
        (brand === 'amazon' && (hostname === 'amazon.com' || hostname === 'amazon.in' || hostname.endsWith('.amazon.com') || hostname.endsWith('.amazon.in'))) ||
        (brand === 'google' && (hostname === 'google.com' || hostname.endsWith('.google.com'))) ||
        (brand === 'apple' && (hostname === 'apple.com' || hostname.endsWith('.apple.com')));

      if (!isOfficial) {
        matchedBrands.push(brand.toUpperCase());
      }
    }
  }

  if (matchedBrands.length > 0) {
    riskScore += 40;
    indicators.push(`Possible brand impersonation detected for: ${matchedBrands.join(', ')} on unofficial domain`);
  }

  // 7. Credential harvesting keywords in domain, path or query
  const fullUrlString = `${hostname}${pathname}${search}`;
  const foundKeywords = CREDENTIAL_HARVEST_KEYWORDS.filter(kw => fullUrlString.includes(kw));

  const hasCredentialPath = foundKeywords.some(kw =>
    pathname.includes(kw) || search.includes(kw)
  );

  if (foundKeywords.length > 0) {
    const boost = Math.min(30, foundKeywords.length * 10);
    riskScore += boost;
    indicators.push(`Contains high-risk credential keywords: [${foundKeywords.slice(0, 4).join(', ')}]`);
  }

  if (hasCredentialPath && (isIpAddress || matchedBrands.length > 0 || SUSPICIOUS_TLDS.has(tld))) {
    riskScore += 25;
    indicators.push('Credential collection endpoint detected on unverified infrastructure');
  }

  // 8. Multiple hyphens in domain name (common typosquatting technique)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    riskScore += 15;
    indicators.push(`Excessive hyphens (${hyphenCount}) in domain name typical of spoofing domains`);
  }

  // Cap score at 100 and min at 5
  riskScore = Math.min(100, Math.max(5, riskScore));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'SAFE';
  if (riskScore >= 81) riskLevel = 'CRITICAL';
  else if (riskScore >= 61) riskLevel = 'HIGH';
  else if (riskScore >= 41) riskLevel = 'MEDIUM';
  else if (riskScore >= 21) riskLevel = 'LOW';

  // Construct recommendation
  let recommendation = 'URL appears safe for general navigation. Ensure you verify the domain spelling before submitting data.';
  if (riskScore >= 61) {
    recommendation = 'DO NOT open this link or input passwords, banking details, or personal data. Delete or report the message.';
  } else if (riskScore >= 41) {
    recommendation = 'Proceed with caution. Verify the destination domain independently through an official search engine before clicking.';
  }

  return {
    url,
    protocol,
    hostname,
    is_ip_address: isIpAddress,
    is_shortened: isShortened,
    tld,
    subdomain_count: subdomainCount,
    suspicious_keywords: foundKeywords,
    has_credential_harvesting_path: hasCredentialPath,
    risk_score: riskScore,
    risk_level: riskLevel,
    indicators,
    recommendation,
  };
}

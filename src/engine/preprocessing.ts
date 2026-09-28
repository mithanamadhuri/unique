/**
 * Preprocessing Module
 * Cleans input text, normalizes character obfuscations, extracts URLs, phone numbers,
 * currency amounts, UPI handles, and prepares normalized tokens for analysis.
 */

export interface PreprocessedData {
  originalText: string;
  cleanedText: string;
  normalizedText: string;
  urls: string[];
  phoneNumbers: string[];
  upiIds: string[];
  amounts: string[];
  hasUrgencyKeywords: boolean;
  wordCount: number;
}

// Common character replacements used by scammers to evade keyword filters
const OBFUSCATION_MAP: Record<string, string> = {
  '@': 'a',
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '8': 'b',
  '$': 's',
  '!': 'i',
};

export function preprocessInput(input: string): PreprocessedData {
  if (!input || typeof input !== 'string') {
    return {
      originalText: '',
      cleanedText: '',
      normalizedText: '',
      urls: [],
      phoneNumbers: [],
      upiIds: [],
      amounts: [],
      hasUrgencyKeywords: false,
      wordCount: 0,
    };
  }

  const originalText = input.trim();

  // Extract URLs safely using comprehensive regex
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`]+|(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|xyz|top|tk|icu|buzz|club|online|site|app|live|info|ru|cn|in|me|cc|pw)(?:\/[^\s]*)?/gi;
  const rawUrls = originalText.match(urlRegex) || [];
  const urls = Array.from(new Set(rawUrls.map(u => (u.startsWith('http') || u.startsWith('www') ? u : `https://${u}`))));

  // Extract phone numbers (international and national 10-digit patterns)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/g;
  const phoneNumbers = Array.from(new Set(originalText.match(phoneRegex) || []));

  // Extract UPI Handles (common in Indian scams, e.g. user@oksbi, payment@upi)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
  const potentialUpi = (originalText.match(upiRegex) || []).filter(item =>
    !item.includes('.com') &&
    !item.includes('.net') &&
    !item.includes('.org') &&
    (item.endsWith('@upi') || item.endsWith('@paytm') || item.endsWith('@ybl') || item.endsWith('@oksbi') || item.endsWith('@okhdfcbank') || item.endsWith('@axl') || item.endsWith('@ibl'))
  );
  const upiIds = Array.from(new Set(potentialUpi));

  // Extract financial amounts (₹, Rs., $, USD, EUR, etc.)
  const amountRegex = /(?:₹|Rs\.?|INR|\$|USD|EUR|€)\s?[\d,]+(?:\.\d{2})?|\b[\d,]+\s?(?:rupees|dollars|lakhs|crores)\b/gi;
  const amounts = Array.from(new Set(originalText.match(amountRegex) || []));

  // Clean text: remove excessive whitespace and zero-width characters
  const cleanedText = originalText
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Normalized text: lowercase and de-obfuscated for matching
  let deobfuscated = cleanedText.toLowerCase();
  for (const [char, replacement] of Object.entries(OBFUSCATION_MAP)) {
    // Only deobfuscate when surrounded by letters to preserve numbers
    deobfuscated = deobfuscated.replace(new RegExp(`(?<=[a-z])${char.replace(/[$@!]/g, '\\$&')}|${char.replace(/[$@!]/g, '\\$&')}(?=[a-z])`, 'g'), replacement);
  }

  // Check initial urgency keywords
  const urgencyTokens = [
    'immediately', 'urgent', 'expires today', 'within 24 hours', 'last notice',
    'blocked today', 'suspended', 'deactivated', 'arrest warrant', 'final warning',
    'take action now', 'action required', 'immediate attention'
  ];
  const hasUrgencyKeywords = urgencyTokens.some(token => deobfuscated.includes(token));

  const words = cleanedText.split(/\s+/).filter(Boolean);

  return {
    originalText,
    cleanedText,
    normalizedText: deobfuscated,
    urls,
    phoneNumbers,
    upiIds,
    amounts,
    hasUrgencyKeywords,
    wordCount: words.length,
  };
}

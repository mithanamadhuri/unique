import { RiskLevel, ScamCategory, ThreatIndicator } from '../types/scam';

/**
 * Explanation Engine Module
 * Implements "Explain Before You Click" - translates raw indicators and signals
 * into scannable, human-understandable explanations and defensive action checklists.
 */

export interface ExplanationPackage {
  summary: string;
  recommendedAction: string;
  actionChecklist: string[];
  whyFlagged: {
    title: string;
    description: string;
    percentage: number;
  }[];
}

export function generateExplanation(
  category: ScamCategory,
  riskLevel: RiskLevel,
  riskScore: number,
  indicators: ThreatIndicator[]
): ExplanationPackage {
  // If Safe
  if (riskLevel === 'SAFE') {
    return {
      summary: 'No recognized fraud signatures, coercive urgency, credential-harvesting hooks, or malicious URLs were detected. The communication follows typical legitimate patterns.',
      recommendedAction: 'Standard safe communication. No defensive action needed, but always maintain basic digital hygiene.',
      actionChecklist: [
        'Normal conversation or notification verified.',
        'No sensitive credentials or urgent financial actions were requested.',
        'Safe to read and respond in normal course of business.',
      ],
      whyFlagged: [],
    };
  }

  // Generate category-specific explanations and concrete actions
  let summary = '';
  let recommendedAction = '';
  let actionChecklist: string[] = [];

  switch (category) {
    case 'KYC Scam':
      summary = 'This message claims your KYC, PAN card, or bank account is expiring or suspended. Scammers use this tactic to panic victims into entering netbanking passwords and OTPs on fraudulent cloned portals.';
      recommendedAction = 'Do not click the link or share your OTP. Banks and official bodies never update KYC via external links sent over SMS or WhatsApp.';
      actionChecklist = [
        'Do NOT click any link in the message.',
        'Never enter your Aadhaar, PAN, Netbanking password, or OTP.',
        'To verify KYC status, log in solely through your official bank mobile app or visit your local branch in person.',
        'Block the sender and report the SMS to 1930 or your national cybercrime portal.',
      ];
      break;

    case 'OTP Scam':
      summary = 'This message attempts to deceive you into disclosing a One-Time Password (OTP) or authentication code. Handing over an OTP grants attackers immediate authorization to drain funds or hijack accounts.';
      recommendedAction = 'Never share OTPs, PINs, or security codes with anyone—even individuals claiming to be bank managers or police officers.';
      actionChecklist = [
        'Never forward the SMS or read out the 6-digit code.',
        'Remember: Bank staff will NEVER ask for your OTP under any pretext.',
        'If you already shared an OTP, call your bank immediately to freeze your debit card and netbanking access.',
      ];
      break;

    case 'Job Scam':
      summary = 'This offer promises high daily income for remote work or tasks (e.g., liking YouTube videos), but demands an upfront registration fee or security deposit. Legitimate employers never charge candidates to work.';
      recommendedAction = 'Do not pay any registration, training, or equipment fee. Cease communication with this recruiter immediately.';
      actionChecklist = [
        'Do NOT transfer money to unlock tasks or claim commissions.',
        'Legitimate companies do not hire via anonymous Telegram or WhatsApp channels without formal interviews.',
        'Exit any Telegram task groups to prevent further coordinated social engineering.',
      ];
      break;

    case 'Prize / Lottery Scam':
      summary = 'This message falsely claims you won a lottery, cashback reward, or high-value gift card, and requests an upfront processing or delivery fee to claim it.';
      recommendedAction = 'Do not pay any fee or provide banking details. You cannot win a contest or lottery you never entered.';
      actionChecklist = [
        'Ignore claims of unexpected winnings from Google Pay, Amazon, or state lotteries.',
        'Never pay money to "release" or "transfer" prize money.',
        'Delete the message and block the sender number.',
      ];
      break;

    case 'UPI / Payment Scam':
      summary = 'The sender is exploiting UPI features to trick you into authorizing a debit transaction. Attackers often claim scanning a QR code or entering your UPI PIN is necessary to "receive" a payment or refund.';
      recommendedAction = 'Never enter your UPI PIN or scan a QR code to receive money. Entering your PIN ALWAYS deducts funds from your account.';
      actionChecklist = [
        'Do NOT scan any QR code sent to you.',
        'Do NOT enter your 4-digit or 6-digit UPI PIN.',
        'Receiving money via UPI is completely automatic and requires ZERO PIN entry.',
        'Decline any unexpected "Collect Request" on PhonePe, GPay, or Paytm.',
      ];
      break;

    case 'Investment Scam':
      summary = 'This message promotes guaranteed high returns, zero-risk cryptocurrency trading, or insider stock tips. These schemes pay early investors using money from newer victims before disappearing with the capital.';
      recommendedAction = 'Do not invest funds in unregulated schemes or third-party crypto wallets. High returns with guaranteed zero risk are mathematically fraudulent.';
      actionChecklist = [
        'Never transfer funds to personal UPI IDs or anonymous crypto addresses for "managed investments".',
        'Verify financial advisors through SEBI or official national financial regulators.',
        'Do not join VIP WhatsApp or Telegram trading signals groups.',
      ];
      break;

    case 'Banking Scam':
      summary = 'This message claims your debit/credit card is deactivated or that unredeemed reward points will expire unless you verify account credentials immediately.',
      recommendedAction = 'Do not open external portals. Verify card or account status directly within your official banking application.';
      actionChecklist = [
        'Access your bank only through the official banking app downloaded from Google Play / Apple App Store.',
        'Never provide your 16-digit card number, CVV, or ATM PIN.',
        'Call the official customer care number printed directly on the back of your physical plastic card.',
      ];
      break;

    case 'Technical Support Scam':
      summary = 'This notification alleges your device is infected with malware or spyware and prompts you to dial a fake support desk or download remote access software like AnyDesk or TeamViewer.',
      recommendedAction = 'Do not call the phone number or grant remote desktop access. Operating system vendors never send popup SMS or web alerts with phone numbers.';
      actionChecklist = [
        'Do NOT install AnyDesk, TeamViewer, QuickSupport, or RustDesk on request of strangers.',
        'Do NOT call phone numbers embedded in browser popups or SMS alerts.',
        'Run a standard scan using your built-in Windows Defender or macOS security software.',
      ];
      break;

    case 'Impersonation':
      summary = 'The sender is impersonating law enforcement, electricity utility officers, or courier customs agents, threatening imminent utility disconnection or legal arrest.',
      recommendedAction = 'Do not panic. Public utilities and police do not demand immediate money transfers via mobile numbers over WhatsApp or SMS.';
      actionChecklist = [
        'Do NOT call back the personal mobile number provided in the message.',
        'Check your electricity bill directly on your official state electricity board portal.',
        'Police and customs authorities do not issue digital arrest warrants over video calls or SMS.',
      ];
      break;

    case 'Phishing':
    default:
      summary = 'The message contains deceptive links designed to harvest login credentials, passwords, or personal identity documents under the guise of an urgent account update.';
      recommendedAction = 'Do not click the hyperlink or input personal information. Always navigate directly to the verified website by typing the address manually.';
      actionChecklist = [
        'Inspect the URL carefully: look out for misspelt brand names or unusual domain extensions.',
        'Never enter passwords on links received through SMS or email.',
        'Enable Two-Factor Authentication (2FA) with authenticator apps on your important accounts.',
      ];
      break;
  }

  // Construct "Why did ScamShield flag this?" indicators with calibrated percentage signals
  const whyFlagged = indicators.map(ind => ({
    title: ind.name,
    description: ind.explanation,
    percentage: ind.score,
  }));

  // If indicators were few, add synthesized primary indicators matching the detected risk
  if (whyFlagged.length === 0 && riskScore > 20) {
    whyFlagged.push({
      title: 'Suspicious Language Signature',
      description: 'The message semantics closely align with known social engineering templates.',
      percentage: riskScore,
    });
  }

  return {
    summary,
    recommendedAction,
    actionChecklist,
    whyFlagged,
  };
}

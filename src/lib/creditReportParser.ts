import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface CreditReportData {
  provider: string;
  reportDate: string;
  personalInfo: {
    transunion: PersonalInfo;
    experian: PersonalInfo;
    equifax: PersonalInfo;
  };
  ficoScores: {
    transunion: FicoScore;
    experian: FicoScore;
    equifax: FicoScore;
  };
  accounts: Account[];
  inquiries: Inquiry[];
  summary: {
    transunion: CreditSummary;
    experian: CreditSummary;
    equifax: CreditSummary;
  };
}

export interface PersonalInfo {
  creditReportDate: string | null;
  name: string | null;
  alsoKnownAs: string | null;
  former: string | null;
  dateOfBirth: string | null;
  currentAddresses: string[];
  previousAddresses: string[];
  employers: string[];
}

export interface FicoScore {
  score: number | null;
  rank?: string;
  scale?: string;
}

export interface Account {
  creditor_name: string;
  account_number: string;
  account_type: string;
  account_type_detail: string;
  account_status: string;
  date_opened: string | null;
  last_reported: string | null;
  balance: string | null;
  high_credit: string | null;
  credit_limit: string | null;
  past_due: string | null;
  payment_status: string;
  comments: string | null;
  bureau: string;
}

export interface Inquiry {
  creditor_name: string;
  type_of_business: string | null;
  date: string;
  bureau: string;
}

export interface CreditSummary {
  total_accounts?: number;
  open_accounts?: number;
  closed_accounts?: number;
  delinquent?: number;
  derogatory?: number;
  collection?: number;
  balances?: string;
  payments?: string;
  inquiries?: number;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdf: PDFDocumentProxy = await loadingTask.promise;

    console.log(`Processing PDF with ${pdf.numPages} pages`);
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => {
          const text = item.str;
          const hasEOL = item.hasEOL;
          return hasEOL ? text + '\n' : text + ' ';
        })
        .join('');

      fullText += pageText;
      console.log(`Page ${pageNum} extracted, length: ${pageText.length}`);
    }

    console.log(`Total text extracted: ${fullText.length} characters`);
    console.log('First 1000 characters:', fullText.substring(0, 1000));
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export function parseCreditReportText(text: string): CreditReportData {
  console.log('Parsing credit report text...');
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  const provider = detectProvider(text);
  console.log('Detected provider:', provider);

  const reportDate = extractReportDate(text);
  console.log('Extracted report date:', reportDate);

  const personalInfo = {
    transunion: extractPersonalInfo(text, 'transunion'),
    experian: extractPersonalInfo(text, 'experian'),
    equifax: extractPersonalInfo(text, 'equifax'),
  };
  console.log('Extracted personal info:', JSON.stringify(personalInfo, null, 2));

  const ficoScores = {
    transunion: extractFicoScore(text, 'transunion'),
    experian: extractFicoScore(text, 'experian'),
    equifax: extractFicoScore(text, 'equifax'),
  };
  console.log('Extracted FICO scores:', ficoScores);

  const accounts = extractAccounts(text);
  const inquiries = extractInquiries(text);

  const summary = {
    transunion: extractSummary(text, 'transunion'),
    experian: extractSummary(text, 'experian'),
    equifax: extractSummary(text, 'equifax'),
  };
  console.log('Extracted summary:', summary);

  return {
    provider,
    reportDate,
    personalInfo,
    ficoScores,
    accounts,
    inquiries,
    summary,
  };
}

function detectProvider(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('identityiq')) return 'IdentityIQ';
  if (lowerText.includes('credit karma')) return 'Credit Karma';
  if (lowerText.includes('annualcreditreport')) return 'AnnualCreditReport.com';
  if (lowerText.includes('myfico')) return 'MyFICO';
  if (lowerText.includes('experian') && lowerText.includes('report')) return 'Experian Direct';
  if (lowerText.includes('equifax') && lowerText.includes('report')) return 'Equifax Direct';
  if (lowerText.includes('transunion') && lowerText.includes('report')) return 'TransUnion Direct';
  return 'Unknown Provider';
}

function extractReportDate(text: string): string {
  const datePatterns = [
    /report\s+date:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /as\s+of:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /date:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return new Date().toISOString().split('T')[0];
}

function extractPersonalInfo(text: string, bureau: string): PersonalInfo {
  console.log(`\n=== Extracting Personal Info for ${bureau} ===`);

  const bureauSection = extractBureauSection(text, bureau);
  console.log(`Bureau section length: ${bureauSection.length}`);

  const creditReportDate = extractCreditReportDate(bureauSection, bureau);
  const name = extractBureauName(bureauSection, bureau);
  const alsoKnownAs = extractAlsoKnownAs(bureauSection, bureau);
  const former = extractFormer(bureauSection, bureau);
  const dateOfBirth = extractBureauDateOfBirth(bureauSection, bureau);
  const currentAddresses = extractCurrentAddresses(bureauSection, bureau);
  const previousAddresses = extractPreviousAddresses(bureauSection, bureau);
  const employers = extractBureauEmployers(bureauSection, bureau);

  const result = {
    creditReportDate,
    name,
    alsoKnownAs,
    former,
    dateOfBirth,
    currentAddresses,
    previousAddresses,
    employers,
  };

  console.log(`Extracted personal info for ${bureau}:`, JSON.stringify(result, null, 2));
  return result;
}

function extractBureauSection(text: string, bureau: string): string {
  const bureauMap: { [key: string]: string[] } = {
    transunion: ['TransUnion', 'TRANSUNION', 'Trans Union'],
    experian: ['Experian', 'EXPERIAN'],
    equifax: ['Equifax', 'EQUIFAX'],
  };

  const bureauNames = bureauMap[bureau.toLowerCase()] || [bureau];

  for (const name of bureauNames) {
    const regex = new RegExp(`${name}[\\s\\S]{0,3000}`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[0];
    }
  }

  return text;
}

function extractCreditReportDate(text: string, bureau: string): string | null {
  const patterns = [
    /Credit\s+Report\s+Date:?\s*(\d{2}\/\d{2}\/\d{4})/i,
    /Report\s+Date:?\s*(\d{2}\/\d{2}\/\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log(`Found credit report date for ${bureau}:`, match[1]);
      return match[1];
    }
  }

  console.log(`No credit report date found for ${bureau}`);
  return null;
}

function extractBureauName(text: string, bureau: string): string | null {
  const patterns = [
    /Name:?\s*([A-Z]+(?:\s+[A-Z]+)+)/,
    /consumer\s*name:?\s*([A-Z]+(?:\s+[A-Z]+)+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 3 && name.length < 100) {
        console.log(`Found name for ${bureau}:`, name);
        return name;
      }
    }
  }

  console.log(`No name found for ${bureau}`);
  return null;
}

function extractAlsoKnownAs(text: string, bureau: string): string | null {
  const patterns = [
    /Also\s+Known\s+As:?\s*([A-Z][A-Za-z,\s-]+?)(?=\n|Former|Date\s+of\s+Birth|Current\s+Address)/i,
    /AKA:?\s*([A-Z][A-Za-z,\s-]+?)(?=\n|Former|Date)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const aka = match[1].trim();
      if (aka !== '-' && aka.length > 2) {
        console.log(`Found also known as for ${bureau}:`, aka);
        return aka;
      }
    }
  }

  console.log(`No also known as found for ${bureau}`);
  return null;
}

function extractFormer(text: string, bureau: string): string | null {
  const patterns = [
    /Former:?\s*([A-Z][A-Za-z\s]+?)(?=\n|Date\s+of\s+Birth|Current\s+Address)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const former = match[1].trim();
      if (former !== '-' && former.length > 3) {
        console.log(`Found former name for ${bureau}:`, former);
        return former;
      }
    }
  }

  console.log(`No former name found for ${bureau}`);
  return null;
}

function extractBureauDateOfBirth(text: string, bureau: string): string | null {
  const patterns = [
    /Date\s+of\s+Birth:?\s*(\d{2}\/\d{2}\/\d{4})/i,
    /DOB:?\s*(\d{2}\/\d{2}\/\d{4})/i,
    /Birth:?\s*(\d{2}\/\d{2}\/\d{4})/i,
    /(\d{4})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      console.log(`Found DOB for ${bureau}:`, match[1]);
      return match[1];
    }
  }

  console.log(`No DOB found for ${bureau}`);
  return null;
}

function extractCurrentAddresses(text: string, bureau: string): string[] {
  const addresses: string[] = [];

  const currentAddressSection = text.match(/Current\s+Address(?:es)?:?\s*([\s\S]*?)(?=Previous\s+Address|Employers?:|$)/i);

  if (currentAddressSection && currentAddressSection[1]) {
    const addressText = currentAddressSection[1];

    const addressPattern = /(\d+[^\n]*?(?:AZ|TX|CA|NY|FL|IL|PA|OH|MI|GA|NC|NJ|VA|WA|MA|IN|TN|MO|MD|WI|MN|CO|AL|SC|LA|KY|OR|OK|CT|IA|MS|AR|KS|UT|NV|NM|WV|NE|ID|HI|ME|NH|RI|MT|DE|SD|ND|AK|VT|WY|APT\s+\w+)[^\n]*?\d{5}(?:-\d{4})?)/gi;

    const matches = addressText.matchAll(addressPattern);
    for (const match of matches) {
      if (match[1]) {
        const addr = match[1].trim().replace(/\s+/g, ' ');
        if (addr.length > 10 && addr.length < 200) {
          addresses.push(addr);
        }
      }
    }
  }

  console.log(`Found ${addresses.length} current addresses for ${bureau}`);
  return addresses;
}

function extractPreviousAddresses(text: string, bureau: string): string[] {
  const addresses: string[] = [];

  const previousAddressSection = text.match(/Previous\s+Address(?:es)?:?\s*([\s\S]*?)(?=Employers?:|$)/i);

  if (previousAddressSection && previousAddressSection[1]) {
    const addressText = previousAddressSection[1];

    const addressPattern = /(\d+[^\n]*?(?:AZ|TX|CA|NY|FL|IL|PA|OH|MI|GA|NC|NJ|VA|WA|MA|IN|TN|MO|MD|WI|MN|CO|AL|SC|LA|KY|OR|OK|CT|IA|MS|AR|KS|UT|NV|NM|WV|NE|ID|HI|ME|NH|RI|MT|DE|SD|ND|AK|VT|WY)[^\n]*?\d{5}(?:-\d{4})?)/gi;

    const matches = addressText.matchAll(addressPattern);
    for (const match of matches) {
      if (match[1]) {
        const addr = match[1].trim().replace(/\s+/g, ' ');
        if (addr.length > 10 && addr.length < 200) {
          addresses.push(addr);
        }
      }
    }
  }

  console.log(`Found ${addresses.length} previous addresses for ${bureau}`);
  return addresses;
}

function extractBureauEmployers(text: string, bureau: string): string[] {
  const employers: string[] = [];

  const employerSection = text.match(/Employers?:?\s*([\s\S]*?)(?=\n\n|$)/i);

  if (employerSection && employerSection[1]) {
    const employerText = employerSection[1].trim();

    if (employerText !== '-' && employerText.length > 2 && employerText.length < 200) {
      employers.push(employerText);
    }
  }

  console.log(`Found ${employers.length} employers for ${bureau}`);
  return employers;
}

function extractName(text: string, bureau: string): string | null {
  // More flexible name patterns
  const patterns = [
    new RegExp(`${bureau}[^\\n]*name:?\\s*([A-Z][A-Za-z]+\\s+[A-Z][A-Za-z]+(?:\\s+[A-Z][A-Za-z]+)?)`, 'i'),
    /name:?\s*([A-Z][A-Za-z]+\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)/i,
    /consumer\s+name:?\s*([A-Z][A-Za-z]+\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)/i,
    /full\s+name:?\s*([A-Z][A-Za-z]+\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)/i,
    /personal\s+information[^\n]*name[^\n]*?([A-Z][A-Za-z]+\s+[A-Z][A-Za-z]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 3) {
      const name = match[1].trim();
      console.log(`Found name for ${bureau}:`, name);
      return name;
    }
  }

  console.log(`No name found for ${bureau}`);
  return null;
}

function extractDateOfBirth(text: string, bureau: string): string | null {
  const patterns = [
    /(?:date\s+of\s+birth|dob|birth\s+date):?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /born:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /year\s+of\s+birth:?\s*(\d{4})/i,
    /(?:birth|dob)[^\d]*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    /(?:age|dob)[^\d]*(\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log(`Found DOB for ${bureau}:`, match[1]);
      return match[1];
    }
  }

  console.log(`No DOB found for ${bureau}`);
  return null;
}

function extractAddresses(text: string, bureau: string): string[] {
  const addresses: string[] = [];

  // Multiple address patterns to catch various formats
  const addressPatterns = [
    /\d+\s+[A-Za-z]+(?:\s+[A-Za-z]+)*\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Ct|Court|Pl|Place)[.,]?\s*[A-Za-z]+,?\s*[A-Z]{2}\s*\d{5}/gi,
    /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Dr|Ln|Way|Ct|Pl)[^\d\n]{0,30}[A-Z]{2}\s*\d{5}/gi,
    /address[^\n]{0,10}\d+[^\n]{5,100}/gi,
  ];

  for (const pattern of addressPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(addr => {
        if (addr.length > 10 && addr.length < 200) {
          addresses.push(addr.trim());
        }
      });
      if (addresses.length > 0) break;
    }
  }

  const uniqueAddresses = [...new Set(addresses)];
  console.log(`Found ${uniqueAddresses.length} addresses for ${bureau}`);
  return uniqueAddresses.slice(0, 3);
}

function extractEmployers(text: string, bureau: string): string[] {
  const employers: string[] = [];
  const employerPatterns = [
    /employer:?\s*([A-Z][A-Za-z\s&,.-]+(?:Inc|LLC|Corp|Ltd|Co)?)/gi,
    /employment[^\n]{0,20}([A-Z][A-Za-z\s&,.-]+(?:Inc|LLC|Corp|Ltd|Co)?)/gi,
    /occupation[^\n]{0,20}([A-Z][A-Za-z\s&,.-]+(?:Inc|LLC|Corp|Ltd|Co)?)/gi,
  ];

  for (const pattern of employerPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 2 && match[1].trim().length < 100) {
        employers.push(match[1].trim());
      }
    }
    if (employers.length > 0) break;
  }

  const uniqueEmployers = [...new Set(employers)];
  console.log(`Found ${uniqueEmployers.length} employers for ${bureau}`);
  return uniqueEmployers.slice(0, 2);
}

function extractFicoScore(text: string, bureau: string): FicoScore {
  const bureauPatterns: { [key: string]: RegExp[] } = {
    transunion: [
      /transunion[^0-9]*(?:fico|score|credit score)[^0-9]*(\d{3})/i,
      /tu[^0-9]*(?:fico|score)[^0-9]*(\d{3})/i,
      /trans\s*union[^\d]{0,50}(\d{3})/i,
    ],
    experian: [
      /experian[^0-9]*(?:fico|score|credit score)[^0-9]*(\d{3})/i,
      /exp[^0-9]*(?:fico|score)[^0-9]*(\d{3})/i,
      /experian[^\d]{0,50}(\d{3})/i,
    ],
    equifax: [
      /equifax[^0-9]*(?:fico|score|credit score)[^0-9]*(\d{3})/i,
      /eqf[^0-9]*(?:fico|score)[^0-9]*(\d{3})/i,
      /equifax[^\d]{0,50}(\d{3})/i,
    ],
  };

  const patterns = bureauPatterns[bureau.toLowerCase()] || [];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const score = parseInt(match[1], 10);
      if (score >= 300 && score <= 850) {
        console.log(`Found ${bureau} score:`, score);
        return {
          score,
          rank: getScoreRank(score),
          scale: '300-850',
        };
      }
    }
  }

  // Try generic patterns
  const genericPatterns = [
    /(?:fico|credit\s+score)[^0-9]*(\d{3})/i,
    /score[^0-9]*(\d{3})/i,
  ];

  for (const pattern of genericPatterns) {
    const match = text.match(pattern);
    if (match) {
      const score = parseInt(match[1], 10);
      if (score >= 300 && score <= 850) {
        console.log(`Found generic score for ${bureau}:`, score);
        return {
          score,
          rank: getScoreRank(score),
          scale: '300-850',
        };
      }
    }
  }

  console.log(`No valid score found for ${bureau}`);
  return { score: null, scale: '300-850' };
}

function getScoreRank(score: number): string {
  if (score >= 800) return 'Exceptional';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

function extractAccounts(text: string): Account[] {
  const accounts: Account[] = [];

  const accountPatterns = [
    /(?:account|creditor)[:\s]+([A-Z][A-Za-z\s&,-]+?)(?:\s+account|\s+#|\s+acct)/gi,
  ];

  return accounts;
}

function extractInquiries(text: string): Inquiry[] {
  const inquiries: Inquiry[] = [];

  return inquiries;
}

function extractSummary(text: string, bureau: string): CreditSummary {
  const summary: CreditSummary = {};

  const totalAccountsMatch = text.match(/total\s+accounts?:?\s*(\d+)/i);
  if (totalAccountsMatch) {
    summary.total_accounts = parseInt(totalAccountsMatch[1], 10);
  }

  const openAccountsMatch = text.match(/open\s+accounts?:?\s*(\d+)/i);
  if (openAccountsMatch) {
    summary.open_accounts = parseInt(openAccountsMatch[1], 10);
  }

  const closedAccountsMatch = text.match(/closed\s+accounts?:?\s*(\d+)/i);
  if (closedAccountsMatch) {
    summary.closed_accounts = parseInt(closedAccountsMatch[1], 10);
  }

  return summary;
}

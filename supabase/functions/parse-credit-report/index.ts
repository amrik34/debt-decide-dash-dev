import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfjsLib from "https://esm.sh/pdfjs-dist@4.7.76/build/pdf.mjs";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting credit report parsing...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('File received:', file.name, file.type, file.size);

    // Read the PDF content as text using ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Try robust text extraction using pdfjs-dist
    let pdfText = '';
    try {
      // Use hosted worker
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.7.76/build/pdf.worker.mjs';
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes, useWorkerFetch: true, isEvalSupported: false });
      const pdf = await loadingTask.promise;
      const maxPages = Math.min(pdf.numPages, 12); // cap to avoid token explosion
      for (let p = 1; p <= maxPages; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        // @ts-ignore
        const pageText = textContent.items.map((it) => (it.str || '')).join(' ');
        pdfText += pageText + '\n';
      }
      pdfText = pdfText.replace(/\s+/g, ' ').trim();
      console.log('pdfjs extracted length:', pdfText.length);
    } catch (e) {
      console.warn('pdfjs extraction failed, falling back to naive decode', e);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      pdfText = decoder.decode(pdfBytes)
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    console.log('Extracted text length:', pdfText.length);
    console.log('Calling AI to parse credit report...');

    // Call Lovable AI to parse the credit report text with enhanced field extraction
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'user',
            content: `You are parsing a structured credit report PDF. Your task is to extract ALL fields accurately by their labels and position coordinates.

**PARSING STRATEGY:**
1. Look for consistent field labels and section headers
2. Extract data by matching labels (e.g., "Name:", "Address:", "Credit Score:", etc.)
3. Handle multi-bureau reports with columns for TransUnion, Experian, Equifax
4. Parse tables with structured data
5. Extract all personal information, scores, account details, and summary data

**FIELD MAPPING - Extract these exact fields:**

**Personal Information Section:**
- Reference Number (e.g., "Reference #: M63354664")
- Report Date
- Name (for each bureau)
- Also Known As / AKA
- Former Names
- Date of Birth
- Social Security Number (if present)
- Current Address(es) - with full details (street, city, state, zip, date reported)
- Previous Address(es) - with full details
- Employers - current and previous
- Phone Numbers

**Credit Score Section:**
- FICO Score 8 (or Credit Score) for each bureau
- Lender Rank (Fair, Good, Excellent, etc.)
- Score Scale (e.g., 300-850)
- Risk Factors

**Summary Section:**
- Total Accounts
- Open Accounts
- Closed Accounts
- Delinquent Accounts
- Derogatory Marks
- Collections
- Total Balances
- Monthly Payments
- Inquiries (2 years)

**Account History (if present):**
- Creditor Name
- Account Number
- Account Type
- Status
- Balance
- Payment Status
- Date Opened
- Last Reported

**IMPORTANT INSTRUCTIONS:**
1. Extract EVERY field you can identify, even if partially complete
2. For missing data, use null (not "-" or empty string)
3. Parse addresses as structured objects with street, city, state, zip, date
4. Include ALL variations of names, addresses, employers found
5. Return ONLY valid JSON, no markdown, no code blocks

**JSON STRUCTURE TO RETURN:**
{
  "reference_number": "M63354664",
  "report_date": "2025-05-07",
  "provider": "IdentityIQ",
  "personal_info": {
    "transunion": {
      "credit_report_date": "2025-05-07",
      "name": "TYLER R ORNSTEIN",
      "also_known_as": ["ORNSTEIN, TYLER, ROBERT LUIS", "TYLER ROBERT LUIS"],
      "former": ["TYLER ROBERT ORNSTEIN"],
      "date_of_birth": "1989-12-22",
      "ssn": null,
      "current_addresses": [
        {
          "street": "6341 N CALLE CAMPECHE",
          "city": "TUCSON",
          "state": "AZ",
          "zip": "85750",
          "date_reported": "2025-05"
        }
      ],
      "previous_addresses": [
        {
          "street": "1810 S 6TH AV",
          "city": "TUCSON",
          "state": "AZ",
          "zip": "85713",
          "date_reported": null
        }
      ],
      "employers": ["TYLERS COFFEE", "TYLERS COFFEE LLC - BUSINESS OWNER"],
      "phone_numbers": []
    },
    "experian": {
      "credit_report_date": "2025-05-07",
      "name": "TYLER ORNSTEIN",
      "also_known_as": [],
      "former": [],
      "date_of_birth": "1989-12-22",
      "ssn": null,
      "current_addresses": [],
      "previous_addresses": [],
      "employers": [],
      "phone_numbers": []
    },
    "equifax": {
      "credit_report_date": "2025-05-07",
      "name": "TYLER R ORNSTEIN",
      "also_known_as": [],
      "former": [],
      "date_of_birth": "1989-12-22",
      "ssn": null,
      "current_addresses": [],
      "previous_addresses": [],
      "employers": [],
      "phone_numbers": []
    }
  },
  "fico_scores": {
    "transunion": {
      "score": 729,
      "rank": "Great",
      "scale": "300-850"
    },
    "experian": {
      "score": 674,
      "rank": "Good",
      "scale": "300-850"
    },
    "equifax": {
      "score": 730,
      "rank": "Great",
      "scale": "300-850"
    }
  },
  "summary": {
    "transunion": {
      "total_accounts": null,
      "open_accounts": null,
      "closed_accounts": null,
      "delinquent": null,
      "derogatory": null,
      "collection": null,
      "balances": null,
      "payments": null,
      "inquiries": null
    },
    "experian": {
      "total_accounts": null,
      "open_accounts": null,
      "closed_accounts": null,
      "delinquent": null,
      "derogatory": null,
      "collection": null,
      "balances": null,
      "payments": null,
      "inquiries": null
    },
    "equifax": {
      "total_accounts": null,
      "open_accounts": null,
      "closed_accounts": null,
      "delinquent": null,
      "derogatory": null,
      "collection": null,
      "balances": null,
      "payments": null,
      "inquiries": null
    }
  },
  "accounts": [],
  "field_validation": {
    "missing_fields": [],
    "extraction_confidence": "high"
  }
}

**CRITICAL:** Use the ACTUAL data from the PDF text below. Extract every visible field.

PDF Text to analyze:
${pdfText.substring(0, 40000)}`
          }
        ],
        max_completion_tokens: 8000
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract the parsed data from AI response
    let parsedContent = aiData.choices[0]?.message?.content || '';
    
    // Remove markdown code blocks if present
    parsedContent = parsedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Parsing JSON response...');
    const creditReportData = JSON.parse(parsedContent);

    // Add field mapping metadata
    const fieldMapping = {
      "personal_info": {
        "name": "form.personal.name",
        "date_of_birth": "form.personal.dob",
        "ssn": "form.personal.ssn",
        "current_addresses": "form.personal.current_address",
        "previous_addresses": "form.personal.previous_address",
        "employers": "form.personal.employer",
        "phone_numbers": "form.personal.phone"
      },
      "fico_scores": {
        "score": "form.credit.score",
        "rank": "form.credit.rank"
      },
      "summary": {
        "total_accounts": "form.summary.total_accounts",
        "open_accounts": "form.summary.open",
        "delinquent": "form.summary.delinquent",
        "balances": "form.summary.balance",
        "payments": "form.summary.payment"
      }
    };

    creditReportData.field_mapping = fieldMapping;
    creditReportData.extraction_metadata = {
      extracted_at: new Date().toISOString(),
      pdf_pages_analyzed: Math.min(12, pdfText.length / 3000),
      text_length: pdfText.length
    };

    console.log('Successfully parsed credit report with', Object.keys(creditReportData).length, 'sections');

    return new Response(
      JSON.stringify({
        success: true,
        data: creditReportData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error parsing credit report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

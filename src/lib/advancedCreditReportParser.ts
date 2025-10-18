import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL?: boolean;
}

export interface PersonalInfoAdvanced {
  creditReportDate: string | null;
  name: string | null;
  alsoKnownAs: string | null;
  former: string | null;
  dateOfBirth: string | null;
  currentAddresses: string[];
  previousAddresses: string[];
  employers: string[];
}

export interface CreditReportDataAdvanced {
  provider: string;
  reportDate: string;
  personalInfo: {
    transunion: PersonalInfoAdvanced;
    experian: PersonalInfoAdvanced;
    equifax: PersonalInfoAdvanced;
  };
}

interface TextItemWithPosition extends TextItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TableRow {
  y: number;
  cells: Array<{ x: number; text: string }>;
}

export async function parseIdentityIQCreditReport(file: File): Promise<CreditReportDataAdvanced> {
  try {
    console.log('Starting IdentityIQ PDF parsing for:', file.name);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf: PDFDocumentProxy = await loadingTask.promise;
    console.log(`PDF has ${pdf.numPages} pages`);

    const page = await pdf.getPage(2);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    const textItems: TextItemWithPosition[] = textContent.items
      .filter((item: any) => item.str !== undefined)
      .map((item: any) => {
        const transform = item.transform;
        return {
          str: item.str,
          transform: item.transform,
          x: transform[4],
          y: viewport.height - transform[5],
          width: item.width || 0,
          height: item.height || 0,
        };
      });

    console.log(`Extracted ${textItems.length} text items from page 2`);

    const tableData = parsePersonalInfoTable(textItems);

    console.log('=== Parsed Table Data ===');
    console.log('TransUnion:', tableData.transunion);
    console.log('Experian:', tableData.experian);
    console.log('Equifax:', tableData.equifax);

    return {
      provider: 'IdentityIQ',
      reportDate: tableData.transunion.creditReportDate || tableData.experian.creditReportDate || tableData.equifax.creditReportDate || new Date().toISOString().split('T')[0],
      personalInfo: {
        transunion: tableData.transunion,
        experian: tableData.experian,
        equifax: tableData.equifax,
      },
    };
  } catch (error) {
    console.error('Error parsing IdentityIQ PDF:', error);
    throw new Error(`Failed to parse credit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parsePersonalInfoTable(items: TextItemWithPosition[]): {
  transunion: PersonalInfoAdvanced;
  experian: PersonalInfoAdvanced;
  equifax: PersonalInfoAdvanced;
} {
  const rows: TableRow[] = [];
  const yThreshold = 5;

  items.forEach(item => {
    const existingRow = rows.find(row => Math.abs(row.y - item.y) < yThreshold);
    if (existingRow) {
      existingRow.cells.push({ x: item.x, text: item.str });
    } else {
      rows.push({ y: item.y, cells: [{ x: item.x, text: item.str }] });
    }
  });

  rows.forEach(row => {
    row.cells.sort((a, b) => a.x - b.x);
  });
  rows.sort((a, b) => a.y - b.y);

  console.log('=== Parsed Table Rows (first 20) ===');
  rows.slice(0, 20).forEach((row, idx) => {
    const rowText = row.cells.map(c => c.text).join(' | ');
    console.log(`Row ${idx}: ${rowText}`);
  });

  const columnHeaders = findColumnHeaders(rows);
  console.log('Column headers:', columnHeaders);

  const data = {
    transunion: createEmptyPersonalInfo(),
    experian: createEmptyPersonalInfo(),
    equifax: createEmptyPersonalInfo(),
  };

  let currentField: string | null = null;
  let addressMode: 'current' | 'previous' | null = null;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowText = row.cells.map(c => c.text).join(' ').toLowerCase();

    if (rowText.includes('credit report date')) {
      currentField = 'creditReportDate';
      continue;
    }

    if (rowText.includes('name:') && !rowText.includes('also known') && !rowText.includes('former')) {
      currentField = 'name';
      continue;
    }

    if (rowText.includes('also known as')) {
      currentField = 'alsoKnownAs';
      addressMode = null;
      continue;
    }

    if (rowText.includes('former:')) {
      currentField = 'former';
      addressMode = null;
      continue;
    }

    if (rowText.includes('date of birth')) {
      currentField = 'dateOfBirth';
      addressMode = null;
      continue;
    }

    if (rowText.includes('current address')) {
      currentField = 'currentAddresses';
      addressMode = 'current';
      continue;
    }

    if (rowText.includes('previous address')) {
      currentField = 'previousAddresses';
      addressMode = 'previous';
      continue;
    }

    if (rowText.includes('employer')) {
      currentField = 'employers';
      addressMode = null;
      continue;
    }

    if (rowText.includes('credit score')) {
      break;
    }

    if (currentField && row.cells.length >= 3) {
      const values = extractRowValues(row, columnHeaders);

      if (currentField === 'currentAddresses' || currentField === 'previousAddresses') {
        if (values.transunion && values.transunion !== '-') {
          data.transunion[currentField].push(values.transunion);
        }
        if (values.experian && values.experian !== '-') {
          data.experian[currentField].push(values.experian);
        }
        if (values.equifax && values.equifax !== '-') {
          data.equifax[currentField].push(values.equifax);
        }
      } else if (currentField === 'employers') {
        if (values.transunion && values.transunion !== '-') {
          data.transunion.employers.push(values.transunion);
        }
        if (values.experian && values.experian !== '-') {
          data.experian.employers.push(values.experian);
        }
        if (values.equifax && values.equifax !== '-') {
          data.equifax.employers.push(values.equifax);
        }
      } else {
        if (values.transunion && values.transunion !== '-' && !data.transunion[currentField as keyof PersonalInfoAdvanced]) {
          (data.transunion as any)[currentField] = values.transunion;
        }
        if (values.experian && values.experian !== '-' && !data.experian[currentField as keyof PersonalInfoAdvanced]) {
          (data.experian as any)[currentField] = values.experian;
        }
        if (values.equifax && values.equifax !== '-' && !data.equifax[currentField as keyof PersonalInfoAdvanced]) {
          (data.equifax as any)[currentField] = values.equifax;
        }
      }
    }
  }

  return data;
}

function findColumnHeaders(rows: TableRow[]): { transunion: number; experian: number; equifax: number } | null {
  for (const row of rows) {
    const cells = row.cells;
    let transunionX = -1;
    let experianX = -1;
    let equifaxX = -1;

    for (const cell of cells) {
      const text = cell.text.toLowerCase();
      if (text.includes('transunion')) transunionX = cell.x;
      if (text.includes('experian')) experianX = cell.x;
      if (text.includes('equifax')) equifaxX = cell.x;
    }

    if (transunionX > 0 && experianX > 0 && equifaxX > 0) {
      console.log(`Found column headers at x positions: TU=${transunionX}, EX=${experianX}, EQ=${equifaxX}`);
      return { transunion: transunionX, experian: experianX, equifax: equifaxX };
    }
  }

  return null;
}

function extractRowValues(row: TableRow, headers: { transunion: number; experian: number; equifax: number } | null): {
  transunion: string;
  experian: string;
  equifax: string;
} {
  if (!headers) {
    if (row.cells.length >= 3) {
      return {
        transunion: row.cells[0]?.text || '',
        experian: row.cells[1]?.text || '',
        equifax: row.cells[2]?.text || '',
      };
    }
    return { transunion: '', experian: '', equifax: '' };
  }

  const xTolerance = 50;

  const transunionCells = row.cells.filter(c => Math.abs(c.x - headers.transunion) < xTolerance);
  const experianCells = row.cells.filter(c => Math.abs(c.x - headers.experian) < xTolerance);
  const equifaxCells = row.cells.filter(c => Math.abs(c.x - headers.equifax) < xTolerance);

  return {
    transunion: transunionCells.map(c => c.text).join(' ').trim(),
    experian: experianCells.map(c => c.text).join(' ').trim(),
    equifax: equifaxCells.map(c => c.text).join(' ').trim(),
  };
}

function createEmptyPersonalInfo(): PersonalInfoAdvanced {
  return {
    creditReportDate: null,
    name: null,
    alsoKnownAs: null,
    former: null,
    dateOfBirth: null,
    currentAddresses: [],
    previousAddresses: [],
    employers: [],
  };
}

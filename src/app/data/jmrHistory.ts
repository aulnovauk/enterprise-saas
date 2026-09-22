// Historical JMR records for the financial years that precede the hand-authored set
// in JMRDataManagement. These are derived deterministically at module load rather than
// carried as ~370 literal records, so the back-years stay internally consistent and the
// page file stays readable.
//
// Baseline: each plant's mean monthly figures measured from the FY 2025-26 records.
// Seasonal shape: the generation curve Financial Reports uses, normalised so the
// Nov-Mar window (the window the baseline was measured over) averages 1.0.

export type JmrRecord = {
  id: string; fy: string; month: string; plant: string; district: string; vendor: string;
  capacityKWp: number; grossGeneration: number; energyExportKWh: number; energyImportKWh: number;
  outage: string; revenue: number; approvalStatus: string; lockStatus: boolean; version: number;
  pdfUploaded: boolean; submittedBy: string; approvedBy: string;
  submittedDate: string; approvedDate: string;
};

const PLANT_BASELINE = [
  {
    "plant": "Solar Park 01",
    "district": "Zone 1",
    "vendor": "Vendor Bravo",
    "capacityKWp": 2555.19,
    "gross": 4263,
    "expPerGross": 57.7945,
    "impPerExp": 0.006201,
    "revPerExp": 0.00016403
  },
  {
    "plant": "Solar Park 02",
    "district": "Zone 2",
    "vendor": "Vendor Alpha",
    "capacityKWp": 1530,
    "gross": 2047,
    "expPerGross": 46.9192,
    "impPerExp": 0.006552,
    "revPerExp": 0.00020241
  },
  {
    "plant": "Solar Park 03",
    "district": "Zone 3",
    "vendor": "Vendor Delta",
    "capacityKWp": 2777.77,
    "gross": 8277,
    "expPerGross": 44.5622,
    "impPerExp": 0.008573,
    "revPerExp": 0.00021318
  },
  {
    "plant": "Solar Park 04",
    "district": "Zone 4",
    "vendor": "Vendor Echo",
    "capacityKWp": 2040,
    "gross": 6451,
    "expPerGross": 47.2277,
    "impPerExp": 0.003764,
    "revPerExp": 0.00020113
  },
  {
    "plant": "Solar Park 05",
    "district": "Zone 5",
    "vendor": "Vendor Charlie",
    "capacityKWp": 3060,
    "gross": 8702,
    "expPerGross": 48.4143,
    "impPerExp": 0.005602,
    "revPerExp": 0.00019622
  },
  {
    "plant": "Solar Park 06",
    "district": "Zone 6",
    "vendor": "Vendor Bravo",
    "capacityKWp": 1224,
    "gross": 1735,
    "expPerGross": 34.4682,
    "impPerExp": 0.005019,
    "revPerExp": 0.00027574
  },
  {
    "plant": "Solar Park 07",
    "district": "Zone 6",
    "vendor": "Vendor Charlie",
    "capacityKWp": 1836,
    "gross": 2625,
    "expPerGross": 34.4639,
    "impPerExp": 0.004974,
    "revPerExp": 0.00027564
  },
  {
    "plant": "Solar Park 08",
    "district": "Zone 7",
    "vendor": "Vendor Bravo",
    "capacityKWp": 1428,
    "gross": 2025,
    "expPerGross": 34.4686,
    "impPerExp": 0.005128,
    "revPerExp": 0.00027571
  },
  {
    "plant": "Solar Park 09",
    "district": "Zone 8",
    "vendor": "Vendor Alpha",
    "capacityKWp": 1632,
    "gross": 2149,
    "expPerGross": 34.5551,
    "impPerExp": 0.005105,
    "revPerExp": 0.00027496
  },
  {
    "plant": "Solar Park 10",
    "district": "Zone 9",
    "vendor": "Vendor Alpha",
    "capacityKWp": 1020,
    "gross": 1919,
    "expPerGross": 34.4815,
    "impPerExp": 0.004871,
    "revPerExp": 0.00027559
  },
  {
    "plant": "Solar Park 11",
    "district": "Zone 10",
    "vendor": "Vendor Alpha",
    "capacityKWp": 2244,
    "gross": 3154,
    "expPerGross": 34.4732,
    "impPerExp": 0.005004,
    "revPerExp": 0.00027559
  },
  {
    "plant": "Solar Park 12",
    "district": "Zone 11",
    "vendor": "Vendor Charlie",
    "capacityKWp": 816,
    "gross": 1192,
    "expPerGross": 34.4713,
    "impPerExp": 0.005029,
    "revPerExp": 0.00027555
  }
] as const;

const SEASON: Record<string, number> = {
  "April": 1.009,
  "May": 1.0659,
  "June": 0.8869,
  "July": 0.8218,
  "August": 0.9357,
  "September": 0.9845,
  "October": 1.0578,
  "November": 1.0171,
  "December": 0.9683,
  "January": 1.009,
  "February": 0.9561,
  "March": 1.0496
};

// Portfolio level per year, relative to FY 2025-26 — the same year factors the
// Dashboard applies to its KPIs.
const FY_LEVEL: Record<string, number> = {
  "FY 2025-26": 1.00,
  "FY 2024-25": 0.95,
  "FY 2023-24": 0.88,
};

const MONTH_NO: Record<string, number> = {
  April: 4, May: 5, June: 6, July: 7, August: 8, September: 9,
  October: 10, November: 11, December: 12, January: 1, February: 2, March: 3,
};

// FY 2025-26 already ships Nov-Mar as literals, so only its Apr-Oct half is generated.
const FY_MONTHS: Record<string, string[]> = {
  "FY 2025-26": ["April", "May", "June", "July", "August", "September", "October"],
  "FY 2024-25": ["April", "May", "June", "July", "August", "September",
                 "October", "November", "December", "January", "February", "March"],
  "FY 2023-24": ["April", "May", "June", "July", "August", "September",
                 "October", "November", "December", "January", "February", "March"],
};

const SUBMITTERS = ["Rajesh Kumar", "Sunil Patel", "Venkat Rao", "Amit Desai", "Lakshmi N"];
const APPROVERS = ["Priya Sharma", "Suresh Iyer"];

// Deterministic pseudo-random so every load produces the same demo data.
const noise = (a: number, b: number, c: number, amp: number) => {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return 1 + ((x - Math.floor(x)) - 0.5) * 2 * amp;
};
const pick = (a: number, b: number, n: number) => {
  const x = Math.sin(a * 4.137 + b * 9.731) * 24634.6345;
  return Math.floor((x - Math.floor(x)) * n) % n;
};
const pad = (n: number, w: number) => String(n).padStart(w, "0");

function build(): JmrRecord[] {
  const out: JmrRecord[] = [];
  Object.entries(FY_MONTHS).forEach(([fy, months]) => {
    const fyStart = Number(fy.slice(3, 7));
    const level = FY_LEVEL[fy];
    months.forEach((month, mi) => {
      const mNo = MONTH_NO[month];
      const calYear = mNo >= 4 ? fyStart : fyStart + 1;
      PLANT_BASELINE.forEach((b, pi) => {
        const factor = SEASON[month] * level * noise(fyStart + mi, pi, mNo, 0.035);
        const gross = Math.round(b.gross * factor);
        const exp = +(gross * b.expPerGross).toFixed(2);
        const imp = +(exp * b.impPerExp).toFixed(2);
        const revenue = +(exp * b.revPerExp).toFixed(2);
        const outMin = pick(fyStart + mNo, pi, 1440);
        const nextMonth = mNo === 12 ? 1 : mNo + 1;
        const nextYear = mNo === 12 ? calYear + 1 : calYear;
        out.push({
          id: `JMR-${calYear}-${pad(mNo, 2)}-${pad(pi + 1, 3)}`,
          fy, month, plant: b.plant, district: b.district, vendor: b.vendor,
          capacityKWp: b.capacityKWp,
          grossGeneration: gross, energyExportKWh: exp, energyImportKWh: imp,
          outage: `${pad(Math.floor(outMin / 60), 2)}:${pad(outMin % 60, 2)}`,
          revenue,
          // Closed financial years: everything is approved and locked.
          approvalStatus: "approved",
          lockStatus: true,
          version: 2,
          pdfUploaded: true,
          submittedBy: SUBMITTERS[(mi + pi) % SUBMITTERS.length],
          approvedBy: APPROVERS[(mi + pi) % APPROVERS.length],
          submittedDate: `${nextYear}-${pad(nextMonth, 2)}-${pad((pi % 3) + 1, 2)}`,
          approvedDate: `${nextYear}-${pad(nextMonth, 2)}-${pad((pi % 3) + 4, 2)}`,
        });
      });
    });
  });
  return out;
}

export const historicalJmrRecords: JmrRecord[] = build();

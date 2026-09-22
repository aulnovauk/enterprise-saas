export interface PlantInfo {
  id: number;
  name: string;
  state: string;
  district: string;
  capacity: number;
  vendor: string;
  lat: number;
  lon: number;
  commissionDate: string;
  technology: string;
  inverters: number;
  modules: number;
}

export const VENDORS = [
  "Vendor Bravo",
  "Vendor Alpha",
  "Vendor Delta",
  "Vendor Echo",
  "Vendor Charlie",
] as const;

export type VendorName = (typeof VENDORS)[number];

export const VENDOR_COLORS: Record<string, string> = {
  "Vendor Bravo": "#2563eb",
  "Vendor Alpha": "#f59e0b",
  "Vendor Delta": "#10b981",
  "Vendor Echo": "#8b5cf6",
  "Vendor Charlie": "#ef4444",
};

export const PLANTS: PlantInfo[] = [
  { id: 1,  name: "Solar Park 01",        state: "Region North", district: "Zone 1",       capacity: 25, vendor: "Vendor Bravo",   lat: 20.98, lon: 74.15, commissionDate: "2020-04-15", technology: "Mono-crystalline", inverters: 10, modules: 73440 },
  { id: 2,  name: "Solar Park 02",        state: "Region North", district: "Zone 2",      capacity: 15, vendor: "Vendor Alpha",   lat: 16.85, lon: 74.56, commissionDate: "2019-11-20", technology: "Poly-crystalline", inverters: 6,  modules: 43200 },
  { id: 3,  name: "Solar Park 03",    state: "Region North", district: "Zone 3",   capacity: 30, vendor: "Vendor Delta", lat: 18.18, lon: 76.04, commissionDate: "2021-06-10", technology: "Mono-crystalline", inverters: 12, modules: 86400 },
  { id: 4,  name: "Solar Park 04",      state: "Region North", district: "Zone 4",       capacity: 20, vendor: "Vendor Echo",   lat: 18.40, lon: 76.57, commissionDate: "2020-09-05", technology: "Bifacial",         inverters: 8,  modules: 57600 },
  { id: 5,  name: "Solar Park 05",          state: "Region North", district: "Zone 5",        capacity: 30, vendor: "Vendor Charlie",  lat: 18.99, lon: 75.76, commissionDate: "2020-03-12", technology: "Mono-crystalline", inverters: 12, modules: 86400 },
  { id: 6,  name: "Solar Park 06",   state: "Region North", district: "Zone 6",  capacity: 12, vendor: "Vendor Bravo",   lat: 19.09, lon: 74.74, commissionDate: "2021-04-10", technology: "Mono-crystalline", inverters: 5,  modules: 34560 },
  { id: 7,  name: "Solar Park 07",   state: "Region North", district: "Zone 6",  capacity: 18, vendor: "Vendor Charlie",  lat: 19.20, lon: 74.28, commissionDate: "2020-08-22", technology: "Mono-crystalline", inverters: 7,  modules: 51840 },
  { id: 8,  name: "Solar Park 08",      state: "Region North", district: "Zone 7",    capacity: 14, vendor: "Vendor Bravo",   lat: 20.93, lon: 77.75, commissionDate: "2020-11-10", technology: "Poly-crystalline", inverters: 6,  modules: 40320 },
  { id: 9,  name: "Solar Park 09",        state: "Region North", district: "Zone 8",      capacity: 16, vendor: "Vendor Alpha",   lat: 20.73, lon: 78.60, commissionDate: "2021-01-18", technology: "Poly-crystalline", inverters: 6,  modules: 46080 },
  { id: 10, name: "Solar Park 10",      state: "Region North", district: "Zone 9",    capacity: 10, vendor: "Vendor Alpha",   lat: 20.53, lon: 76.18, commissionDate: "2019-12-05", technology: "Poly-crystalline", inverters: 4,  modules: 28800 },
  { id: 11, name: "Solar Park 11", state: "Region North", district: "Zone 10",  capacity: 22, vendor: "Vendor Alpha",   lat: 19.95, lon: 79.30, commissionDate: "2020-06-15", technology: "Mono-crystalline", inverters: 9,  modules: 63360 },
  { id: 12, name: "Solar Park 12",   state: "Region North", district: "Zone 11",    capacity: 8,  vendor: "Vendor Charlie",  lat: 21.17, lon: 79.65, commissionDate: "2021-02-28", technology: "Bifacial",         inverters: 3,  modules: 23040 },
];

export const TOTAL_CAPACITY = PLANTS.reduce((sum, p) => sum + p.capacity, 0);
export const PLANT_COUNT = PLANTS.length;

export function getPlantByName(name: string): PlantInfo | undefined {
  return PLANTS.find(p => p.name === name);
}

export function getPlantsByVendor(vendor: string): PlantInfo[] {
  return PLANTS.filter(p => p.vendor === vendor);
}

export function getVendorForPlant(plantName: string): string {
  return PLANTS.find(p => p.name === plantName)?.vendor ?? "Unknown";
}

export function getCapacityKWp(plantName: string): number {
  const plant = PLANTS.find(p => p.name === plantName);
  return plant ? plant.capacity * 1000 : 0;
}

export type ServiceProvider = {
  id: string;
  name: string;
  category: string;
  village: string;
  distanceKm: number;
  phone: string;
  available: boolean;
  verified: boolean;
  source: string;
  updatedAt: string;
};

export type UnderstoodRequest = {
  category: string | null;
  village: string | null;
  language: "en" | "kn";
  rawText: string;
};

export type PipelineResult = {
  reply: string;
  understood: UnderstoodRequest;
  matches: ServiceProvider[];
  verified: boolean;
};

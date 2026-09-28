export interface ServiceCategoryRef {
  slug: string;
  name: string;
  icon: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  feeCents: number;
  processingTime: string;
  eligibility: string[];
  documents: string[];
  steps: string[];
  isPopular: boolean;
  isActive: boolean;
  category: ServiceCategoryRef;
}

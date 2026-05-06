export interface Property {
  id: string;
  slug: string;
  propertyCode: string;
  title: string;
  status: "available" | "sold" | "reserved";
  featured: boolean;
  published: boolean;
  location: string;
  village: string;
  taluka: string;
  district: string;
  coordinates: { lat: number; lng: number };
  priceTotal: number;
  pricePerSqft: number;
  areaSqft: number;
  areaGuntha: number;
  areaAcre: number;
  zoningType: string;
  titleClarity: "clear" | "disputed" | "pending";
  roadAccess: boolean;
  gallery: string[];
  brochure?: string;
  highlights: string[];
  nearbyLandmarks: Landmark[];
  investmentReasoning: string;
  whyThisProperty: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Landmark {
  name: string;
  distance: string;
  type: "airport" | "highway" | "railway" | "hospital" | "school" | "market" | "other";
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  budgetRange: string;
  timeline: string;
  purpose: "investment" | "self-use" | "weekend-home" | "agriculture" | "other";
  locationPreference: string;
  interestedPropertyId?: string;
  interestedPropertyTitle?: string;
  sourcePage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType: "mobile" | "desktop" | "tablet";
  leadScore: number;
  leadStatus: LeadStatus;
  assignedTo?: string;
  notes?: LeadNote[];
  followUps?: FollowUp[];
  siteVisits?: SiteVisit[];
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "site_visit_planned"
  | "site_visit_done"
  | "negotiation"
  | "closed"
  | "lost";

export interface LeadNote {
  id: string;
  content: string;
  addedBy: string;
  addedAt: string;
}

export interface FollowUp {
  id: string;
  scheduledFor: string;
  completedAt?: string;
  type: "call" | "whatsapp" | "email" | "visit";
  notes?: string;
  outcome?: string;
}

export interface SiteVisit {
  id: string;
  scheduledDate: string;
  status: "planned" | "done" | "cancelled" | "rescheduled";
  propertyId: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "sales" | "content_editor" | "viewer";
  avatar?: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  propertyPurchased?: string;
  avatar?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

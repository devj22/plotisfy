import { Lead, Testimonial } from "@/types";

// Properties and blogs are managed via the admin panel (MongoDB).
// Fetch them from /api/properties and /api/blogs.

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Rajesh Mehta",
    location: "Mumbai",
    content:
      "Plotzify made the entire process seamless. From property selection to final registration, their team was transparent, professional, and extremely knowledgeable about the Panvel market. I invested in a 2500 sqft plot and the appreciation in 8 months has been remarkable.",
    rating: 5,
    propertyPurchased: "Premium Plot in Panvel Sector 12",
    avatar: "RM",
  },
  {
    id: "2",
    name: "Priya Sharma",
    location: "Pune",
    content:
      "We were looking for a weekend farmhouse land near Mumbai for two years. Plotzify's Khalapur listings were exactly what we needed – honest descriptions, verified titles, and the team organised a proper site visit with no pressure. Highly recommended.",
    rating: 5,
    propertyPurchased: "Weekend Farmhouse Plot in Khalapur Valley",
    avatar: "PS",
  },
  {
    id: "3",
    name: "Vikram Nair",
    location: "Dubai (NRI)",
    content:
      "As an NRI investor, trust is everything. Plotzify provided proper documentation, video tours, and their legal team assisted with the OCI card requirements. The whole deal was concluded remotely with complete peace of mind. Will definitely invest again.",
    rating: 5,
    propertyPurchased: "Residential Plot on Airport Access Road",
    avatar: "VN",
  },
  {
    id: "4",
    name: "Anita Desai",
    location: "Navi Mumbai",
    content:
      "Professional and trustworthy. I appreciated that they didn't push me into a decision. The investment reasoning section on each property listing helped me understand the 'why' behind each location. Extremely transparent about title status.",
    rating: 5,
    avatar: "AD",
  },
  {
    id: "5",
    name: "Suresh Patil",
    location: "Thane",
    content:
      "Bought a plot near the Panvel airport corridor. The site visit was well-organised and the Plotzify team knew every nearby development, road widening plan, and township approval status. This level of ground knowledge is rare.",
    rating: 5,
    propertyPurchased: "Premium Plot in Panvel Sector 12",
    avatar: "SP",
  },
];

export const LEADS: Lead[] = [
  {
    id: "1",
    name: "Aakash Verma",
    phone: "+91 98201 45123",
    email: "aakash.v@gmail.com",
    budgetRange: "50L - 1Cr",
    timeline: "3-6 months",
    purpose: "investment",
    locationPreference: "Panvel",
    interestedPropertyId: "1",
    interestedPropertyTitle: "Premium Plot in Panvel Sector 12",
    sourcePage: "Google Ads / Property Detail",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "panvel-airport-land",
    deviceType: "mobile",
    leadScore: 85,
    leadStatus: "interested",
    assignedTo: "Rahul Sharma",
    notes: [
      {
        id: "n1",
        content: "Called twice, very interested. Has budget. Looking for investment for 3-5 year hold.",
        addedBy: "Rahul Sharma",
        addedAt: "2024-05-01",
      },
    ],
    followUps: [
      { id: "f1", scheduledFor: "2024-05-08", type: "call", notes: "Confirm site visit date" },
    ],
    createdAt: "2024-04-30",
    updatedAt: "2024-05-01",
  },
  {
    id: "2",
    name: "Sunita Joshi",
    phone: "+91 97123 88456",
    email: "sunita.joshi@hotmail.com",
    budgetRange: "30L - 50L",
    timeline: "1-3 months",
    purpose: "weekend-home",
    locationPreference: "Khalapur",
    interestedPropertyId: "4",
    interestedPropertyTitle: "Weekend Farmhouse Plot in Khalapur Valley",
    sourcePage: "Homepage / Organic",
    utmSource: "organic",
    utmMedium: "seo",
    deviceType: "desktop",
    leadScore: 72,
    leadStatus: "site_visit_planned",
    assignedTo: "Priya Nair",
    createdAt: "2024-04-28",
    updatedAt: "2024-05-02",
  },
  {
    id: "3",
    name: "Manish Deshmukh",
    phone: "+91 99999 11234",
    email: "m.deshmukh@company.in",
    budgetRange: "1Cr - 2Cr",
    timeline: "Immediately",
    purpose: "investment",
    locationPreference: "Panvel",
    sourcePage: "Referral",
    deviceType: "mobile",
    leadScore: 91,
    leadStatus: "negotiation",
    assignedTo: "Rahul Sharma",
    createdAt: "2024-04-25",
    updatedAt: "2024-05-04",
  },
  {
    id: "4",
    name: "Fatima Sheikh",
    phone: "+971 50 123 4567",
    email: "fatima.sheikh@dubai.ae",
    budgetRange: "1Cr+",
    timeline: "6-12 months",
    purpose: "investment",
    locationPreference: "Panvel",
    interestedPropertyId: "3",
    interestedPropertyTitle: "Residential Plot on Airport Access Road",
    sourcePage: "NRI / Meta Ads",
    utmSource: "facebook",
    utmMedium: "paid",
    utmCampaign: "nri-land-uae",
    deviceType: "mobile",
    leadScore: 78,
    leadStatus: "contacted",
    assignedTo: "Priya Nair",
    createdAt: "2024-05-01",
    updatedAt: "2024-05-02",
  },
  {
    id: "5",
    name: "Deepak Kulkarni",
    phone: "+91 88000 77654",
    email: "deepak.k@gmail.com",
    budgetRange: "Under 30L",
    timeline: "12+ months",
    purpose: "self-use",
    locationPreference: "Khalapur",
    sourcePage: "Blog / Organic",
    deviceType: "mobile",
    leadScore: 42,
    leadStatus: "new",
    createdAt: "2024-05-04",
    updatedAt: "2024-05-04",
  },
  {
    id: "6",
    name: "Kavya Reddy",
    phone: "+91 95678 23456",
    email: "kavya.r@infosys.com",
    budgetRange: "50L - 1Cr",
    timeline: "3-6 months",
    purpose: "investment",
    locationPreference: "Panvel",
    sourcePage: "Google Search",
    utmSource: "google",
    utmMedium: "organic",
    deviceType: "desktop",
    leadScore: 65,
    leadStatus: "contacted",
    assignedTo: "Rahul Sharma",
    createdAt: "2024-05-03",
    updatedAt: "2024-05-05",
  },
];

export const INFRASTRUCTURE_HIGHLIGHTS = [
  {
    id: "airport",
    title: "Navi Mumbai International Airport",
    description:
      "A major greenfield airport on ~1,160 hectares with planned capacity of 60 million passengers, set to transform Panvel's land values.",
    source: "CIDCO",
    sourceUrl: "https://cidco.maharashtra.gov.in/Page?Token=61D7D1F2278",
    icon: "plane",
    impact: "High Impact",
    location: "Panvel",
  },
  {
    id: "atalsetu",
    title: "Atal Setu (Trans Harbour Link)",
    description:
      "At 21.8 km, India's longest sea bridge improves Mumbai–Navi Mumbai connectivity, cutting travel time dramatically and boosting Panvel's accessibility.",
    source: "MMRDA",
    sourceUrl: "https://mmrda.maharashtra.gov.in/en/projects/transport/mumbai-trans-harbour-link/overview",
    icon: "bridge",
    impact: "High Impact",
    location: "Panvel",
  },
  {
    id: "missinglink",
    title: "Mumbai–Pune Expressway Missing Link",
    description:
      "Reduces a critical stretch from 19 km to 13.3 km, cutting travel time by 20–25 minutes. Khalapur becomes dramatically more accessible from Mumbai.",
    source: "MSRDC",
    sourceUrl: "https://msrdc.in/Site/Common/ProjectListDetails.aspx?ID=75&MainId=18",
    icon: "road",
    impact: "High Impact",
    location: "Khalapur",
  },
];

export const FAQS = [
  {
    id: "1",
    question: "What documents should I check before buying a plot in Panvel or Khalapur?",
    answer:
      "Key documents include the 7/12 extract (Satbara Utara), property card, mutation entries, encumbrance certificate, and NA (Non-Agricultural) order if applicable. Our team verifies all documents before listing any property.",
    category: "Legal",
  },
  {
    id: "2",
    question: "How close are your Panvel listings to the new airport?",
    answer:
      "Our Panvel listings range from 5 to 18 km from the Navi Mumbai International Airport site. Each listing clearly shows the distance to major landmarks including the airport.",
    category: "Properties",
  },
  {
    id: "3",
    question: "Can NRI buyers purchase land through Plotzify?",
    answer:
      "Yes. NRI buyers can purchase agricultural and residential land in Maharashtra with certain conditions. Our team assists with OCI card requirements, power of attorney, and remote transaction support. We have successfully completed multiple NRI transactions.",
    category: "NRI",
  },
  {
    id: "4",
    question: "What is the typical appreciation expectation in these areas?",
    answer:
      "Infrastructure corridors in Panvel have seen 15–25% annual appreciation in recent years. Khalapur has shown 10–18% appreciation, with acceleration expected post-expressway missing link completion. Past returns do not guarantee future performance.",
    category: "Investment",
  },
  {
    id: "5",
    question: "Do you organise site visits?",
    answer:
      "Yes. We organise regular weekend site visits from Mumbai and Pune pickup points. You can book a site visit through any property detail page or by calling us directly.",
    category: "Process",
  },
  {
    id: "6",
    question: "What is the process after I express interest in a property?",
    answer:
      "After enquiry, our team contacts you within 2 hours to understand your requirements. We share complete documentation, organise a site visit, and guide you through due diligence, negotiation, and registration.",
    category: "Process",
  },
];

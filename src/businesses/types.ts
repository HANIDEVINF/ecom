export type BusinessIndustryId = 'glasses' | 'clothes' | 'food' | 'electronics' | 'phones';

export interface BusinessTheme {
  primary: string;
  primaryHover: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  bgDark: string;
  surfaceCard: string;
  surfaceMuted: string;
  borderColor: string;
  textHeading: string;
  textBody: string;
  fontHeadingClass: string;
  fontBodyClass: string;
  glowEffect: string;
  gradientBg: string;
  heroGradient: string;
  accentGlow: string;
}

export interface BusinessProduct {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  costPrice: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  highlights: string[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  badge?: string;
}

export interface BusinessOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    sku: string;
  }>;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface BusinessStats {
  grossRevenue: number;
  netProfit: number;
  orderCount: number;
  totalUnitsInStock: number;
  lowStockCount: number;
  activeUsers: number;
  conversionRate: number;
}

export interface BusinessIndustryConfig {
  id: BusinessIndustryId;
  folderName: string; // e.g. "glasses-store-app"
  clientName: string; // e.g. "AURA Optique Japanese Atelier"
  tagline: string;
  industryLabel: string;
  iconName: string;
  desktopAppTitle: string; // e.g. "AURA Optique Business OS v3.4"
  currencySymbol: string;
  theme: BusinessTheme;
  categories: string[];
  sampleProducts: BusinessProduct[];
  sampleOrders: BusinessOrder[];
  initialStats: BusinessStats;
}

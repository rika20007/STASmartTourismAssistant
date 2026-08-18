/**
 * Mocked partner directory for STA.
 * In production this would be served by the OnSpace Cloud partner registry.
 */

export type PartnerCategory =
  | 'restaurant'
  | 'hotel'
  | 'shop'
  | 'attraction'
  | 'transport'
  | 'tour';

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  city: string;
  neighborhood: string;
  distanceKm: number;
  rating: number;
  ratingCount: number;
  priceLevel: 1 | 2 | 3;
  cover: string;
  description: string;
  averageDZD: number;
  tags: string[];
  acceptsWallet: boolean;
  verified: boolean;
}

export const partnerCategories: {
  key: PartnerCategory | 'all';
  labelKey: string;
  icon: string;
}[] = [
  { key: 'all', labelKey: 'cat.all', icon: 'grid-view' },
  { key: 'restaurant', labelKey: 'cat.restaurant', icon: 'restaurant' },
  { key: 'hotel', labelKey: 'cat.hotel', icon: 'hotel' },
  { key: 'attraction', labelKey: 'cat.attraction', icon: 'photo-camera' },
  { key: 'shop', labelKey: 'cat.shop', icon: 'storefront' },
  { key: 'transport', labelKey: 'cat.transport', icon: 'directions-car' },
  { key: 'tour', labelKey: 'cat.tour', icon: 'explore' },
];

export const partners: Partner[] = [
  {
    id: 'p_001',
    name: 'Dar El Bahdja',
    category: 'restaurant',
    city: 'Algiers',
    neighborhood: 'Casbah',
    distanceKm: 0.4,
    rating: 4.8,
    ratingCount: 312,
    priceLevel: 2,
    cover:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    description:
      'Authentic Algerois cuisine served in a restored Ottoman-era house overlooking the old Casbah.',
    averageDZD: 2200,
    tags: ['Couscous', 'Vegetarian', 'Terrace'],
    acceptsWallet: true,
    verified: true,
  },
  {
    id: 'p_002',
    name: 'Hôtel Sofitel Algiers',
    category: 'hotel',
    city: 'Algiers',
    neighborhood: 'Hamma',
    distanceKm: 2.1,
    rating: 4.6,
    ratingCount: 894,
    priceLevel: 3,
    cover:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description:
      'Five-star business and leisure hotel near the Botanical Garden with panoramic bay views.',
    averageDZD: 28000,
    tags: ['Pool', 'Spa', 'Airport shuttle'],
    acceptsWallet: true,
    verified: true,
  },
  {
    id: 'p_003',
    name: 'Timgad Roman Ruins',
    category: 'attraction',
    city: 'Batna',
    neighborhood: 'Timgad',
    distanceKm: 12.4,
    rating: 4.9,
    ratingCount: 1240,
    priceLevel: 1,
    cover:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description:
      'UNESCO World Heritage Roman city founded by Emperor Trajan, with a spectacular triumphal arch.',
    averageDZD: 400,
    tags: ['UNESCO', 'Guided tours', 'Family'],
    acceptsWallet: true,
    verified: true,
  },
  {
    id: 'p_004',
    name: 'Souk El Djemaa',
    category: 'shop',
    city: 'Ghardaia',
    neighborhood: 'M\u2019Zab Valley',
    distanceKm: 3.8,
    rating: 4.5,
    ratingCount: 187,
    priceLevel: 1,
    cover:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    description:
      'Traditional Mozabite market for handwoven carpets, silver jewellery and dates.',
    averageDZD: 1500,
    tags: ['Handicrafts', 'Local', 'Cash & wallet'],
    acceptsWallet: true,
    verified: false,
  },
  {
    id: 'p_005',
    name: 'Sahara Discovery Tours',
    category: 'tour',
    city: 'Tamanrasset',
    neighborhood: 'Hoggar',
    distanceKm: 5.0,
    rating: 4.9,
    ratingCount: 402,
    priceLevel: 3,
    cover:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80',
    description:
      'Multi-day 4x4 desert expeditions across the Hoggar Mountains with certified local guides.',
    averageDZD: 55000,
    tags: ['4x4', 'Camping', 'English guide'],
    acceptsWallet: true,
    verified: true,
  },
  {
    id: 'p_006',
    name: 'Café des Artistes',
    category: 'restaurant',
    city: 'Oran',
    neighborhood: 'Sidi El Houari',
    distanceKm: 1.2,
    rating: 4.4,
    ratingCount: 226,
    priceLevel: 1,
    cover:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
    description:
      'Bohemian coffee house serving mint tea, Oranese pastries and light Mediterranean plates.',
    averageDZD: 900,
    tags: ['Coffee', 'Wifi', 'Live music'],
    acceptsWallet: true,
    verified: true,
  },
  {
    id: 'p_007',
    name: 'Riad Constantine',
    category: 'hotel',
    city: 'Constantine',
    neighborhood: 'Old City',
    distanceKm: 0.9,
    rating: 4.7,
    ratingCount: 154,
    priceLevel: 2,
    cover:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description:
      'Boutique riad in a restored colonial building overlooking the Sidi M\u2019Cid bridge.',
    averageDZD: 12000,
    tags: ['Boutique', 'Breakfast', 'View'],
    acceptsWallet: true,
    verified: true,
  },
  {
    id: 'p_008',
    name: 'Algiers Airport Shuttle',
    category: 'transport',
    city: 'Algiers',
    neighborhood: 'Houari Boumediene',
    distanceKm: 8.5,
    rating: 4.3,
    ratingCount: 512,
    priceLevel: 1,
    cover:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    description:
      'Licensed private shuttle service between Houari Boumediene Airport and city centre hotels.',
    averageDZD: 2500,
    tags: ['24/7', 'English driver', 'Fixed price'],
    acceptsWallet: true,
    verified: true,
  },
];

export function getPartner(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}

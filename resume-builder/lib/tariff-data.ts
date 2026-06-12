export interface HtsChapter {
  chapter: number;
  description: string;
  mfnRateMin: number;
  mfnRateMax: number;
  mfnRateTypical: number;
  notes?: string;
}

export interface CountryTariffProgram {
  name: string;
  additionalRate: number;
  description: string;
  effectiveDate: string;
  source: string;
  appliesTo?: string;
  exceptions?: string;
}

export interface CountryProfile {
  code: string;
  name: string;
  programs: CountryTariffProgram[];
  preferentialAgreement?: string;
}

// Approximate MFN (Most Favored Nation) rates by HTS chapter
// Source: USITC Harmonized Tariff Schedule — typical/representative rates
export const HTS_CHAPTERS: HtsChapter[] = [
  { chapter: 1,  description: 'Live Animals',                         mfnRateMin: 0,    mfnRateMax: 2.8,  mfnRateTypical: 1.0 },
  { chapter: 2,  description: 'Meat & Edible Offal',                  mfnRateMin: 0,    mfnRateMax: 26.4, mfnRateTypical: 4.0 },
  { chapter: 3,  description: 'Fish & Seafood',                       mfnRateMin: 0,    mfnRateMax: 15,   mfnRateTypical: 1.1 },
  { chapter: 4,  description: 'Dairy, Eggs, Honey',                   mfnRateMin: 0,    mfnRateMax: 16.8, mfnRateTypical: 5.0 },
  { chapter: 5,  description: 'Animal Products (misc)',                mfnRateMin: 0,    mfnRateMax: 3.5,  mfnRateTypical: 0.5 },
  { chapter: 6,  description: 'Live Plants & Floriculture',            mfnRateMin: 0,    mfnRateMax: 6.8,  mfnRateTypical: 2.0 },
  { chapter: 7,  description: 'Vegetables',                           mfnRateMin: 0,    mfnRateMax: 21.3, mfnRateTypical: 6.9 },
  { chapter: 8,  description: 'Fruits & Nuts',                        mfnRateMin: 0,    mfnRateMax: 17.1, mfnRateTypical: 4.5 },
  { chapter: 9,  description: 'Coffee, Tea, Spices',                  mfnRateMin: 0,    mfnRateMax: 10,   mfnRateTypical: 3.0 },
  { chapter: 10, description: 'Cereals & Grains',                     mfnRateMin: 0,    mfnRateMax: 0.7,  mfnRateTypical: 0.3 },
  { chapter: 11, description: 'Milling Products, Starch',             mfnRateMin: 0,    mfnRateMax: 0.7,  mfnRateTypical: 0.4 },
  { chapter: 12, description: 'Oil Seeds, Misc Grains',               mfnRateMin: 0,    mfnRateMax: 10,   mfnRateTypical: 0.5 },
  { chapter: 13, description: 'Lac, Gums, Resins',                    mfnRateMin: 0,    mfnRateMax: 1.5,  mfnRateTypical: 0.5 },
  { chapter: 14, description: 'Vegetable Plaiting Materials',         mfnRateMin: 0,    mfnRateMax: 3.8,  mfnRateTypical: 1.5 },
  { chapter: 15, description: 'Animal/Vegetable Fats & Oils',         mfnRateMin: 0,    mfnRateMax: 7.9,  mfnRateTypical: 3.5 },
  { chapter: 16, description: 'Prepared Meat, Fish, Seafood',         mfnRateMin: 2.1,  mfnRateMax: 35,   mfnRateTypical: 8.5 },
  { chapter: 17, description: 'Sugars & Sugar Confectionery',         mfnRateMin: 0.2,  mfnRateMax: 37.3, mfnRateTypical: 15.0 },
  { chapter: 18, description: 'Cocoa & Cocoa Preparations',           mfnRateMin: 0,    mfnRateMax: 12,   mfnRateTypical: 3.5 },
  { chapter: 19, description: 'Prepared Cereals, Baked Goods',        mfnRateMin: 0,    mfnRateMax: 19.2, mfnRateTypical: 6.4 },
  { chapter: 20, description: 'Prepared Vegetables, Fruits',          mfnRateMin: 0,    mfnRateMax: 35,   mfnRateTypical: 11.2 },
  { chapter: 21, description: 'Misc Food Preparations',               mfnRateMin: 0,    mfnRateMax: 23.9, mfnRateTypical: 6.4 },
  { chapter: 22, description: 'Beverages, Spirits, Vinegar',          mfnRateMin: 0,    mfnRateMax: 20,   mfnRateTypical: 4.0 },
  { chapter: 23, description: 'Residues, Animal Feed',                mfnRateMin: 0,    mfnRateMax: 1.4,  mfnRateTypical: 0.4 },
  { chapter: 24, description: 'Tobacco & Manufactures',               mfnRateMin: 0.4,  mfnRateMax: 350,  mfnRateTypical: 30.0, notes: 'Rate can vary significantly by product type' },
  { chapter: 25, description: 'Salt, Sulfur, Earth, Stone',           mfnRateMin: 0,    mfnRateMax: 5,    mfnRateTypical: 1.5 },
  { chapter: 26, description: 'Ores, Slag, Ash',                      mfnRateMin: 0,    mfnRateMax: 1.7,  mfnRateTypical: 0.3 },
  { chapter: 27, description: 'Mineral Fuels, Oils',                  mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 2.0 },
  { chapter: 28, description: 'Inorganic Chemicals',                  mfnRateMin: 0,    mfnRateMax: 5.5,  mfnRateTypical: 2.5 },
  { chapter: 29, description: 'Organic Chemicals',                    mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 2.5 },
  { chapter: 30, description: 'Pharmaceutical Products',              mfnRateMin: 0,    mfnRateMax: 4,    mfnRateTypical: 0.5 },
  { chapter: 31, description: 'Fertilizers',                          mfnRateMin: 0,    mfnRateMax: 7.2,  mfnRateTypical: 1.7 },
  { chapter: 32, description: 'Tanning, Dyes, Paints',                mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 3.1 },
  { chapter: 33, description: 'Essential Oils, Cosmetics',            mfnRateMin: 0,    mfnRateMax: 8.1,  mfnRateTypical: 2.8 },
  { chapter: 34, description: 'Soap, Wax, Polish',                    mfnRateMin: 0,    mfnRateMax: 6.8,  mfnRateTypical: 3.2 },
  { chapter: 35, description: 'Albuminoids, Starches, Glues',         mfnRateMin: 0,    mfnRateMax: 6.2,  mfnRateTypical: 2.9 },
  { chapter: 36, description: 'Explosives, Matches, Pyrotechnics',    mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 3.7 },
  { chapter: 37, description: 'Photographic Goods',                   mfnRateMin: 0,    mfnRateMax: 7.3,  mfnRateTypical: 2.1 },
  { chapter: 38, description: 'Misc Chemical Products',               mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 3.3 },
  { chapter: 39, description: 'Plastics & Articles',                  mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 3.7 },
  { chapter: 40, description: 'Rubber & Articles',                    mfnRateMin: 0,    mfnRateMax: 10,   mfnRateTypical: 2.5 },
  { chapter: 41, description: 'Raw Hides, Skins, Leather',            mfnRateMin: 0,    mfnRateMax: 5,    mfnRateTypical: 2.1 },
  { chapter: 42, description: 'Leather Goods, Handbags',              mfnRateMin: 0,    mfnRateMax: 9,    mfnRateTypical: 5.3 },
  { chapter: 43, description: 'Furskins & Artificial Fur',            mfnRateMin: 0.7,  mfnRateMax: 5.5,  mfnRateTypical: 4.0 },
  { chapter: 44, description: 'Wood & Articles of Wood',              mfnRateMin: 0,    mfnRateMax: 10,   mfnRateTypical: 2.0 },
  { chapter: 45, description: 'Cork & Cork Articles',                 mfnRateMin: 0,    mfnRateMax: 5.4,  mfnRateTypical: 2.3 },
  { chapter: 46, description: 'Basketware, Wickerwork',               mfnRateMin: 0,    mfnRateMax: 7,    mfnRateTypical: 4.0 },
  { chapter: 47, description: 'Pulp, Waste Paper',                    mfnRateMin: 0,    mfnRateMax: 0,    mfnRateTypical: 0 },
  { chapter: 48, description: 'Paper & Paperboard',                   mfnRateMin: 0,    mfnRateMax: 4,    mfnRateTypical: 1.0 },
  { chapter: 49, description: 'Printed Books, Newspapers',            mfnRateMin: 0,    mfnRateMax: 0,    mfnRateTypical: 0 },
  { chapter: 50, description: 'Silk',                                 mfnRateMin: 0,    mfnRateMax: 14.9, mfnRateTypical: 7.0 },
  { chapter: 51, description: 'Wool, Fine/Coarse Animal Hair',        mfnRateMin: 0,    mfnRateMax: 17,   mfnRateTypical: 7.0 },
  { chapter: 52, description: 'Cotton',                               mfnRateMin: 0,    mfnRateMax: 16.5, mfnRateTypical: 8.0 },
  { chapter: 53, description: 'Vegetable Textile Fibers',             mfnRateMin: 0,    mfnRateMax: 4.8,  mfnRateTypical: 2.0 },
  { chapter: 54, description: 'Man-made Filaments',                   mfnRateMin: 0,    mfnRateMax: 16,   mfnRateTypical: 9.0 },
  { chapter: 55, description: 'Man-made Staple Fibers',               mfnRateMin: 0,    mfnRateMax: 15,   mfnRateTypical: 9.0 },
  { chapter: 56, description: 'Wadding, Felt, Nonwovens',             mfnRateMin: 0,    mfnRateMax: 8.8,  mfnRateTypical: 6.0 },
  { chapter: 57, description: 'Carpets & Floor Coverings',            mfnRateMin: 0,    mfnRateMax: 9.8,  mfnRateTypical: 6.2 },
  { chapter: 58, description: 'Special Woven Fabrics',                mfnRateMin: 0,    mfnRateMax: 21,   mfnRateTypical: 10.0 },
  { chapter: 59, description: 'Impregnated Textile Fabrics',          mfnRateMin: 0,    mfnRateMax: 12.1, mfnRateTypical: 6.8 },
  { chapter: 60, description: 'Knitted or Crocheted Fabrics',         mfnRateMin: 0,    mfnRateMax: 16,   mfnRateTypical: 10.0 },
  { chapter: 61, description: 'Knitted Apparel',                      mfnRateMin: 0,    mfnRateMax: 32,   mfnRateTypical: 16.0 },
  { chapter: 62, description: 'Woven Apparel (not knitted)',           mfnRateMin: 0,    mfnRateMax: 28.6, mfnRateTypical: 14.0 },
  { chapter: 63, description: 'Textile Made-up Articles',             mfnRateMin: 0,    mfnRateMax: 14,   mfnRateTypical: 7.0 },
  { chapter: 64, description: 'Footwear',                             mfnRateMin: 2.5,  mfnRateMax: 67.5, mfnRateTypical: 20.0 },
  { chapter: 65, description: 'Headgear & Parts',                     mfnRateMin: 0,    mfnRateMax: 20,   mfnRateTypical: 8.4 },
  { chapter: 66, description: 'Umbrellas, Walking Sticks',            mfnRateMin: 4.2,  mfnRateMax: 8.2,  mfnRateTypical: 6.5 },
  { chapter: 67, description: 'Feathers, Artificial Flowers',         mfnRateMin: 0,    mfnRateMax: 4.7,  mfnRateTypical: 2.5 },
  { chapter: 68, description: 'Stone, Plaster, Cement Articles',      mfnRateMin: 0,    mfnRateMax: 15,   mfnRateTypical: 3.7 },
  { chapter: 69, description: 'Ceramic Products',                     mfnRateMin: 0,    mfnRateMax: 28,   mfnRateTypical: 8.0 },
  { chapter: 70, description: 'Glass & Glassware',                    mfnRateMin: 0,    mfnRateMax: 38,   mfnRateTypical: 5.0 },
  { chapter: 71, description: 'Precious Metals, Jewelry',             mfnRateMin: 0,    mfnRateMax: 7,    mfnRateTypical: 3.5 },
  { chapter: 72, description: 'Iron & Steel',                         mfnRateMin: 0,    mfnRateMax: 9,    mfnRateTypical: 1.5, notes: 'Section 232 steel tariffs (25%) may also apply' },
  { chapter: 73, description: 'Articles of Iron & Steel',             mfnRateMin: 0,    mfnRateMax: 9,    mfnRateTypical: 3.5 },
  { chapter: 74, description: 'Copper & Articles',                    mfnRateMin: 0,    mfnRateMax: 3,    mfnRateTypical: 1.5 },
  { chapter: 75, description: 'Nickel & Articles',                    mfnRateMin: 0,    mfnRateMax: 3,    mfnRateTypical: 0.5 },
  { chapter: 76, description: 'Aluminum & Articles',                  mfnRateMin: 0,    mfnRateMax: 9,    mfnRateTypical: 1.5, notes: 'Section 232 aluminum tariffs (10%) may also apply' },
  { chapter: 78, description: 'Lead & Articles',                      mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 2.0 },
  { chapter: 79, description: 'Zinc & Articles',                      mfnRateMin: 0,    mfnRateMax: 5.7,  mfnRateTypical: 1.7 },
  { chapter: 80, description: 'Tin & Articles',                       mfnRateMin: 0,    mfnRateMax: 3,    mfnRateTypical: 0.5 },
  { chapter: 81, description: 'Other Base Metals',                    mfnRateMin: 0,    mfnRateMax: 5.5,  mfnRateTypical: 2.0 },
  { chapter: 82, description: 'Tools, Implements, Cutlery',           mfnRateMin: 0,    mfnRateMax: 8,    mfnRateTypical: 3.0 },
  { chapter: 83, description: 'Misc Base Metal Articles',             mfnRateMin: 0,    mfnRateMax: 8.5,  mfnRateTypical: 3.5 },
  { chapter: 84, description: 'Machinery & Mechanical Appliances',    mfnRateMin: 0,    mfnRateMax: 4.9,  mfnRateTypical: 1.5 },
  { chapter: 85, description: 'Electrical Machinery & Equipment',     mfnRateMin: 0,    mfnRateMax: 4.9,  mfnRateTypical: 1.0 },
  { chapter: 86, description: 'Railway/Tramway Equipment',            mfnRateMin: 0,    mfnRateMax: 14,   mfnRateTypical: 1.4 },
  { chapter: 87, description: 'Vehicles (excl. Railway)',             mfnRateMin: 0,    mfnRateMax: 25,   mfnRateTypical: 2.5 },
  { chapter: 88, description: 'Aircraft & Spacecraft',                mfnRateMin: 0,    mfnRateMax: 7.5,  mfnRateTypical: 0.5 },
  { chapter: 89, description: 'Ships, Boats',                         mfnRateMin: 0,    mfnRateMax: 1.5,  mfnRateTypical: 0.5 },
  { chapter: 90, description: 'Optical, Medical Instruments',         mfnRateMin: 0,    mfnRateMax: 4.4,  mfnRateTypical: 0.9 },
  { chapter: 91, description: 'Clocks & Watches',                     mfnRateMin: 0,    mfnRateMax: 51,   mfnRateTypical: 4.5 },
  { chapter: 92, description: 'Musical Instruments',                  mfnRateMin: 0,    mfnRateMax: 4.9,  mfnRateTypical: 2.7 },
  { chapter: 93, description: 'Arms & Ammunition',                    mfnRateMin: 0,    mfnRateMax: 6.5,  mfnRateTypical: 2.9 },
  { chapter: 94, description: 'Furniture, Bedding, Lamps',            mfnRateMin: 0,    mfnRateMax: 8.5,  mfnRateTypical: 4.0 },
  { chapter: 95, description: 'Toys, Games, Sports Equipment',        mfnRateMin: 0,    mfnRateMax: 14,   mfnRateTypical: 2.8 },
  { chapter: 96, description: 'Misc Manufactured Articles',           mfnRateMin: 0,    mfnRateMax: 11,   mfnRateTypical: 4.5 },
  { chapter: 97, description: 'Works of Art, Antiques',               mfnRateMin: 0,    mfnRateMax: 4.9,  mfnRateTypical: 0.0 },
];

// Country profiles with applicable tariff programs for US imports
export const COUNTRY_PROFILES: CountryProfile[] = [
  {
    code: 'CN',
    name: 'China',
    programs: [
      {
        name: 'Section 301 Tariffs (Lists 1–4)',
        additionalRate: 25,
        description: 'USTR Section 301 tariffs imposed from 2018. Most goods covered at 25%; List 4A goods at 7.5%.',
        effectiveDate: '2018-07-06',
        source: 'USTR Section 301',
        appliesTo: 'Most goods from China',
        exceptions: 'Some medical, agricultural products may qualify for exclusions',
      },
      {
        name: '2025 Executive Order Tariffs',
        additionalRate: 145,
        description: 'Additional tariffs imposed in 2025 raising effective rates on most Chinese goods significantly. Verify current rate with CBP.',
        effectiveDate: '2025-04-09',
        source: 'Executive Order',
        appliesTo: 'Most goods from China',
        exceptions: 'Certain electronics, pharmaceutical API, some medical devices may have reduced or paused rates — verify with CBP/USTR',
      },
    ],
  },
  {
    code: 'MX',
    name: 'Mexico',
    preferentialAgreement: 'USMCA',
    programs: [
      {
        name: 'USMCA Preference',
        additionalRate: -999,
        description: 'Goods qualifying under USMCA rules of origin may enter duty-free. Must meet regional value content and tariff shift requirements.',
        effectiveDate: '2020-07-01',
        source: 'USMCA Chapter 4',
        appliesTo: 'Goods meeting USMCA rules of origin',
        exceptions: 'Must obtain certificate of origin; some agricultural quotas apply',
      },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    preferentialAgreement: 'USMCA',
    programs: [
      {
        name: 'USMCA Preference',
        additionalRate: -999,
        description: 'Goods qualifying under USMCA rules of origin may enter duty-free.',
        effectiveDate: '2020-07-01',
        source: 'USMCA Chapter 4',
        appliesTo: 'Goods meeting USMCA rules of origin',
        exceptions: 'Must obtain certificate of origin; dairy, poultry, eggs have TRQs',
      },
    ],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    programs: [
      {
        name: 'No Preferential Agreement',
        additionalRate: 0,
        description: 'Vietnam does not have a free trade agreement with the US. MFN rates apply.',
        effectiveDate: '2001-12-10',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'IN',
    name: 'India',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'India lost GSP (Generalized System of Preferences) benefits in 2019. Standard MFN rates apply.',
        effectiveDate: '2019-06-05',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU countries are MFN trading partners. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Japan is an MFN trading partner. No comprehensive FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'KR',
    name: 'South Korea',
    preferentialAgreement: 'KORUS FTA',
    programs: [
      {
        name: 'KORUS FTA Preference',
        additionalRate: -999,
        description: 'US-Korea Free Trade Agreement. Most goods enter duty-free or at reduced rates.',
        effectiveDate: '2012-03-15',
        source: 'KORUS FTA',
        appliesTo: 'Goods meeting KORUS rules of origin',
        exceptions: 'Must meet rules of origin; some staged reductions apply',
      },
    ],
  },
  {
    code: 'TW',
    name: 'Taiwan',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Taiwan is an MFN trading partner. No comprehensive FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'OTHER',
    name: 'Other Country',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Standard Most Favored Nation rates apply. Check USITC for country-specific programs.',
        effectiveDate: 'Ongoing',
        source: 'USITC',
        appliesTo: 'All goods',
      },
    ],
  },
];

export function getChapterFromHts(htsCode: string): HtsChapter | null {
  const cleaned = htsCode.replace(/[.\s-]/g, '');
  if (cleaned.length < 2) return null;
  const chapterNum = parseInt(cleaned.substring(0, 2), 10);
  return HTS_CHAPTERS.find(c => c.chapter === chapterNum) ?? null;
}

export function getCountryProfile(countryCode: string): CountryProfile {
  return COUNTRY_PROFILES.find(c => c.code === countryCode) ?? COUNTRY_PROFILES[COUNTRY_PROFILES.length - 1];
}

export function formatHtsCode(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  if (digits.length <= 8) return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}.${digits.slice(8, 10)}`;
}

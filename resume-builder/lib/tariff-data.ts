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
  // ── East Asia ──────────────────────────────────────────────────────────────
  {
    code: 'CN',
    name: 'China',
    programs: [
      {
        name: 'Section 301 Tariffs (Lists 1–4)',
        additionalRate: 25,
        description: 'USTR Section 301 tariffs imposed from 2018. Most goods at 25%; List 4A goods at 7.5%.',
        effectiveDate: '2018-07-06',
        source: 'USTR Section 301',
        appliesTo: 'Most goods from China',
        exceptions: 'Some medical and agricultural products may qualify for exclusions',
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
    code: 'HK',
    name: 'Hong Kong',
    programs: [
      {
        name: 'Treated as China (Post-2020)',
        additionalRate: 170,
        description: 'In 2020 the US revoked Hong Kong\'s separate customs status. Goods of Hong Kong origin are generally treated the same as mainland Chinese goods and subject to Section 301 + 2025 tariffs.',
        effectiveDate: '2020-07-14',
        source: 'Executive Order 13936',
        appliesTo: 'Goods of Hong Kong origin',
        exceptions: 'Goods of third-country origin transshipped through Hong Kong are not automatically subject to China tariffs — origin rules apply',
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
  // ── Southeast Asia ─────────────────────────────────────────────────────────
  {
    code: 'VN',
    name: 'Vietnam',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Vietnam is an MFN trading partner with no US FTA. Standard MFN rates apply.',
        effectiveDate: '2001-12-10',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
        exceptions: 'USTR has investigated Vietnam for currency manipulation and trade diversion; verify no Section 301 action applies to your product',
      },
    ],
  },
  {
    code: 'TH',
    name: 'Thailand',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Thailand is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    programs: [
      {
        name: 'GSP Eligible (reinstated 2023)',
        additionalRate: 0,
        description: 'Indonesia is a GSP (Generalized System of Preferences) beneficiary. Many goods eligible for duty-free entry under GSP. Verify the specific HTS code is on the eligible product list.',
        effectiveDate: '2023-04-26',
        source: 'US GSP Program',
        appliesTo: 'GSP-eligible goods',
        exceptions: 'Must meet 35% value-added requirement; competitive need limits apply; some products excluded',
      },
    ],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Malaysia is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'PH',
    name: 'Philippines',
    programs: [
      {
        name: 'GSP Eligible (reinstated 2023)',
        additionalRate: 0,
        description: 'Philippines is a GSP beneficiary. Eligible goods may enter duty-free under GSP.',
        effectiveDate: '2023-04-26',
        source: 'US GSP Program',
        appliesTo: 'GSP-eligible goods',
        exceptions: 'Must meet value-added and direct shipment requirements; verify eligibility by HTS code',
      },
    ],
  },
  {
    code: 'KH',
    name: 'Cambodia',
    programs: [
      {
        name: 'GSP Eligible (reinstated 2023)',
        additionalRate: 0,
        description: 'Cambodia is a GSP beneficiary. Eligible goods may enter duty-free. Major exporter of apparel and footwear.',
        effectiveDate: '2023-04-26',
        source: 'US GSP Program',
        appliesTo: 'GSP-eligible goods',
        exceptions: 'Apparel (Ch. 61–62) is typically NOT eligible for GSP; verify by HTS code',
      },
    ],
  },
  {
    code: 'MM',
    name: 'Myanmar (Burma)',
    programs: [
      {
        name: 'MFN — Sanctions Risk',
        additionalRate: 0,
        description: 'Myanmar is an MFN trading partner. However, US sanctions (BURMA Act, OFAC) restrict trade with certain entities. Verify compliance before importing.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations / OFAC',
        appliesTo: 'All goods',
        exceptions: 'OFAC sanctions apply to specified Burmese entities; forced labor risks under UFLPA may apply',
      },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    preferentialAgreement: 'US-Singapore FTA',
    programs: [
      {
        name: 'US-Singapore FTA Preference',
        additionalRate: -999,
        description: 'US-Singapore Free Trade Agreement provides duty-free or reduced rates on most goods.',
        effectiveDate: '2004-01-01',
        source: 'US-Singapore FTA',
        appliesTo: 'Goods meeting rules of origin',
        exceptions: 'Must meet rules of origin; certificate of origin required',
      },
    ],
  },
  // ── South Asia ─────────────────────────────────────────────────────────────
  {
    code: 'IN',
    name: 'India',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'India lost GSP benefits in June 2019. Standard MFN rates now apply to all Indian goods.',
        effectiveDate: '2019-06-05',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    programs: [
      {
        name: 'MFN Rates Apply (No GSP for Apparel)',
        additionalRate: 0,
        description: 'Bangladesh is an MFN trading partner. GSP was suspended in 2013 due to labor rights concerns and Bangladesh is not GSP-reinstated for most goods. Major apparel exporter — MFN rates (up to 32%) apply to garments.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
        exceptions: 'Bangladesh is not currently a GSP beneficiary for most products; verify current status',
      },
    ],
  },
  {
    code: 'PK',
    name: 'Pakistan',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Pakistan is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    programs: [
      {
        name: 'GSP Eligible (reinstated 2023)',
        additionalRate: 0,
        description: 'Sri Lanka is a GSP beneficiary (reinstated 2023). Eligible goods may enter duty-free.',
        effectiveDate: '2023-04-26',
        source: 'US GSP Program',
        appliesTo: 'GSP-eligible goods',
        exceptions: 'Apparel generally not GSP eligible; verify by HTS code',
      },
    ],
  },
  // ── North America ──────────────────────────────────────────────────────────
  {
    code: 'MX',
    name: 'Mexico',
    preferentialAgreement: 'USMCA',
    programs: [
      {
        name: 'USMCA Preference',
        additionalRate: -999,
        description: 'Goods qualifying under USMCA rules of origin may enter duty-free.',
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
  // ── Central America & Caribbean (CAFTA-DR) ─────────────────────────────────
  {
    code: 'CR',
    name: 'Costa Rica',
    preferentialAgreement: 'CAFTA-DR',
    programs: [
      {
        name: 'CAFTA-DR Preference',
        additionalRate: -999,
        description: 'Costa Rica is a CAFTA-DR party. Most goods enter duty-free for qualifying products.',
        effectiveDate: '2009-01-01',
        source: 'CAFTA-DR',
        appliesTo: 'Goods meeting CAFTA-DR rules of origin',
        exceptions: 'Must meet rules of origin and obtain certification',
      },
    ],
  },
  {
    code: 'SV',
    name: 'El Salvador',
    preferentialAgreement: 'CAFTA-DR',
    programs: [
      {
        name: 'CAFTA-DR Preference',
        additionalRate: -999,
        description: 'El Salvador is a CAFTA-DR party. Most goods enter duty-free for qualifying products.',
        effectiveDate: '2006-03-01',
        source: 'CAFTA-DR',
        appliesTo: 'Goods meeting CAFTA-DR rules of origin',
        exceptions: 'Must meet rules of origin and obtain certification',
      },
    ],
  },
  {
    code: 'GT',
    name: 'Guatemala',
    preferentialAgreement: 'CAFTA-DR',
    programs: [
      {
        name: 'CAFTA-DR Preference',
        additionalRate: -999,
        description: 'Guatemala is a CAFTA-DR party. Most goods enter duty-free for qualifying products.',
        effectiveDate: '2006-07-01',
        source: 'CAFTA-DR',
        appliesTo: 'Goods meeting CAFTA-DR rules of origin',
        exceptions: 'Must meet rules of origin and obtain certification',
      },
    ],
  },
  {
    code: 'HN',
    name: 'Honduras',
    preferentialAgreement: 'CAFTA-DR',
    programs: [
      {
        name: 'CAFTA-DR Preference',
        additionalRate: -999,
        description: 'Honduras is a CAFTA-DR party. Most goods enter duty-free for qualifying products.',
        effectiveDate: '2006-04-01',
        source: 'CAFTA-DR',
        appliesTo: 'Goods meeting CAFTA-DR rules of origin',
        exceptions: 'Must meet rules of origin and obtain certification',
      },
    ],
  },
  {
    code: 'NI',
    name: 'Nicaragua',
    preferentialAgreement: 'CAFTA-DR',
    programs: [
      {
        name: 'CAFTA-DR Preference',
        additionalRate: -999,
        description: 'Nicaragua is a CAFTA-DR party. Most goods enter duty-free for qualifying products.',
        effectiveDate: '2006-04-01',
        source: 'CAFTA-DR',
        appliesTo: 'Goods meeting CAFTA-DR rules of origin',
        exceptions: 'Must meet rules of origin and obtain certification',
      },
    ],
  },
  {
    code: 'DO',
    name: 'Dominican Republic',
    preferentialAgreement: 'CAFTA-DR',
    programs: [
      {
        name: 'CAFTA-DR Preference',
        additionalRate: -999,
        description: 'Dominican Republic is a CAFTA-DR party. Most goods enter duty-free for qualifying products.',
        effectiveDate: '2007-03-01',
        source: 'CAFTA-DR',
        appliesTo: 'Goods meeting CAFTA-DR rules of origin',
        exceptions: 'Must meet rules of origin and obtain certification',
      },
    ],
  },
  // ── South America ──────────────────────────────────────────────────────────
  {
    code: 'CL',
    name: 'Chile',
    preferentialAgreement: 'US-Chile FTA',
    programs: [
      {
        name: 'US-Chile FTA Preference',
        additionalRate: -999,
        description: 'US-Chile Free Trade Agreement. Most goods enter duty-free.',
        effectiveDate: '2004-01-01',
        source: 'US-Chile FTA',
        appliesTo: 'Goods meeting rules of origin',
        exceptions: 'Must meet rules of origin; some agricultural tariff-rate quotas',
      },
    ],
  },
  {
    code: 'CO',
    name: 'Colombia',
    preferentialAgreement: 'US-Colombia TPA',
    programs: [
      {
        name: 'US-Colombia Trade Promotion Agreement',
        additionalRate: -999,
        description: 'US-Colombia TPA. Most goods enter duty-free or at reduced rates.',
        effectiveDate: '2012-05-15',
        source: 'US-Colombia TPA',
        appliesTo: 'Goods meeting rules of origin',
        exceptions: 'Must meet rules of origin; some agricultural products have staged cuts',
      },
    ],
  },
  {
    code: 'PE',
    name: 'Peru',
    preferentialAgreement: 'US-Peru TPA',
    programs: [
      {
        name: 'US-Peru Trade Promotion Agreement',
        additionalRate: -999,
        description: 'US-Peru TPA. Most goods enter duty-free.',
        effectiveDate: '2009-02-01',
        source: 'US-Peru TPA',
        appliesTo: 'Goods meeting rules of origin',
        exceptions: 'Must meet rules of origin',
      },
    ],
  },
  {
    code: 'PA',
    name: 'Panama',
    preferentialAgreement: 'US-Panama TPA',
    programs: [
      {
        name: 'US-Panama Trade Promotion Agreement',
        additionalRate: -999,
        description: 'US-Panama TPA. Most goods enter duty-free.',
        effectiveDate: '2012-10-31',
        source: 'US-Panama TPA',
        appliesTo: 'Goods meeting rules of origin',
        exceptions: 'Must meet rules of origin',
      },
    ],
  },
  {
    code: 'BR',
    name: 'Brazil',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Brazil is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'AR',
    name: 'Argentina',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Argentina is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  // ── Europe ─────────────────────────────────────────────────────────────────
  {
    code: 'DE',
    name: 'Germany (EU)',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU member states are MFN trading partners. No US-EU FTA. Standard MFN rates apply to all EU-origin goods.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'FR',
    name: 'France (EU)',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU member state — MFN rates apply. No US-EU FTA.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'IT',
    name: 'Italy (EU)',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU member state — MFN rates apply. No US-EU FTA.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'ES',
    name: 'Spain (EU)',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU member state — MFN rates apply. No US-EU FTA.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'NL',
    name: 'Netherlands (EU)',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU member state — MFN rates apply. No US-EU FTA.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'PL',
    name: 'Poland (EU)',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'EU member state — MFN rates apply. No US-EU FTA.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    programs: [
      {
        name: 'MFN Rates Apply (Post-Brexit)',
        additionalRate: 0,
        description: 'Since Brexit (Jan 2021) the UK is an independent customs territory. No US-UK FTA has been concluded. Standard MFN rates apply.',
        effectiveDate: '2021-01-01',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'CH',
    name: 'Switzerland',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Switzerland is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'TR',
    name: 'Turkey',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Turkey is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'RU',
    name: 'Russia',
    programs: [
      {
        name: 'Column 2 (Non-MFN) Rates',
        additionalRate: 35,
        description: 'The US suspended Normal Trade Relations (MFN status) for Russia in April 2022 following the invasion of Ukraine. Column 2 (Smoot-Hawley) rates now apply — these are extremely high on many goods (often 45%+ vs the typical MFN rate).',
        effectiveDate: '2022-04-09',
        source: 'Public Law 117-110',
        appliesTo: 'All Russian-origin goods',
        exceptions: 'Additional OFAC sanctions restrict trade with many Russian entities. Verify legality before importing.',
      },
    ],
  },
  {
    code: 'UA',
    name: 'Ukraine',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Ukraine is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  // ── Middle East ────────────────────────────────────────────────────────────
  {
    code: 'IL',
    name: 'Israel',
    preferentialAgreement: 'US-Israel FTA',
    programs: [
      {
        name: 'US-Israel FTA Preference',
        additionalRate: -999,
        description: 'The oldest US FTA (1985). Most goods enter duty-free.',
        effectiveDate: '1985-09-01',
        source: 'US-Israel FTA',
        appliesTo: 'Most goods meeting rules of origin',
        exceptions: 'Agricultural products may have exceptions; rules of origin apply',
      },
    ],
  },
  {
    code: 'JO',
    name: 'Jordan',
    preferentialAgreement: 'US-Jordan FTA',
    programs: [
      {
        name: 'US-Jordan FTA Preference',
        additionalRate: -999,
        description: 'US-Jordan Free Trade Agreement. Most goods enter duty-free.',
        effectiveDate: '2001-12-17',
        source: 'US-Jordan FTA',
        appliesTo: 'Most goods meeting rules of origin',
        exceptions: 'Some agricultural products phased over time',
      },
    ],
  },
  {
    code: 'BH',
    name: 'Bahrain',
    preferentialAgreement: 'US-Bahrain FTA',
    programs: [
      {
        name: 'US-Bahrain FTA Preference',
        additionalRate: -999,
        description: 'US-Bahrain Free Trade Agreement. Most goods enter duty-free.',
        effectiveDate: '2006-01-11',
        source: 'US-Bahrain FTA',
        appliesTo: 'Most goods meeting rules of origin',
        exceptions: 'Rules of origin and certificate required',
      },
    ],
  },
  {
    code: 'OM',
    name: 'Oman',
    preferentialAgreement: 'US-Oman FTA',
    programs: [
      {
        name: 'US-Oman FTA Preference',
        additionalRate: -999,
        description: 'US-Oman Free Trade Agreement. Most goods enter duty-free.',
        effectiveDate: '2009-01-01',
        source: 'US-Oman FTA',
        appliesTo: 'Most goods meeting rules of origin',
        exceptions: 'Rules of origin and certificate required',
      },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'UAE is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Saudi Arabia is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  // ── Africa ─────────────────────────────────────────────────────────────────
  {
    code: 'MA',
    name: 'Morocco',
    preferentialAgreement: 'US-Morocco FTA',
    programs: [
      {
        name: 'US-Morocco FTA Preference',
        additionalRate: -999,
        description: 'US-Morocco Free Trade Agreement. Most goods enter duty-free or at reduced rates.',
        effectiveDate: '2006-01-01',
        source: 'US-Morocco FTA',
        appliesTo: 'Most goods meeting rules of origin',
        exceptions: 'Agricultural products have phased reductions; rules of origin apply',
      },
    ],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    preferentialAgreement: 'AGOA',
    programs: [
      {
        name: 'AGOA Preference',
        additionalRate: -999,
        description: 'African Growth and Opportunity Act. Eligible sub-Saharan African goods including apparel may enter duty-free. South Africa is an AGOA beneficiary.',
        effectiveDate: '2000-10-01',
        source: 'AGOA',
        appliesTo: 'AGOA-eligible goods',
        exceptions: 'Must meet AGOA rules of origin; apparel has yarn-forward or third-country fabric rules; verify current beneficiary status',
      },
    ],
  },
  {
    code: 'KE',
    name: 'Kenya',
    preferentialAgreement: 'AGOA',
    programs: [
      {
        name: 'AGOA Preference',
        additionalRate: -999,
        description: 'AGOA beneficiary. Eligible goods including apparel enter duty-free.',
        effectiveDate: '2000-10-01',
        source: 'AGOA',
        appliesTo: 'AGOA-eligible goods',
        exceptions: 'Must meet AGOA rules of origin; verify current beneficiary status annually',
      },
    ],
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    preferentialAgreement: 'AGOA',
    programs: [
      {
        name: 'AGOA Preference',
        additionalRate: -999,
        description: 'Ethiopia is an AGOA beneficiary (subject to annual review). Eligible goods enter duty-free.',
        effectiveDate: '2000-10-01',
        source: 'AGOA',
        appliesTo: 'AGOA-eligible goods',
        exceptions: 'AGOA eligibility is reviewed annually and can be suspended; verify current status',
      },
    ],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    preferentialAgreement: 'AGOA',
    programs: [
      {
        name: 'AGOA Preference',
        additionalRate: -999,
        description: 'Nigeria is an AGOA beneficiary. Eligible goods enter duty-free.',
        effectiveDate: '2000-10-01',
        source: 'AGOA',
        appliesTo: 'AGOA-eligible goods',
        exceptions: 'Must meet AGOA rules of origin; verify current eligibility',
      },
    ],
  },
  {
    code: 'GH',
    name: 'Ghana',
    preferentialAgreement: 'AGOA',
    programs: [
      {
        name: 'AGOA Preference',
        additionalRate: -999,
        description: 'Ghana is an AGOA beneficiary. Eligible goods enter duty-free.',
        effectiveDate: '2000-10-01',
        source: 'AGOA',
        appliesTo: 'AGOA-eligible goods',
        exceptions: 'Must meet AGOA rules of origin',
      },
    ],
  },
  {
    code: 'EG',
    name: 'Egypt',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Egypt is an MFN trading partner. No FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  // ── Oceania ────────────────────────────────────────────────────────────────
  {
    code: 'AU',
    name: 'Australia',
    preferentialAgreement: 'US-Australia FTA',
    programs: [
      {
        name: 'US-Australia FTA Preference',
        additionalRate: -999,
        description: 'US-Australia Free Trade Agreement. Most goods enter duty-free.',
        effectiveDate: '2005-01-01',
        source: 'US-Australia FTA',
        appliesTo: 'Most goods meeting rules of origin',
        exceptions: 'Some agricultural goods have tariff-rate quotas; rules of origin apply',
      },
    ],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'New Zealand is an MFN trading partner. No bilateral FTA with the US. Standard MFN rates apply.',
        effectiveDate: 'Ongoing',
        source: 'Normal Trade Relations',
        appliesTo: 'All goods',
      },
    ],
  },
  // ── Catch-all ──────────────────────────────────────────────────────────────
  {
    code: 'OTHER',
    name: 'Other Country',
    programs: [
      {
        name: 'MFN Rates Apply',
        additionalRate: 0,
        description: 'Standard Most Favored Nation rates apply. Check USITC for country-specific programs (GSP, AGOA, FTA).',
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

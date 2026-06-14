export type JerseyType = 'authentic' | 'replica' | 'fake';
export type KitVariant = 'home' | 'away' | 'third' | 'special';

export interface JerseyListing {
  id: string;
  team: string;
  retailer: string;
  retailerDomain: string;
  priceUSD: number;
  type: JerseyType;
  season: string;
  kit: KitVariant;
  description: string;
  inStock: boolean;
  shippingNote: string;
}

const A = (
  id: string, team: string, retailer: string, domain: string, price: number,
  season: string, kit: KitVariant, description: string, inStock: boolean, shipping: string
): JerseyListing => ({ id, team, retailer, retailerDomain: domain, priceUSD: price, type: 'authentic', season, kit, description, inStock, shippingNote: shipping });

const R = (
  id: string, team: string, retailer: string, domain: string, price: number,
  season: string, kit: KitVariant, description: string, inStock: boolean, shipping: string
): JerseyListing => ({ id, team, retailer, retailerDomain: domain, priceUSD: price, type: 'replica', season, kit, description, inStock, shippingNote: shipping });

const F = (
  id: string, team: string, retailer: string, domain: string, price: number,
  season: string, kit: KitVariant, description: string, inStock: boolean, shipping: string
): JerseyListing => ({ id, team, retailer, retailerDomain: domain, priceUSD: price, type: 'fake', season, kit, description, inStock, shippingNote: shipping });

export const ALL_JERSEYS: JerseyListing[] = [
  // ─── Manchester City ──────────────────────────────────────────────────────
  A('mc-a1','Manchester City','City Store (Official)','store.mancity.com',129.99,'2024/25','home','Nike Dri-FIT ADV match jersey — same spec worn by Haaland',true,'Free shipping over $75'),
  A('mc-a2','Manchester City','World Soccer Shop','worldsoccershop.com',119.95,'2024/25','away','Nike authentic away jersey — official licensed',true,'Free shipping over $75'),
  A('mc-a3','Manchester City','soccer.com','soccer.com',114.99,'2024/25','home','Nike Dri-FIT ADV — official retailer',true,'Free on orders $75+'),
  R('mc-r1','Manchester City','Fanatics','fanatics.com',49.99,'2024/25','home','Nike Fan Edition — licensed replica, lighter build',true,'Standard $5.99'),
  R('mc-r2','Manchester City','Amazon','amazon.com',42.95,'2023/24','home','Previous season fan jersey — licensed, ships Prime',true,'Free with Prime'),
  R('mc-r3','Manchester City','Sports Direct','sportsdirect.com',38.00,'2024/25','away','Licensed away replica — great everyday wear',true,'Free on $60+'),
  F('mc-f1','Manchester City','DHgate','dhgate.com',15.50,'2024/25','home','Thailand quality — unlicensed, closely matches authentic look',true,'Ships China, 2-4 weeks'),
  F('mc-f2','Manchester City','AliExpress','aliexpress.com',9.88,'2024/25','away','Unlicensed away kit — colors may vary slightly',true,'Ships China, 3-5 weeks'),
  F('mc-f3','Manchester City','Temu','temu.com',7.99,'2024/25','home','Unbranded lookalike — lowest price, variable quality',true,'Ships China, 3-6 weeks'),

  // ─── Real Madrid ─────────────────────────────────────────────────────────
  A('rm-a1','Real Madrid','Real Madrid Official Store','shop.realmadrid.com',139.99,'2024/25','home','Adidas Authentic — champions edition, heat.rdy tech',true,'Free shipping over $100'),
  A('rm-a2','Real Madrid','Adidas','adidas.com',134.99,'2024/25','home','Adidas Heat.RDY authentic player version',true,'Free on $99+'),
  A('rm-a3','Real Madrid','World Soccer Shop','worldsoccershop.com',124.95,'2024/25','away','Adidas authentic away — licensed official',true,'Free on $75+'),
  R('rm-r1','Real Madrid','Fanatics','fanatics.com',54.99,'2024/25','home','Adidas replica — licensed fan edition, popular seller',true,'Standard $5.99'),
  R('rm-r2','Real Madrid','JD Sports','jdsports.com',47.99,'2024/25','away','Licensed Adidas away fan jersey',true,'Free on $60+'),
  R('rm-r3','Real Madrid','Amazon','amazon.com',44.99,'2023/24','home','Previous season — licensed Adidas replica, ships Prime',true,'Free with Prime'),
  F('rm-f1','Real Madrid','DHgate','dhgate.com',17.00,'2024/25','home','Thailand quality — stitched badges, closely matches official',true,'Ships China, 2-4 weeks'),
  F('rm-f2','Real Madrid','AliExpress','aliexpress.com',10.99,'2024/25','away','Unlicensed away — decent quality at the price',true,'Ships China, 3-5 weeks'),
  F('rm-f3','Real Madrid','Temu','temu.com',8.49,'2024/25','home','Budget lookalike — variable stitching quality',false,'Ships China, 3-6 weeks'),

  // ─── FC Barcelona ────────────────────────────────────────────────────────
  A('bar-a1','FC Barcelona','FC Barcelona Official Store','fcbarcelona.com',135.00,'2024/25','home','Nike Dri-FIT ADV — player version, aerodynamic cut',true,'Free on $80+'),
  A('bar-a2','FC Barcelona','Nike','nike.com',129.99,'2024/25','home','Nike authentic home — direct from Nike',true,'Free on $50+'),
  A('bar-a3','FC Barcelona','soccer.com','soccer.com',119.99,'2024/25','away','Nike authentic away jersey — licensed official',true,'Free on $75+'),
  R('bar-r1','FC Barcelona','Fanatics','fanatics.com',52.99,'2024/25','home','Nike Fan Edition — licensed replica, great quality',true,'Standard $5.99'),
  R('bar-r2','FC Barcelona','Amazon','amazon.com',46.50,'2024/25','away','Licensed Nike replica — verified seller',true,'Free with Prime'),
  R('bar-r3','FC Barcelona','Walmart','walmart.com',34.99,'2023/24','home','Previous season Nike replica — best value licensed',true,'Free on $35+'),
  F('bar-f1','FC Barcelona','DHgate','dhgate.com',16.00,'2024/25','home','Thailand quality — stitched Barça crest, popular item',true,'Ships China, 2-4 weeks'),
  F('bar-f2','FC Barcelona','AliExpress','aliexpress.com',11.50,'2024/25','away','Unlicensed away — embroidered details at budget price',true,'Ships China, 3-5 weeks'),
  F('bar-f3','FC Barcelona','Wish','wish.com',6.99,'2024/25','home','Very cheap — quality inconsistent, sizing runs small',true,'Ships China, 4-8 weeks'),

  // ─── Liverpool ───────────────────────────────────────────────────────────
  A('liv-a1','Liverpool','Liverpool Official Store','store.liverpoolfc.com',124.99,'2024/25','home','Nike Dri-FIT ADV match — same as Salah wears at Anfield',true,'Free on $75+'),
  A('liv-a2','Liverpool','Nike','nike.com',119.99,'2024/25','home','Nike authentic home jersey — direct from Nike.com',true,'Free on $50+'),
  A('liv-a3','Liverpool','World Soccer Shop','worldsoccershop.com',114.95,'2024/25','away','Nike authentic away — licensed official retailer',true,'Free on $75+'),
  R('liv-r1','Liverpool','Fanatics','fanatics.com',47.99,'2024/25','home','Nike Fan Edition — licensed, comfortable everyday wear',true,'Standard $5.99'),
  R('liv-r2','Liverpool','Amazon','amazon.com',43.99,'2024/25','away','Licensed Nike away replica — Prime shipping',true,'Free with Prime'),
  R('liv-r3','Liverpool','Sports Direct','sportsdirect.com',36.00,'2023/24','home','Previous season licensed replica — great discount',true,'Free on $60+'),
  F('liv-f1','Liverpool','DHgate','dhgate.com',14.99,'2024/25','home','Thailand quality — stitched LFC crest, very popular',true,'Ships China, 2-4 weeks'),
  F('liv-f2','Liverpool','AliExpress','aliexpress.com',10.20,'2024/25','away','Unlicensed away jersey — embroidered badge',true,'Ships China, 3-5 weeks'),
  F('liv-f3','Liverpool','Temu','temu.com',7.49,'2024/25','home','Budget lookalike — thinner fabric, print crest',true,'Ships China, 3-6 weeks'),

  // ─── PSG ─────────────────────────────────────────────────────────────────
  A('psg-a1','PSG','PSG Official Store','psgstore.com',144.99,'2024/25','home','Nike Dri-FIT ADV — authentic player-spec Parisien edition',true,'Free on $80+'),
  A('psg-a2','PSG','Nike','nike.com',134.99,'2024/25','home','Nike authentic — direct official source',true,'Free on $50+'),
  A('psg-a3','PSG','soccer.com','soccer.com',124.95,'2024/25','away','Nike authentic away — licensed US retailer',true,'Free on $75+'),
  R('psg-r1','PSG','Fanatics','fanatics.com',57.99,'2024/25','home','Nike Fan Edition — licensed, lighter than player version',true,'Standard $5.99'),
  R('psg-r2','PSG','Amazon','amazon.com',51.99,'2024/25','away','Licensed Nike away fan jersey — verified seller',true,'Free with Prime'),
  R('psg-r3','PSG','JD Sports','jdsports.com',49.99,'2024/25','home','Licensed Nike home replica — popular colorway',true,'Free on $60+'),
  F('psg-f1','PSG','DHgate','dhgate.com',18.00,'2024/25','home','Thailand quality — Swoosh + PSG badge stitched',true,'Ships China, 2-4 weeks'),
  F('psg-f2','PSG','AliExpress','aliexpress.com',12.50,'2024/25','away','Unlicensed — navy/red colorway, embroidered crest',true,'Ships China, 3-5 weeks'),
  F('psg-f3','PSG','Temu','temu.com',9.99,'2024/25','home','Budget version — passable at low price point',true,'Ships China, 3-6 weeks'),

  // ─── Bayern Munich ───────────────────────────────────────────────────────
  A('bay-a1','Bayern Munich','FC Bayern Official Store','fcbayern.com/shop',149.99,'2024/25','home','Adidas Authentic — player-spec Bundesliga edition',true,'Ships from Germany, free $100+'),
  A('bay-a2','Bayern Munich','Adidas','adidas.com',139.99,'2024/25','home','Adidas HEAT.RDY authentic — direct from adidas.com',true,'Free on $99+'),
  A('bay-a3','Bayern Munich','World Soccer Shop','worldsoccershop.com',129.95,'2024/25','away','Adidas authentic away — licensed US retailer',true,'Free on $75+'),
  R('bay-r1','Bayern Munich','Fanatics','fanatics.com',55.99,'2024/25','home','Adidas licensed replica — great everyday FC Bayern kit',true,'Standard $5.99'),
  R('bay-r2','Bayern Munich','Amazon','amazon.com',48.99,'2024/25','away','Licensed Adidas away replica — Prime verified seller',true,'Free with Prime'),
  R('bay-r3','Bayern Munich','Soccer.com','soccer.com',44.99,'2023/24','home','Previous season Adidas replica — marked down',true,'Free on $75+'),
  F('bay-f1','Bayern Munich','DHgate','dhgate.com',16.50,'2024/25','home','Thailand quality — Adidas stripes, stitched badge',true,'Ships China, 2-4 weeks'),
  F('bay-f2','Bayern Munich','AliExpress','aliexpress.com',11.00,'2024/25','away','Unlicensed away — red/blue detailed, embroidered',true,'Ships China, 3-5 weeks'),
  F('bay-f3','Bayern Munich','Temu','temu.com',8.25,'2024/25','home','Very affordable — some quality variance batch to batch',true,'Ships China, 3-6 weeks'),

  // ─── Arsenal ─────────────────────────────────────────────────────────────
  A('ars-a1','Arsenal','Arsenal Direct','arsenaldirect.arsenal.com',124.99,'2024/25','home','Adidas authentic — same jersey Saka and Ødegaard wear',true,'Free on $75+'),
  A('ars-a2','Arsenal','Adidas','adidas.com',119.99,'2024/25','home','Adidas HEAT.RDY authentic — direct from adidas.com',true,'Free on $99+'),
  A('ars-a3','Arsenal','World Soccer Shop','worldsoccershop.com',114.95,'2024/25','away','Adidas authentic away jersey — licensed',true,'Free on $75+'),
  R('ars-r1','Arsenal','Fanatics','fanatics.com',46.99,'2024/25','home','Adidas fan edition — licensed, comfortable fit',true,'Standard $5.99'),
  R('ars-r2','Arsenal','Amazon','amazon.com',41.99,'2024/25','away','Licensed Adidas away replica — Prime eligible',true,'Free with Prime'),
  R('ars-r3','Arsenal','JD Sports','jdsports.com',39.99,'2023/24','home','Discounted prior season — fully licensed',true,'Free on $60+'),
  F('ars-f1','Arsenal','DHgate','dhgate.com',13.99,'2024/25','home','Thailand quality — cannon badge stitched, fan favorite',true,'Ships China, 2-4 weeks'),
  F('ars-f2','Arsenal','AliExpress','aliexpress.com',9.50,'2024/25','away','Unlicensed away — yellow/navy, embroidered crest',true,'Ships China, 3-5 weeks'),
  F('ars-f3','Arsenal','Temu','temu.com',7.25,'2024/25','home','Very cheap — printed badge, thinner polyester',true,'Ships China, 3-6 weeks'),

  // ─── Chelsea ──────────────────────────────────────────────────────────────
  A('che-a1','Chelsea','Chelsea Megastore','chelseamegastore.com',129.99,'2024/25','home','Nike Dri-FIT ADV authentic — player-grade fit',true,'Free on $75+'),
  A('che-a2','Chelsea','Nike','nike.com',124.99,'2024/25','home','Nike authentic home — direct purchase from Nike',true,'Free on $50+'),
  A('che-a3','Chelsea','Pro:Direct Soccer','prodirectsoccer.com',109.99,'2024/25','away','Nike authentic away — UK-based licensed retailer',true,'International shipping available'),
  R('che-r1','Chelsea','Fanatics','fanatics.com',48.99,'2024/25','home','Nike Fan Edition — licensed, standard replica cut',true,'Standard $5.99'),
  R('che-r2','Chelsea','Amazon','amazon.com',43.50,'2024/25','away','Licensed Nike away fan jersey — Prime eligible',true,'Free with Prime'),
  R('che-r3','Chelsea','Sports Direct','sportsdirect.com',37.00,'2023/24','home','Prior season Nike replica — licensed clearance',true,'Free on $60+'),
  F('che-f1','Chelsea','DHgate','dhgate.com',14.00,'2024/25','home','Thailand quality — stitched lion crest, blue home kit',true,'Ships China, 2-4 weeks'),
  F('che-f2','Chelsea','AliExpress','aliexpress.com',9.75,'2024/25','away','Unlicensed away — white colorway, embroidered badge',true,'Ships China, 3-5 weeks'),
  F('che-f3','Chelsea','Wish','wish.com',6.50,'2024/25','home','Lowest price available — significant quality variation',true,'Ships China, 4-8 weeks'),

  // ─── Brazil (National) ────────────────────────────────────────────────────
  A('bra-a1','Brazil','Nike','nike.com',139.99,'2024','home','Nike Dri-FIT ADV authentic — Seleção Brasileira canary yellow',true,'Free on $50+'),
  A('bra-a2','Brazil','World Soccer Shop','worldsoccershop.com',129.95,'2024','home','Nike authentic — official US licensed retailer',true,'Free on $75+'),
  A('bra-a3','Brazil','soccer.com','soccer.com',119.99,'2024','away','Nike authentic blue away — Copa America edition',true,'Free on $75+'),
  R('bra-r1','Brazil','Amazon','amazon.com',49.99,'2024','home','Licensed Nike replica — fan edition, ships Prime',true,'Free with Prime'),
  R('bra-r2','Brazil','Fanatics','fanatics.com',45.99,'2024','home','Nike Fan Edition Brazil — licensed quality replica',true,'Standard $5.99'),
  R('bra-r3','Brazil','Walmart','walmart.com',32.99,'2023','home','Older season replica — licensed, budget-friendly',true,'Free on $35+'),
  F('bra-f1','Brazil','DHgate','dhgate.com',15.00,'2024','home','Thailand quality — Swoosh and CBF badge stitched',true,'Ships China, 2-4 weeks'),
  F('bra-f2','Brazil','AliExpress','aliexpress.com',10.50,'2024','away','Unlicensed blue away — embroidered crest',true,'Ships China, 3-5 weeks'),
  F('bra-f3','Brazil','Temu','temu.com',8.00,'2024','home','Budget canary yellow — colors may be off-shade',true,'Ships China, 3-6 weeks'),

  // ─── Argentina ───────────────────────────────────────────────────────────
  A('arg-a1','Argentina','Adidas','adidas.com',144.99,'2024','home','Adidas authentic — Messi\'s national team jersey, AFA edition',true,'Free on $99+'),
  A('arg-a2','Argentina','World Soccer Shop','worldsoccershop.com',134.95,'2024','home','Adidas authentic — post-World Cup champions edition',true,'Free on $75+'),
  A('arg-a3','Argentina','soccer.com','soccer.com',124.99,'2024','away','Adidas authentic dark blue away — licensed US retailer',true,'Free on $75+'),
  R('arg-r1','Argentina','Fanatics','fanatics.com',58.99,'2024','home','Adidas Fan Edition — most popular jersey on site',true,'Standard $5.99'),
  R('arg-r2','Argentina','Amazon','amazon.com',52.99,'2024','home','Licensed Adidas replica — top seller, ships Prime',true,'Free with Prime'),
  R('arg-r3','Argentina','JD Sports','jdsports.com',48.99,'2024','away','Licensed Adidas away — blue/black Albiceleste',true,'Free on $60+'),
  F('arg-f1','Argentina','DHgate','dhgate.com',18.50,'2024','home','Thailand quality — 3 stripes + AFA crest stitched, best seller',true,'Ships China, 2-4 weeks'),
  F('arg-f2','Argentina','AliExpress','aliexpress.com',12.00,'2024','home','Unlicensed — Messi #10 available, embroidered',true,'Ships China, 3-5 weeks'),
  F('arg-f3','Argentina','Temu','temu.com',9.50,'2024','away','Budget dark blue away — decent colors',true,'Ships China, 3-6 weeks'),

  // ─── Juventus ────────────────────────────────────────────────────────────
  A('juv-a1','Juventus','Juventus Official Store','store.juventus.com',134.99,'2024/25','home','Adidas authentic — iconic black & white stripes, Serie A',true,'Ships from Italy, free $100+'),
  A('juv-a2','Juventus','Adidas','adidas.com',129.99,'2024/25','home','Adidas authentic — direct from adidas.com',true,'Free on $99+'),
  A('juv-a3','Juventus','World Soccer Shop','worldsoccershop.com',119.95,'2024/25','away','Adidas authentic away — licensed US retailer',true,'Free on $75+'),
  R('juv-r1','Juventus','Fanatics','fanatics.com',50.99,'2024/25','home','Adidas replica fan jersey — classic black/white stripes',true,'Standard $5.99'),
  R('juv-r2','Juventus','Amazon','amazon.com',45.99,'2024/25','away','Licensed Adidas away replica — Prime eligible',true,'Free with Prime'),
  R('juv-r3','Juventus','Sports Direct','sportsdirect.com',39.00,'2023/24','home','Prior season Adidas replica — officially licensed',true,'Free on $60+'),
  F('juv-f1','Juventus','DHgate','dhgate.com',14.50,'2024/25','home','Thailand quality — stripes + Juve shield stitched',true,'Ships China, 2-4 weeks'),
  F('juv-f2','Juventus','AliExpress','aliexpress.com',9.99,'2024/25','away','Unlicensed away — embroidered Juventus badge',true,'Ships China, 3-5 weeks'),
  F('juv-f3','Juventus','Temu','temu.com',7.75,'2024/25','home','Cheapest option — print-on stripes, variable quality',true,'Ships China, 3-6 weeks'),

  // ─── Inter Milan ─────────────────────────────────────────────────────────
  A('int-a1','Inter Milan','Inter Milan Official Store','store.inter.it',139.99,'2024/25','home','Nike Dri-FIT ADV — iconic blue/black stripes, Serie A',true,'Ships from Italy, free $100+'),
  A('int-a2','Inter Milan','Nike','nike.com',129.99,'2024/25','home','Nike authentic — direct from Nike.com',true,'Free on $50+'),
  A('int-a3','Inter Milan','soccer.com','soccer.com',119.99,'2024/25','away','Nike authentic away — licensed official retailer',true,'Free on $75+'),
  R('int-r1','Inter Milan','Fanatics','fanatics.com',49.99,'2024/25','home','Nike Fan Edition — blue/black stripes, licensed quality',true,'Standard $5.99'),
  R('int-r2','Inter Milan','Amazon','amazon.com',44.99,'2024/25','away','Licensed Nike away replica — Prime eligible',true,'Free with Prime'),
  R('int-r3','Inter Milan','JD Sports','jdsports.com',41.99,'2023/24','home','Prior season Nike replica — licensed clearance price',true,'Free on $60+'),
  F('int-f1','Inter Milan','DHgate','dhgate.com',15.00,'2024/25','home','Thailand quality — stitched stripes + Interista badge',true,'Ships China, 2-4 weeks'),
  F('int-f2','Inter Milan','AliExpress','aliexpress.com',10.25,'2024/25','away','Unlicensed away — embroidered crest, white colorway',true,'Ships China, 3-5 weeks'),
  F('int-f3','Inter Milan','Temu','temu.com',8.10,'2024/25','home','Budget stripes — colors generally accurate',true,'Ships China, 3-6 weeks'),
];

export function searchJerseys(query: string): JerseyListing[] {
  const q = query.trim().toLowerCase();
  const results = q
    ? ALL_JERSEYS.filter(j => j.team.toLowerCase().includes(q))
    : ALL_JERSEYS;
  return results.sort((a, b) => a.priceUSD - b.priceUSD);
}

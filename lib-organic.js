/* Nemo Library — Organic chemistry, part 1: GOC, stereochemistry, mechanisms, hydrocarbons, name reactions.
   Original write-ups of standard NCERT / textbook / IUPAC content. Fields as in lib-physical.js. */
(window.NEMO_LIBRARY = window.NEMO_LIBRARY || []).push(...[
  { b: "Organic", ch: "General organic chemistry", t: "Concept", l: "Board", n: "Inductive effect", w: "",
    s: "Permanent polarisation of σ bonds by electronegativity differences, falling off quickly with distance. −I order: –NO₂ > –CN > –COOH > –F > –Cl > –Br > –I > –OH > –C₆H₅. +I order of alkyl groups: (CH₃)₃C– > (CH₃)₂CH– > CH₃CH₂– > CH₃–.",
    x: "Inductive effect operates through σ bonds and is transmitted mostly across the first three carbons." },
  { b: "Organic", ch: "General organic chemistry", t: "Concept", l: "Main", n: "Resonance (mesomeric) effect", w: "",
    s: "Delocalisation of π electrons or lone pairs through conjugation. +M groups: –OH, –OR, –NH₂, –NHR, –O⁻, halogens. −M groups: –NO₂, –CN, –CHO, –COR, –COOH, –SO₃H. Resonance structures have the same atom positions and the same number of paired and unpaired electrons.",
    x: "Halogens are −I but +M. The net effect deactivates the ring yet directs ortho/para." },
  { b: "Organic", ch: "General organic chemistry", t: "Law", l: "Main", n: "Hyperconjugation (Baker–Nathan effect)", w: "Baker and Nathan",
    s: "Delocalisation of σ(C–H) electrons into an adjacent empty p orbital or π system ('no-bond resonance'). The more α-hydrogens, the greater the stabilisation. Baker–Nathan order of the effect of alkyl groups: CH₃ > CH₂CH₃ > CH(CH₃)₂ > C(CH₃)₃.",
    e: "(CH₃)₃C⁺ has nine α-H (9 hyperconjugative structures), CH₃CH₂⁺ has three.",
    x: "Alkene stability order follows the number of α-H: more substituted alkenes are more stable. Hyperconjugation order is opposite to the inductive order of the same groups." },
  { b: "Organic", ch: "General organic chemistry", t: "Trend", l: "Main", n: "Stability of intermediates", w: "",
    s: "Carbocations and free radicals: 3° > 2° > 1° > CH₃⁺ (also benzyl and allyl > 3° alkyl). Carbanions follow the opposite order: CH₃⁻ > 1° > 2° > 3°. Carbocation next to an oxygen or nitrogen lone pair (CH₃OCH₂⁺) is strongly stabilised by resonance.",
    x: "Vinyl and aryl cations are unstable: the vinyl cation carbon is sp-hybridised, and the aryl cation's empty sp² orbital lies in the ring plane, so the π system cannot stabilise it. The cyclopropylmethyl cation is unusually stable." },
  { b: "Organic", ch: "General organic chemistry", t: "Trend", l: "Main", n: "Acidity of carboxylic acids", w: "",
    s: "HCOOH (pK_a 3.75) > C₆H₅COOH (4.20) > CH₃COOH (4.76). Electron-withdrawing groups raise acidity: Cl₃CCOOH > Cl₂CHCOOH > ClCH₂COOH > CH₃COOH, and FCH₂COOH > ClCH₂COOH > BrCH₂COOH > ICH₂COOH. Closer substituents act more strongly.",
    x: "Ortho effect: nearly every ortho-substituted benzoic acid is stronger than benzoic acid, regardless of the group." },
  { b: "Organic", ch: "General organic chemistry", t: "Trend", l: "Main", n: "Phenols, alcohols and acidity order", w: "",
    s: "RCOOH > H₂CO₃ > phenol > H₂O > ROH > HC≡CH. Phenoxide is resonance stabilised. Nitro groups at o- and p- positions increase acidity: p-nitrophenol (pK_a 7.15) and o-nitrophenol (7.23) are stronger than m-nitrophenol (8.35) and phenol (10).",
    x: "Phenol does not liberate CO₂ from NaHCO₃. The ortho isomer is slightly weaker than para because of intramolecular H-bonding." }
]);

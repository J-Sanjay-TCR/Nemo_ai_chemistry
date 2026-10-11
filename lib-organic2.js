/* Nemo Library — Organic chemistry, part 2: carbonyl/amine leftovers, biomolecules, polymers, everyday chemistry,
   practical organic chemistry and analytical tests. Original write-ups of standard NCERT / textbook / IUPAC content.
   Fields as in lib-physical.js (b branch, ch chapter, t type, l level, n title, w scientist, s statement, e example, x exam trap). */
(window.NEMO_LIBRARY = window.NEMO_LIBRARY || []).push(...[
  { b: "Organic", ch: "General organic chemistry", t: "Concept", l: "Main", n: "E1, E2 and E1cB eliminations", w: "",
    s: "E2 is one concerted step: second order, needs a strong base and an anti-periplanar H and leaving group, and follows Zaitsev unless the base or leaving group is bulky. E1 shares the carbocation step of SN1, is first order, favoured by 3° substrates and polar protic solvents, and competes with SN1. E1cB goes through a carbanion and needs an acidic β-H with a poor leaving group (for example β-hydroxy carbonyl compounds losing water).",
    e: "Aldol condensation: the enolate expels OH⁻ in an E1cB step to give the conjugated enone.",
    x: "Higher temperature favours elimination over substitution; a bulky base such as t-BuOK favours the Hofmann alkene." },
  { b: "Organic", ch: "General organic chemistry", t: "Rule", l: "Main", n: "Carbocation rearrangements", w: "Wagner, Meerwein",
    s: "A carbocation shifts H⁻ or R⁻ (1,2-shift) to a neighbouring carbon whenever that gives a more stable cation (3° > 2° > 1°, or resonance/ring-strain relief). Ring expansion of cyclobutylcarbinyl and cyclopropylcarbinyl cations relieves strain.",
    e: "3,3-dimethylbut-2-yl cation from HCl + 3,3-dimethylbut-1-ene: methyl shift gives the 2,3-dimethylbut-2-yl cation, so the major product is 2-chloro-2,3-dimethylbutane.",
    x: "Rearrangement happens in SN1, E1, alcohol dehydration and Friedel–Crafts alkylation, but not in SN2, E2, or Friedel–Crafts acylation." },
  { b: "Organic", ch: "General organic chemistry", t: "Trend", l: "Main", n: "Carbanion, free radical and carbene stability", w: "",
    s: "Carbanion stability: CH₃⁻ > 1° > 2° > 3° (alkyl groups push electrons onto an already negative carbon); increases with s-character (sp > sp² > sp³) and with −I or −M groups. Free-radical stability follows hyperconjugation: 3° > 2° > 1° > CH₃•, and allyl and benzyl radicals are most stable. Carbenes (:CH₂, :CCl₂) are neutral, six-electron, sp²-like species; singlet carbene is bent with a lone pair, triplet carbene has two unpaired electrons.",
    e: "Dichlorocarbene from CHCl₃ + KOH is the reactive species in the Reimer–Tiemann reaction and the carbylamine test.",
    x: "Carbocation stability order is the opposite of carbanion stability order." }
]);

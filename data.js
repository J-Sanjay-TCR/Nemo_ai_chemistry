/* Nemo content: practice questions, formula bank and offline answers.
   All practice questions are ORIGINAL study questions written for this app. They are not official
   JEE/CBSE previous-year questions and carry no year/paper metadata. */
window.NEMO_DATA = {
  quiz: [
    { id: "p1", branch: "Physical", chapter: "Electrochemistry",
      q: "The standard EMF of the Daniell cell Zn | Zn²⁺ || Cu²⁺ | Cu is 1.10 V. At 298 K with [Zn²⁺] = 0.01 M and [Cu²⁺] = 1 M, the EMF is closest to:",
      options: ["1.04 V", "1.10 V", "1.16 V", "1.22 V"], answer: 2,
      explain: "Q = [Zn²⁺]/[Cu²⁺] = 0.01 and n = 2. E = 1.10 − (0.0592/2) log 0.01 = 1.10 + 0.059 ≈ 1.16 V." },
    { id: "p2", branch: "Physical", chapter: "Chemical kinetics",
      q: "A first-order reaction is 75% complete in 30 minutes. Its half-life is:",
      options: ["7.5 min", "15 min", "30 min", "60 min"], answer: 1,
      explain: "75% completion means two half-lives, so t½ = 15 min." },
    { id: "p3", branch: "Physical", chapter: "Solutions",
      q: "Which 0.1 M aqueous solution has the highest osmotic pressure at the same temperature?",
      options: ["Glucose", "NaCl", "CaCl₂", "Urea"], answer: 2,
      explain: "π = iCRT so CaCl₂ has the largest i value." }
  ],
  formulas: [
    { id: "nernst", branch: "Physical", chapter: "Electrochemistry", title: "Nernst equation", expr: "E = E° − (RT/nF) ln Q",
      keys: ["nernst"],
      symbols: ["E: cell potential", "E°: standard potential", "n: electrons transferred", "Q: reaction quotient"],
      notes: ["At 298 K, E = E° − (0.0592/n) log Q.", "At equilibrium E = 0."],
      example: "Zn | Zn²⁺ (0.01 M) || Cu²⁺ (1 M) | Cu, E ≈ 1.16 V." }
  ],
  topics: [
    { id: "sn1", title: "SN1 mechanism", match: "\\bsn[\\s-]?1\\b|unimolecular nucleophilic",
      answer: "**SN1 mechanism**\n1. Ionisation to carbocation.\n2. Nucleophilic attack.\n3. Deprotonation.\n\nRate law: rate = k[substrate]." },
    { id: "sn2", title: "SN2 mechanism", match: "\\bsn[\\s-]?2\\b|bimolecular nucleophilic",
      answer: "**SN2 mechanism**\nA single-step backside attack with inversion of configuration.\n\nRate law: rate = k[substrate][nucleophile]." }
  ]
};

window.NEMO_MOLECULES = [
  {
    "id": "water",
    "name": "Water",
    "formula": "H₂O",
    "group": "Common molecules",
    "electron": "Tetrahedral (2 bond pairs + 2 lone pairs)",
    "shape": "Bent (V-shaped)",
    "hyb": "sp³",
    "angle": "104.5°",
    "polar": "Polar",
    "note": "Two lone pairs repel the bond pairs more strongly, squeezing H–O–H below 109.5°.",
    "atoms": [
      ["O", 0.0, 0.392, 0.0],
      ["H", 0.759, -0.196, 0.0],
      ["H", -0.759, -0.196, 0.0]
    ],
    "bonds": [[0, 1, 1], [0, 2, 1]],
    "lonePairs": [
      { "atom": 0, "dir": [0.0, 0.537, 0.843] },
      { "atom": 0, "dir": [0.0, 0.537, -0.843] }
    ]
  },
  {
    "id": "methane",
    "name": "Methane",
    "formula": "CH₄",
    "group": "Common molecules",
    "electron": "Tetrahedral",
    "shape": "Tetrahedral",
    "hyb": "sp³",
    "angle": "109.5°",
    "polar": "Non-polar",
    "note": "Four identical C–H bonds; the dipoles cancel by symmetry.",
    "atoms": [
      ["C", 0.0, 0.0, 0.0],
      ["H", 0.629, 0.629, 0.629],
      ["H", 0.629, -0.629, -0.629],
      ["H", -0.629, 0.629, -0.629],
      ["H", -0.629, -0.629, 0.629]
    ],
    "bonds": [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
    "lonePairs": []
  }
];

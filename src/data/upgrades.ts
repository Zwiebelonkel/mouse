export const upgrades = {
  // Kategorie 1 – Stärke
  extraFinger: {
    name: "Extra Finger",
    description: "+1 Klickkraft",
    baseCost: 10,
    maxLevel: 50,
    effect: (state) => ({
      clicksPerMilk: state.clicksPerMilk + 1,
    }),
  },

  muscleTraining: {
    name: "Muskeltraining",
    description: "+10% Klickkraft",
    baseCost: 30,
    maxLevel: 20,
    effect: (state) => ({
      clicksPerMilk: Math.round(state.clicksPerMilk * 1.1),
    }),
  },

  powerGrip: {
    name: "Power Grip",
    description: "+25% Klickkraft",
    baseCost: 100,
    maxLevel: 15,
    effect: (state) => ({
      clicksPerMilk: Math.round(state.clicksPerMilk * 1.25),
    }),
  },

  // Kategorie 2 – Combo
  comboMaster: {
    name: "Combo Master",
    description: "Combo decay -20%",
    baseCost: 25,
    maxLevel: 10,
    effect: (state) => ({
      comboDecayReduction: state.comboDecayReduction + 0.2,
    }),
  },

  ultraCombo: {
    name: "Ultra Combo",
    description: "Max Multiplikator +0.5",
    baseCost: 120,
    maxLevel: 5,
    effect: (state) => ({
      maxMultiplierBonus: state.maxMultiplierBonus + 0.5,
    }),
  },

  milkSurge: {
    name: "Milk Surge",
    description: "Start-Multiplikator +0.25",
    baseCost: 200,
    maxLevel: 3,
    effect: (state) => ({
      baseMultiplierBonus: state.baseMultiplierBonus + 0.25,
    }),
  },

  // Kategorie 3 – Passive Milch
  mouseFood: {
    name: "Mausfutter",
    description: "+1 Milch/min",
    baseCost: 50,
    maxLevel: 20,
    effect: (state) => ({
      passiveMilk: state.passiveMilk + 1,
    }),
  },

  hamsterWheel: {
    name: "Hamsterrad",
    description: "+5 Milch/min",
    baseCost: 300,
    maxLevel: 10,
    effect: (state) => ({
      passiveMilk: state.passiveMilk + 5,
    }),
  },

  milkFarm: {
    name: "Milchfarm",
    description: "+50 Milch/min",
    baseCost: 1500,
    maxLevel: 5,
    effect: (state) => ({
      passiveMilk: state.passiveMilk + 50,
    }),
  },
};
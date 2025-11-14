'use client';

import {
  Hand,
  Dumbbell,
  Grab,
  Gauge,
  GaugeCircle,
  Activity,
  Mouse,
  Cog,
  Home,
  RefreshCcw,
  CloudLightning,
  MoonStar,
  Flame,
} from "lucide-react";

export const upgrades = {
  // Kategorie 1 – Stärke
  extraFinger: {
    name: "Extra Finger",
    description: "+1 Klickkraft",
    baseCost: 5,
    maxLevel: 50,
    icon: Hand,
    effect: (state) => ({
      clicksPerMilk: state.clicksPerMilk + 1,
    }),
  },

  muscleTraining: {
    name: "Muskeltraining",
    description: "+10% Klickkraft",
    baseCost: 10,
    maxLevel: 20,
    icon: Dumbbell,
    effect: (state) => ({
      clicksPerMilk: Math.round(state.clicksPerMilk * 1.1),
    }),
  },

  powerGrip: {
    name: "Power Grip",
    description: "+25% Klickkraft",
    baseCost: 20,
    maxLevel: 15,
    icon: Grab,
    effect: (state) => ({
      clicksPerMilk: Math.round(state.clicksPerMilk * 1.25),
    }),
  },

  milkMaschine: {
    name: "Milchmschine",
    description: "+ 0.75 Click / Minute",
    baseCost: 1,
    maxLevel: 100,
    icon: RefreshCcw,
    effect: (state) => ({
      autoClick: state.autoClick + 0.75,
    }),
  },

  // Kategorie 2 – Combo
  comboMaster: {
    name: "Combo Master",
    description: "Combo decay -20%",
    baseCost: 15,
    maxLevel: 10,
    icon: Gauge,
    effect: (state) => ({
      comboDecayReduction: state.comboDecayReduction + 0.2,
    }),
  },

  ultraCombo: {
    name: "Ultra Combo",
    description: "Max Multiplikator +0.5",
    baseCost: 18,
    maxLevel: 10,
    icon: GaugeCircle,
    effect: (state) => ({
      maxMultiplierBonus: state.maxMultiplierBonus + 0.5,
    }),
  },

  milkSurge: {
    name: "Milk Surge",
    description: "Start-Multiplikator +0.25",
    baseCost: 200,
    maxLevel: 3,
    icon: Activity,
    effect: (state) => ({
      baseMultiplierBonus: state.baseMultiplierBonus + 0.25,
    }),
  },

  // Kategorie 3 – Passive Milch
  mouseFood: {
    name: "Mausfutter",
    description: "+1 Milch/min",
    baseCost: 10,
    maxLevel: 20,
    icon: Mouse,
    effect: (state) => ({
      passiveMilk: state.passiveMilk + 1,
    }),
  },

  hamsterWheel: {
    name: "Hamsterrad",
    description: "+5 Milch/min",
    baseCost: 20,
    maxLevel: 10,
    icon: Cog,
    effect: (state) => ({
      passiveMilk: state.passiveMilk + 5,
    }),
  },

  milkFarm: {
    name: "Milchfarm",
    description: "+50 Milch/min",
    baseCost: 150,
    maxLevel: 10,
    icon: Home,
    effect: (state) => ({
      passiveMilk: state.passiveMilk + 50,
    }),
  },
};

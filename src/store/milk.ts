'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { upgrades } from "@/data/upgrades";

// Kostenformel
const costFormula = (base: number, level: number) =>
  Math.floor(base * Math.pow(1.65, level));

const INITIAL_CLICKS_TO_MILK = 10;

export interface MilkState {
  milkedCount: number;
  totalMilkedCount: number;

  clicksPerMilk: number;

  autoClick: number;

  comboDecayReduction: number;
  maxMultiplierBonus: number;
  baseMultiplierBonus: number;

  passiveMilk: number;
  lastPassiveTick: number;

  clicksToMilk: number;

  upgradeLevels: Record<string, number>;
  isMuted: boolean;

  increaseMilkedCount: () => void;
  decreaseMilkedCount: (amount: number) => void;

  increaseClicksToMilk: () => void;

  buyUpgrade: (id: string) => boolean;
  toggleMute: () => void;
}

export const useMilkStore = create<MilkState>()(
  persist(
    (set, get) => ({
      milkedCount: 0,
      totalMilkedCount: 0,

      clicksPerMilk: 1,

      autoClick: 0,

      comboDecayReduction: 0,
      maxMultiplierBonus: 0,
      baseMultiplierBonus: 0,

      passiveMilk: 0,
      lastPassiveTick: Date.now(),

      clicksToMilk: INITIAL_CLICKS_TO_MILK,

      upgradeLevels: Object.fromEntries(
        Object.keys(upgrades).map((k) => [k, 0])
      ),
      isMuted: false,

      increaseMilkedCount: () =>
        set((state) => ({
          milkedCount: state.milkedCount + 1,
          totalMilkedCount: state.totalMilkedCount + 1,
        })),

      decreaseMilkedCount: (amount) =>
        set((state) => ({
          milkedCount: Math.max(0, state.milkedCount - amount),
        })),

      increaseClicksToMilk: () =>
        set((state) => ({
          clicksToMilk: Math.ceil(state.clicksToMilk * 1.15),
        })),

      buyUpgrade: (id: string) => {
        const state = get();
        const upg = upgrades[id];
        const level = state.upgradeLevels[id];
        const cost = costFormula(upg.baseCost, level);

        if (state.milkedCount < cost) return false;
        if (level >= upg.maxLevel) return false;

        set((s) => ({
          milkedCount: s.milkedCount - cost,
          ...upg.effect(s),
          upgradeLevels: {
            ...s.upgradeLevels,
            [id]: level + 1,
          },
        }));

        return true;
      },
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: "milk-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { upgrades } from "@/data/upgrades"; // Import BossDefinition
import { BossDefinition, BOSSES } from "@/bosses/bosses"; // Import BossDefinition


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

  // Boss-related state
  bossCounter: number;
  activeBoss: BossDefinition | null;
  bossClicks: number;
  bossTimer: number;
  spawnBoss: () => void; // ✅ Das fehlt!

  increaseMilkedCount: () => void;
  decreaseMilkedCount: (amount: number) => void;

  increaseClicksToMilk: () => void;

  buyUpgrade: (id: string) => boolean;
  toggleMute: () => void;

  // Boss-related actions
  increaseBossCounter: () => void;
  activateBoss: (boss: BossDefinition) => void;
  increaseBossClicks: (amount: number) => void;
  resetBoss: () => void;
  resetBossCounter: () => void; // Added this line
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

      // Boss-related initial state
      bossCounter: 0,
      activeBoss: null,
      bossClicks: 0,
      bossTimer: 0,

      increaseMilkedCount: () =>
        set((state) => ({
          milkedCount: state.milkedCount + 1,
          totalMilkedCount: state.totalMilkedCount + 1,
          bossCounter: state.activeBoss ? state.bossCounter : state.bossCounter + 1,
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

// Boss-related actions
increaseBossCounter: () =>
  set((state) => ({ bossCounter: state.bossCounter + 1 })),

activateBoss: (boss: BossDefinition) =>
  set({
    activeBoss: boss,
    bossClicks: 0,
    bossTimer: boss.time,
  }),

increaseBossClicks: (amount) =>
  set((state) => ({
    bossClicks: state.bossClicks + amount,
  })),

resetBoss: () =>
  set(() => ({
    activeBoss: null,
    bossClicks: 0,
    bossTimer: 0,
  })),

resetBossCounter: () => set({ bossCounter: 0 }), // Added this line

spawnBoss: () => {
  const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
  get().activateBoss(boss);
},
    }),
    {
      name: "milk-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
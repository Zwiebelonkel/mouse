import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const INITIAL_CLICKS_TO_MILK = 10;

interface MilkState {
  milkedCount: number;
  totalMilkedCount: number;
  increaseMilkedCount: () => void;
  clicksPerMilk: number;
  increaseClicksPerMilk: () => void;
  decreaseMilkedCount: (amount: number) => void;
  clicksToMilk: number;
  increaseClicksToMilk: () => void;
  extraFingerCost: number;
  increaseExtraFingerCost: () => void;
}

export const useMilkStore = create<MilkState>()(
  persist(
    (set) => ({
      milkedCount: 0,
      totalMilkedCount: 0,
      increaseMilkedCount: () =>
        set((state) => ({
          milkedCount: state.milkedCount + 1,
          totalMilkedCount: state.totalMilkedCount + 1,
        })),
      clicksPerMilk: 1,
      increaseClicksPerMilk: () =>
        set((state) => ({ clicksPerMilk: state.clicksPerMilk + 1 })),
      decreaseMilkedCount: (amount) =>
        set((state) => ({ milkedCount: state.milkedCount - amount })),
      clicksToMilk: INITIAL_CLICKS_TO_MILK,
      increaseClicksToMilk: () =>
        set((state) => ({
          clicksToMilk: Math.ceil(state.clicksToMilk * 1.15),
        })),
      extraFingerCost: 10,
      increaseExtraFingerCost: () =>
        set((state) => ({
          extraFingerCost: Math.ceil(state.extraFingerCost * 1.5),
        })),
    }),
    {
      name: 'milk-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

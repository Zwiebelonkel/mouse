import { create } from 'zustand';

interface MilkState {
  milkedCount: number;
  increaseMilkedCount: () => void;
  clicksPerMilk: number;
  increaseClicksPerMilk: () => void;
  decreaseMilkedCount: (amount: number) => void;
}

export const useMilkStore = create<MilkState>((set) => ({
  milkedCount: 0,
  increaseMilkedCount: () => set((state) => ({ milkedCount: state.milkedCount + 1 })),
  clicksPerMilk: 1,
  increaseClicksPerMilk: () => set((state) => ({ clicksPerMilk: state.clicksPerMilk + 1 })),
  decreaseMilkedCount: (amount) =>
    set((state) => ({ milkedCount: state.milkedCount - amount })),
}));
'use client';

import { Button } from "@/components/ui/button";
import { useMilkStore } from "@/store/milk";
import { upgrades } from "@/data/upgrades";
import { useState } from "react";

// =============================================================
// ZAHL FORMATTER
// =============================================================
function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return Math.floor(num).toString();
}

interface UpgradeCardProps {
  id: string;
}

export default function UpgradeCard({ id }: UpgradeCardProps) {
  const upg = upgrades[id];
  const { milkedCount, upgradeLevels, buyUpgrade } = useMilkStore();

  const level = upgradeLevels[id] || 0;
  const cost = Math.floor(upg.baseCost * Math.pow(1.65, level));
  const canBuy = milkedCount >= cost && level < upg.maxLevel;

  const [flash, setFlash] = useState(false);

  const handleBuy = () => {
    if (buyUpgrade(id)) {
      setFlash(true);
      setTimeout(() => setFlash(false), 250);
    }
  };

  const Icon = upg.icon;

  return (
    <div
      className={`flex flex-col p-4 rounded-xl border bg-secondary/20 shadow-md transition-transform duration-200 ease-in-out hover:scale-105 ${
        flash ? "bg-accent/30 scale-[1.02]" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-accent" />
          <h3 className="font-bold text-lg">{upg.name}</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
          Lv. {level}/{upg.maxLevel}
        </span>
      </div>

      <p className="text-sm text-muted-foreground flex-grow ml-11">{upg.description}</p>

      <div className="mt-4">
        <p className="text-sm mb-2">
          Kosten: <strong>{formatNumber(cost)} 🥛</strong>
        </p>

        <Button
          onClick={handleBuy}
          disabled={!canBuy}
          className={`w-full transition-colors duration-200 ${
            canBuy
              ? "bg-accent text-accent-foreground hover:bg-accent/80"
              : "bg-destructive/40 cursor-not-allowed"
          }`}
        >
          Kaufen
        </Button>

        {!canBuy && level < upg.maxLevel && (
          <p className="text-xs text-center text-destructive mt-1">
            Dir fehlen {formatNumber(cost - milkedCount)} 🥛
          </p>
        )}

        {level >= upg.maxLevel && (
          <p className="text-xs text-center text-green-600 mt-1">MAX LEVEL</p>
        )}
      </div>
    </div>
  );
}
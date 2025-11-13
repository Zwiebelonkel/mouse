"use client";

import { Button } from "@/components/ui/button";
import { useMilkStore } from "@/store/milk";
import { upgrades } from "@/data/upgrades";
import { useState } from "react";

export default function UpgradeCard({ id }) {
  const upg = upgrades[id];
  const {
    milkedCount,
    upgradeLevels,
    buyUpgrade,
  } = useMilkStore();

  const level = upgradeLevels[id];
  const cost = Math.floor(upg.baseCost * Math.pow(1.65, level));
  const canBuy = milkedCount >= cost && level < upg.maxLevel;

  const [flash, setFlash] = useState(false);

  const handleBuy = () => {
    if (buyUpgrade(id)) {
      setFlash(true);
      setTimeout(() => setFlash(false), 250);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border bg-secondary/20 shadow-md transition ${
        flash ? "bg-accent/30 scale-[1.02]" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{upg.name}</h3>
        <span className="text-xs px-2 py-1 bg-accent rounded-full">
          Lv. {level}/{upg.maxLevel}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mt-1">
        {upg.description}
      </p>

      <p className="mt-2 text-sm">
        Kosten: <strong>{cost} 🥛</strong>
      </p>

      <Button
        onClick={handleBuy}
        disabled={!canBuy}
        className={`w-full mt-3 ${
          canBuy
            ? "bg-accent text-accent-foreground hover:bg-accent/80"
            : "bg-destructive/40 cursor-not-allowed"
        }`}
      >
        Upgrade kaufen
      </Button>

      {!canBuy && level < upg.maxLevel && (
        <p className="text-xs text-destructive mt-1">
          Es fehlen {cost - milkedCount} 🥛
        </p>
      )}

      {level >= upg.maxLevel && (
        <p className="text-xs text-green-600 mt-1">MAX LEVEL erreicht</p>
      )}
    </div>
  );
}
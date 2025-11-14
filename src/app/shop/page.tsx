'use client';

import UpgradeCard from "@/components/upgrade/UpgradeCard";
import { upgrades } from "@/data/upgrades";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMilkStore } from "@/store/milk";
import { Milk } from "lucide-react";

export default function ShopPage() {
  const { milkedCount } = useMilkStore();

  return (
    <main className="min-h-screen bg-background font-body p-6 sm:p-8 md:p-12">
      <div className="fixed top-6 right-6 z-10 flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 font-bold shadow-inner text-lg">
          <Milk className="h-6 w-6" />
          <span>{milkedCount}</span>
        </div>
        <Link href="/">
          <Button>Zurück</Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold font-headline mb-2">Milch Shop</h1>
      <p className="text-muted-foreground mb-8">
        Kaufe Upgrades, um deine Milchausbeute zu steigern.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {Object.keys(upgrades).map((id) => (
          <UpgradeCard key={id} id={id} />
        ))}
      </div>
    </main>
  );
}

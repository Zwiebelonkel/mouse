'use client';

import UpgradeCard from "@/components/upgrade/UpgradeCard";
import { upgrades } from "@/data/upgrades";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShopPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-background font-body">

      <h1 className="text-4xl font-bold mb-6 font-headline">Milch Shop</h1>

      <div className="grid gap-4 w-full max-w-md">
        {Object.keys(upgrades).map((id) => (
          <UpgradeCard key={id} id={id} />
        ))}
      </div>

      <Link href="/" className="mt-8">
        <Button>Zurück</Button>
      </Link>
    </main>
  );
}
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMilkStore } from '@/store/milk';
import Link from 'next/link';

export default function Shop() {
  const {
    milkedCount,
    clicksPerMilk,
    increaseClicksPerMilk,
    decreaseMilkedCount,
    extraFingerCost,
    increaseExtraFingerCost,
  } = useMilkStore();

  const handleUpgrade = () => {
    if (milkedCount >= extraFingerCost) {
      decreaseMilkedCount(extraFingerCost);
      increaseClicksPerMilk();
      increaseExtraFingerCost();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-sm text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl font-bold tracking-tight">
            Milch Shop
          </CardTitle>
          <CardDescription>Ihre Milch: {milkedCount}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleUpgrade}
              disabled={milkedCount < extraFingerCost}
              size="lg"
            >
              Extra Finger (Kosten: {extraFingerCost} Milch)
            </Button>
            <p className="text-sm text-muted-foreground">
              Derzeitige Melk-Kraft: {clicksPerMilk}
            </p>
          </div>
          <Link href="/">
            <Button>Zurück</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

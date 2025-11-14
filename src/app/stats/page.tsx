'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMilkStore } from '@/store/milk';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ArrowLeft, BarChart3, KeyRound, Milk } from 'lucide-react';

const SECRET_CODE = '5739';
const SECRET_REWARD = 1_000_000;

export default function StatsPage() {
  const {
    milkedCount,
    totalMilkedCount,
    clicksPerMilk,
    autoClick,
    passiveMilk,
    clicksToMilk,
    comboDecayReduction,
    maxMultiplierBonus,
    baseMultiplierBonus,
    upgradeLevels,
  } = useMilkStore();

  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const totalUpgrades = Object.values(upgradeLevels || {}).reduce(
    (sum, lvl) => sum + (lvl ?? 0),
    0
  );

  const handleDigit = (digit: string) => {
    setMessage(null);
    setIsError(false);
    setCode((prev) => (prev.length >= 8 ? prev : prev + digit));
  };

  const handleClear = () => {
    setCode('');
    setMessage(null);
    setIsError(false);
  };

  const handleSubmit = () => {
    if (code === SECRET_CODE) {
      useMilkStore.setState((state) => ({
        milkedCount: state.milkedCount + SECRET_REWARD,
        totalMilkedCount: state.totalMilkedCount + SECRET_REWARD,
      }));
      setMessage(`Geheimer Bonus aktiviert! +${SECRET_REWARD.toLocaleString('de-DE')} Milch 🥛`);
      setIsError(false);
      setCode('');
    } else {
      setMessage('Falscher Code. Versuche es erneut.');
      setIsError(true);
      setCode('');
    }
  };

  const displayCode =
    code.length === 0 ? '—' : '•'.repeat(code.length);

  return (
    <main className="min-h-screen bg-background p-4 font-body flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="flex items-center gap-2 text-3xl font-bold font-headline">
            <BarChart3 className="h-7 w-7 text-accent" />
            Statistiken
          </h1>
          <div className="w-10" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* STATS CARD */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Milk className="h-6 w-6 text-accent" />
                Übersicht
              </CardTitle>
              <CardDescription>
                Alle wichtigen Werte deines Mouse Milkers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Aktuelle Milch
                </span>
                <span className="font-semibold">
                  {milkedCount.toFixed(0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Insgesamt gemolkene Mäuse
                </span>
                <span className="font-semibold">
                  {totalMilkedCount.toFixed(0)}
                </span>
              </div>

              <div className="border-t my-2" />

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Klicks pro Klick
                </span>
                <span className="font-semibold">
                  {clicksPerMilk.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Auto-Clicks / Sekunde
                </span>
                <span className="font-semibold">
                  {autoClick.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Passive Milch / Sekunde
                </span>
                <span className="font-semibold">
                  {(passiveMilk / 60).toFixed(2)}
                </span>
              </div>

              <div className="border-t my-2" />

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Klicks zum nächsten Melken
                </span>
                <span className="font-semibold">
                  {clicksToMilk.toFixed(0)}
                </span>
              </div>

              <div className="border-t my-2" />

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Basis-Multiplikator-Bonus
                </span>
                <span className="font-semibold">
                  +{baseMultiplierBonus.toFixed(2)}×
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Max. Multiplikator-Bonus
                </span>
                <span className="font-semibold">
                  +{maxMultiplierBonus.toFixed(2)}×
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Combo-Verfallsreduktion
                </span>
                <span className="font-semibold">
                  {comboDecayReduction.toFixed(2)}
                </span>
              </div>

              <div className="border-t my-2" />

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Gekaufte Upgrades (gesamt)
                </span>
                <span className="font-semibold">
                  {totalUpgrades}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* SECRET CODE CARD */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-accent" />
                Geheimer Code
              </CardTitle>
              <CardDescription>
                Tippe den geheimen Code ein, um einen Bonus zu erhalten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Anzeige des Codes */}
              <div className="mb-4 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  Eingegebener Code
                </span>
                <div className="rounded-lg border px-4 py-2 text-lg font-mono tracking-[0.3em] bg-muted/40">
                  {displayCode}
                </div>
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1,2,3,4,5,6,7,8,9].map((n) => (
                  <Button
                    key={n}
                    variant="outline"
                    className="h-12 text-lg font-semibold"
                    onClick={() => handleDigit(String(n))}
                  >
                    {n}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  className="h-12 text-sm"
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleDigit('0')}
                >
                  0
                </Button>
                <Button
                  variant="default"
                  className="h-12 text-sm"
                  onClick={handleSubmit}
                >
                  OK
                </Button>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mt-2 text-sm text-center ${
                    isError ? 'text-red-500' : 'text-emerald-500'
                  }`}
                >
                  {message}
                </div>
              )}

              {!message && (
                <p className="mt-1 text-[11px] text-muted-foreground text-center">
                  Tipp: Der Code ist geheim. Vielleicht &quot;5739&quot;? 👀
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Rat, ShoppingCart, RefreshCcw, Milk } from 'lucide-react';
import Link from 'next/link';
import { useMilkStore } from '@/store/milk';
import confetti from "canvas-confetti/dist/confetti.module.mjs";

const startSounds = [
  '/mouse/sounds/start1.mp3',
  '/mouse/sounds/start2.mp3',
  '/mouse/sounds/start3.mp3',
  '/mouse/sounds/start4.mp3',
];

const successSounds = [
  '/mouse/sounds/sucess.mp3',
  '/mouse/sounds/sucess2.mp3',
  '/mouse/sounds/sucess3.mp3',
  '/mouse/sounds/sucess4.mp3',
  '/mouse/sounds/sucess5.mp3',
  '/mouse/sounds/sucess6.mp3',
];

const warningSounds = [
  '/mouse/sounds/warning.mp3',
  '/mouse/sounds/warning1.mp3',
  '/mouse/sounds/warning2.mp3',
  '/mouse/sounds/warning3.mp3',
  '/mouse/sounds/warning4.mp3',
  '/mouse/sounds/warning5.mp3',
  '/mouse/sounds/warning6.mp3',
  '/mouse/sounds/warning7.mp3',
  '/mouse/sounds/warning8.mp3',
];

export default function Home() {
  const [clicks, setClicks] = useState(0);

  const {
    milkedCount,
    totalMilkedCount,
    increaseMilkedCount,
    clicksPerMilk,
    clicksToMilk,
    increaseClicksToMilk,
  } = useMilkStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasMilkedThisRound, setHasMilkedThisRound] = useState(false);

  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentlyPlayingSound = useRef<HTMLAudioElement | null>(null);

  // ========= MULTIPLIKATOR =========
  const [multiplier, setMultiplier] = useState(1);
  const [comboTimeout, setComboTimeout] = useState<NodeJS.Timeout | null>(null);
  const [comboProgress, setComboProgress] = useState(1);

  const comboTimeWindow = 400; // ms Zwischenraum

  const increaseMultiplier = () => {
    setMultiplier((prev) => {
      if (prev >= 2) return 2;
      if (prev < 1.1) return 1.1;
      if (prev < 1.25) return 1.25;
      if (prev < 1.5) return 1.5;
      return 2;
    });
    setComboProgress(1);
  };

  const resetMultiplier = () => {
    setMultiplier(1);
    setComboProgress(0);
  };

  // Combo-Bar countdown
  useEffect(() => {
    if (multiplier === 1) return;

    const interval = setInterval(() => {
      setComboProgress((prev) => {
        const next = prev - 0.02;
        if (next <= 0) {
          resetMultiplier();
          return 0;
        }
        return next;
      });
    }, comboTimeWindow / 50);

    return () => clearInterval(interval);
  }, [multiplier]);

  // Mini-Milk Partikel
  const fireMiniMilkParticles = () => {
    confetti({
      particleCount: 10,
      spread: 30,
      startVelocity: 25,
      gravity: 1,
      ticks: 80,
      colors: ['#ffffff'],
      shapes: ['circle'],
      origin: { y: 0.65 },
    });
  };

  // Großes Milch-Konfetti
  const fireMilkConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      startVelocity: 30,
      gravity: 0.8,
      ticks: 180,
      colors: ['#ffffff'],
      shapes: ['circle'],
      origin: { y: 0.6 },
    });

    confetti({
      particleCount: 25,
      spread: 100,
      startVelocity: 20,
      gravity: 0.9,
      colors: ['#ffffff'],
      shapes: ['circle'],
      origin: { y: 0.6 },
    });
  };

  // Sound Player
  const playRandomSound = (sounds: string[]) => {
    if (currentlyPlayingSound.current) {
      currentlyPlayingSound.current.pause();
      currentlyPlayingSound.current.currentTime = 0;
    }
    const sound = new Audio(
      sounds[Math.floor(Math.random() * sounds.length)],
    );
    sound.play();
    currentlyPlayingSound.current = sound;
  };

  useEffect(() => {
    setIsMounted(true);

    return () => {
      if (currentlyPlayingSound.current) {
        currentlyPlayingSound.current.pause();
        currentlyPlayingSound.current.currentTime = 0;
      }
    };
  }, []);

  // Erfolgssound abspielen
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0) {
      playRandomSound(successSounds);
    }
  }, [clicks, clicksToMilk]);

  // Erfolg → Milch + Konfetti
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0 && !hasMilkedThisRound) {
      increaseMilkedCount();
      setHasMilkedThisRound(true);

      fireMilkConfetti();
      triggerShake();
    }
  }, [
    clicks,
    clicksToMilk,
    hasMilkedThisRound,
    increaseMilkedCount,
  ]);

  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 150);
  };

  const handleMouseClick = () => {
    if (clicks < clicksToMilk) {
      const clickSound = new Audio('/mouse/sounds/click.mp3');
      clickSound.play();

      // Multiplikator
      if (comboTimeout) clearTimeout(comboTimeout);

      increaseMultiplier();

      const newTimeout = setTimeout(() => resetMultiplier(), comboTimeWindow);
      setComboTimeout(newTimeout);

      fireMiniMilkParticles();

      setClicks((prev) => prev + clicksPerMilk * multiplier);

      setIsFlipped((prev) => !prev);
      resetWarningTimeout();
    }
  };

  const handlePlayAgain = () => {
    playRandomSound(startSounds);
    setClicks(0);
    increaseClicksToMilk();
    setHasMilkedThisRound(false);
    resetMultiplier();
    resetWarningTimeout();
  };

  const resetWarningTimeout = () => {
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => {
      playRandomSound(warningSounds);
    }, 10000);
  };

  useEffect(() => {
    resetWarningTimeout();

    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  const milked = clicks >= clicksToMilk;
  const progress = isMounted ? Math.min(clicks / clicksToMilk, 1) : 0;

  const mouseGlow =
    multiplier >= 2
      ? 'drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] animate-pulse'
      : multiplier >= 1.5
      ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]'
      : '';

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background p-4 font-body overflow-hidden">

      {/* SHOP */}
      <div className="fixed top-4 right-4 z-[20]">
        <Link href="/shop">
          <Button>
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* MILCH CONTAINER */}
      <div className="fixed bottom-4 right-4 z-[999] h-48 w-10 rounded-lg border-4 border-gray-400 bg-gray-200/50 backdrop-blur-sm flex flex-col justify-end overflow-hidden">
        <div
          className="bg-white transition-all duration-500 ease-in-out"
          style={{ height: `${progress * 100}%` }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground">
            {isMounted ? milkedCount : 0}
          </span>
        </div>
      </div>

      {/* GAME AREA – nur dieser Bereich shake't */}
      <div className={`game-area ${isShaking ? "screenshake" : ""}`}>
        <Card className="w-full max-w-sm text-center shadow-2xl relative z-[10]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-4xl font-bold tracking-tight font-headline">
              <Rat className="h-8 w-8" /> Mouse Milker
            </CardTitle>
            <CardDescription>
              {milked
                ? 'You did it!'
                : `Bitte melken Sie die Maus (Mäuse gemolken: ${totalMilkedCount})`}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center p-6">
            {milked ? (
              <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in">
                <div className="rounded-xl bg-accent p-6 shadow-inner">
                  <p className="flex items-center gap-2 text-2xl font-bold text-accent-foreground">
                    <Milk className="h-6 w-6" /> Du hast die Maus gemolken!
                  </p>
                </div>
                <Button onClick={handlePlayAgain} size="lg">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Erneut melken
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onMouseDown={handleMouseClick}
                  className="cursor-pointer rounded-full p-4 transition-transform duration-150 ease-in-out active:scale-90"
                  aria-label="Milk the mouse"
                >
                  <Rat
                    className={`h-40 w-40 transition-transform duration-200 ${
                      isFlipped ? "scale-x-[-1]" : ""
                    } ${mouseGlow}`}
                  />
                </button>

                {/* COMBO BAR */}
                <div className="w-40 h-2 bg-gray-300 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${comboProgress * 100}%` }}
                  ></div>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  {multiplier.toFixed(2)}× Combo
                </p>

                <div className="text-center">
                  <p className="text-5xl font-bold text-foreground">
                    {Math.floor(clicks)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {clicks === 0
                      ? `Click the mouse ${clicksToMilk} times!`
                      : `${
                          clicksToMilk - clicks > 0
                            ? Math.round(clicksToMilk - clicks)
                            : 0
                        } more clicks to go!`}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

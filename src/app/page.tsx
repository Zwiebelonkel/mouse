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

  // Erfolgssound, wenn Ziel erreicht
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0) {
      playRandomSound(successSounds);
    }
  }, [clicks, clicksToMilk]);

  // Milch-Counter direkt beim Abschließen erhöhen (nur einmal pro Runde)
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0 && !hasMilkedThisRound) {
      increaseMilkedCount();
      setHasMilkedThisRound(true);
    }
  }, [clicks, clicksToMilk, hasMilkedThisRound, increaseMilkedCount]);

  const handleMouseClick = () => {
    if (clicks < clicksToMilk) {
      const clickSound = new Audio('/mouse/sounds/click.mp3');
      clickSound.play();
      setClicks((prev) => prev + clicksPerMilk);
      setIsFlipped((prev) => !prev);
      resetWarningTimeout();
    }
  };

  const handlePlayAgain = () => {
    playRandomSound(startSounds);
    setClicks(0);
    increaseClicksToMilk();
    setHasMilkedThisRound(false);
    resetWarningTimeout();
  };

  const resetWarningTimeout = () => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      playRandomSound(warningSounds);
    }, 10000);
  };

  useEffect(() => {
    resetWarningTimeout();
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  const milked = clicks >= clicksToMilk;

  // Fortschritt des aktuellen Runs (0–100 %)
  const progress = isMounted
    ? Math.min(clicks / clicksToMilk, 1)
    : 0;

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background p-4 font-body overflow-hidden">
      {/* Shop-Button */}
      <div className="fixed top-4 right-4 z-[99999]">
        <Link href="/shop">
          <Button>
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Milch-Container rechts unten */}
      <div className="fixed bottom-4 right-4 z-[99999] h-48 w-10 rounded-lg border-4 border-gray-400 bg-gray-200/50 backdrop-blur-sm flex flex-col justify-end relative overflow-hidden">
        <div
          className="bg-white transition-all duration-500 ease-in-out"
          style={{ height: `${progress * 100}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-black">
            {isMounted ? milkedCount : 0}
          </span>
        </div>
      </div>

      {/* Hauptkarte */}
      <Card className="w-full max-w-sm text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl font-bold tracking-tight flex items-center justify-center gap-2">
            <Rat className="h-8 w-8" /> Mouse Milker
          </CardTitle>
          <CardDescription>
            {milked
              ? 'You did it!'
              : `Bitte melken Sie die Maus (Mäuse gemolken: ${totalMilkedCount})`}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex h-80 flex-col items-center justify-center p-6">
          {milked ? (
            <div className="flex animate-in fade-in zoom-in flex-col items-center gap-6">
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
                  className={`h-40 w-40 text-primary drop-shadow-lg transition-transform duration-200 ${
                    isFlipped ? 'scale-x-[-1]' : ''
                  }`}
                />
              </button>
              <div className="text-center">
                <p className="text-5xl font-bold text-foreground">
                  {clicks}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {clicks === 0
                    ? `Click the mouse ${clicksToMilk} times!`
                    : `${
                        clicksToMilk - clicks > 0
                          ? clicksToMilk - clicks
                          : 0
                      } more clicks to go!`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
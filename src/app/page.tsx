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
import { Rat } from 'lucide-react';
import Link from 'next/link';
import { useMilkStore } from '@/store/milk';

const startSounds = ['/mouse/sounds/start1.mp3', '/mouse/sounds/start2.mp3', '/mouse/sounds/start3.mp3', '/mouse/sounds/start4.mp3'];
const successSounds = ['/mouse/sounds/sucess.mp3', '/mouse/sounds/sucess2.mp3', '/mouse/sounds/sucess3.mp3', '/mouse/sounds/sucess4.mp3', '/mouse/sounds/sucess5.mp3', '/mouse/sounds/sucess6.mp3'];
const warningSounds = ['/mouse/sounds/warning.mp3', '/mouse/sounds/warning1.mp3', '/mouse/sounds/warning2.mp3', '/mouse/sounds/warning3.mp3', '/mouse/sounds/warning4.mp3', '/mouse/sounds/warning5.mp3', '/mouse/sounds/warning6.mp3', '/mouse/sounds/warning7.mp3', '/mouse/sounds/warning8.mp3'];

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
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playRandomSound = (sounds: string[]) => {
    const sound = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    sound.play();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-darker', 'theme-darkest', 'theme-uncanny');

    if (totalMilkedCount >= 10) {
      root.classList.add('theme-uncanny');
    } else if (totalMilkedCount >= 7) {
      root.classList.add('theme-darkest');
    } else if (totalMilkedCount >= 4) {
      root.classList.add('theme-darker');
    } else if (totalMilkedCount >= 2) {
      root.classList.add('dark');
    }
  }, [totalMilkedCount]);

  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0) {
      playRandomSound(successSounds);
    }
  }, [clicks, clicksToMilk]);

  const handleMouseClick = () => {
    if (clicks < clicksToMilk) {
      const clickSound = new Audio('/mouse/sounds/click.mp3');
      clickSound.play();
      setClicks(clicks + clicksPerMilk);
      setIsFlipped(!isFlipped);
      resetWarningTimeout();
    }
  };

  const handlePlayAgain = () => {
    playRandomSound(startSounds);
    setClicks(0);
    increaseMilkedCount();
    increaseClicksToMilk();
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      <div className="fixed top-4 right-4 z-[99999]">
        <Link href="/shop">
          <Button>Shop</Button>
        </Link>
      </div>
      <div className="fixed bottom-4 right-4 z-[99999] w-10 h-48 border-4 border-gray-400 rounded-lg bg-gray-200/50 backdrop-blur-sm flex flex-col justify-end">
        <div
          className="bg-white transition-all duration-500 ease-in-out"
          style={{ height: `${milkedCount * 10}%` }}
        ></div>
      </div>
      <Card className="w-full max-w-sm text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl font-bold tracking-tight">
            Mouse Milker
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
                <p className="text-2xl font-bold text-accent-foreground">
                  You milked the mouse!
                </p>
              </div>
              <Button onClick={handlePlayAgain} size="lg">
                Milk Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onMouseDown={handleMouseClick}
                className="rounded-full p-4 transition-transform duration-150 ease-in-out active:scale-90 cursor-pointer"
                aria-label="Milk the mouse"
              >
                <Rat
                  className={`h-40 w-40 text-primary drop-shadow-lg transition-transform duration-200 ${isFlipped ? 'scale-x-[-1]' : ''
                    }`}
                />
              </button>
              <div className="text-center">
                <p className="text-5xl font-bold text-foreground">{clicks}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {clicks === 0
                    ? `Click the mouse ${clicksToMilk} times!`
                    : `${clicksToMilk - clicks > 0 ? clicksToMilk - clicks : 0} more clicks to go!`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

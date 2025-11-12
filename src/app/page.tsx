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

const INITIAL_CLICKS_TO_MILK = 10;

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [clicksToMilk, setClicksToMilk] = useState(INITIAL_CLICKS_TO_MILK);
  const { milkedCount, increaseMilkedCount, clicksPerMilk } = useMilkStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const successSoundRef = useRef<HTMLAudioElement>(null);
  const newMouseSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-darker', 'theme-darkest', 'theme-uncanny');

    if (milkedCount >= 10) {
      root.classList.add('theme-uncanny');
    } else if (milkedCount >= 7) {
      root.classList.add('theme-darkest');
    } else if (milkedCount >= 4) {
      root.classList.add('theme-darker');
    } else if (milkedCount >= 2) {
      root.classList.add('dark');
    }
  }, [milkedCount]);

  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0) {
      successSoundRef.current?.play();
    }
  }, [clicks, clicksToMilk]);

  const handleMouseClick = () => {
    if (clicks < clicksToMilk) {
      clickSoundRef.current?.play();
      setClicks(clicks + clicksPerMilk);
      setIsFlipped(!isFlipped);
    }
  };

  const handlePlayAgain = () => {
    newMouseSoundRef.current?.play();
    setClicks(0);
    increaseMilkedCount();
    setClicksToMilk(Math.ceil(clicksToMilk * 1.15));
  };

  const milked = clicks >= clicksToMilk;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      {isMounted && (
        <>
          <audio ref={clickSoundRef} src="/sounds/click.mp3" preload="auto" />
          <audio ref={successSoundRef} src="/sounds/sucess.mp3" preload="auto" />
          <audio ref={newMouseSoundRef} src="/sounds/plase.mp3" preload="auto" />
        </>
      )}
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
              : `Bitte melken Sie die Maus (Mäuse gemolken: ${milkedCount})`}
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
                onClick={handleMouseClick}
                className="rounded-full p-4 transition-transform duration-150 ease-in-out active:scale-90"
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

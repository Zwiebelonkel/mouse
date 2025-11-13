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

// =============================================================
// iPHONE AUDIO UNLOCK
// =============================================================
function unlockIOSAudio() {
  const empty = new Audio();
  empty.play().catch(() => {});
}

// =============================================================
// GLOBAL EXCLUSIVE AUDIO CHANNEL
// =============================================================
const exclusiveChannel = {
  current: null as HTMLAudioElement | null,

  stop() {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.current = null;
    }
  },

  play(audio: HTMLAudioElement) {
    this.stop();
    this.current = audio;
    audio.play();
  }
};

// =============================================================
// SOUND ENGINE
// =============================================================
function useSoundPool(
  paths: string[],
  getPlaybackRate?: () => number,
  exclusive: boolean = false
) {
  const poolRef = useRef<HTMLAudioElement[]>([]);
  const loadedRef = useRef(false);

  const loadAudio = () => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    poolRef.current = paths.map((p) => {
      const audio = new Audio(p);
      audio.load();
      return audio;
    });
  };

  // Laden erst nach echter User-Interaktion (iPhone-tauglich)
  useEffect(() => {
    const enable = () => {
      loadAudio();
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("mousedown", enable);
    };

    window.addEventListener("touchstart", enable, { once: true });
    window.addEventListener("mousedown", enable, { once: true });

    return () => {
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("mousedown", enable);
    };
  }, []);

  const play = () => {
    if (!loadedRef.current || poolRef.current.length === 0) return;

    const base =
      poolRef.current[Math.floor(Math.random() * poolRef.current.length)];

    const audio = base.cloneNode(true) as HTMLAudioElement;

    if (getPlaybackRate) audio.playbackRate = getPlaybackRate();

    if (exclusive) {
      exclusiveChannel.play(audio);
    } else {
      audio.play();
    }
  };

  return play;
}

// =============================================================
// SOUND LISTS
// =============================================================
const startSounds = [
  '/mouse/sounds/start1.mp3',
  '/mouse/sounds/start2.mp3',
  '/mouse/sounds/start3.mp3',
  '/mouse/sounds/start4.mp3',
  '/mouse/sounds/start5.mp3',
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

const finishSounds = ['/mouse/sounds/finish1.wav'];
const mouseSounds = ['/mouse/sounds/mouse.wav'];

// =============================================================
// MAIN COMPONENT
// =============================================================
export default function Home() {

  // =============================================================
  // LOAD STORE VALUES
  // =============================================================
  const {
    milkedCount,
    totalMilkedCount,
    increaseMilkedCount,
    clicksPerMilk,
    clicksToMilk,
    increaseClicksToMilk,

    // NEW UPGRADE EFFECTS
    startMultiplier,
    maxMultiplierCap,
    comboDecaySpeed,

    milkPerSecond,
  } = useMilkStore();

  // =============================================================
  // PASSIVE INCOME
  // =============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      if (milkPerSecond > 0) {
        useMilkStore.getState().increaseMilkedCountPassive();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [milkPerSecond]);


  // =============================================================
  // DYNAMIC PITCH
  // =============================================================
  const getDeepPitch = () => {
    return Math.max(0.7, 1 - totalMilkedCount * 0.005);
  };

  // =============================================================
  // SOUNDS
  // =============================================================
  const playStartSound   = useSoundPool(startSounds, getDeepPitch, true);
  const playSuccessSound = useSoundPool(successSounds, getDeepPitch, true);
  const playWarningSound = useSoundPool(warningSounds, getDeepPitch, true);

  const playClickSound   = useSoundPool(['/mouse/sounds/click.mp3'], undefined, false);
  const playFinishSound  = useSoundPool(finishSounds, undefined, false);
  const playMouseSound   = useSoundPool(mouseSounds, undefined, false);


  // =============================================================
  // STATE
  // =============================================================
  const [clicks, setClicks] = useState(0);

  const [isMounted, setIsMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasMilkedThisRound, setHasMilkedThisRound] = useState(false);

  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================
  // SCREENSHAKE
  // =============================================================
  const [isShaking, setIsShaking] = useState(false);
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 150);
  };

  // =============================================================
  // COMBO SYSTEM
  // =============================================================
  const [multiplier, setMultiplier] = useState(startMultiplier);
  const [comboTimeout, setComboTimeout] = useState<NodeJS.Timeout | null>(null);
  const [comboProgress, setComboProgress] = useState(1);

  const increaseMultiplier = () => {
    setMultiplier((prev) => {
      const next = prev + 0.25;
      return Math.min(next, maxMultiplierCap);
    });
    setComboProgress(1);
  };

  const resetMultiplier = () => {
    setMultiplier(startMultiplier);
    setComboProgress(0);
  };

  useEffect(() => {
    if (multiplier <= startMultiplier) return;

    const interval = setInterval(() => {
      setComboProgress((prev) => {
        const next = prev - comboDecaySpeed;
        if (next <= 0) {
          resetMultiplier();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [multiplier, comboDecaySpeed, startMultiplier]);


  // =============================================================
  // CONFETTI
  // =============================================================
  const fireMiniMilkParticles = () => {
    confetti({
      particleCount: 10,
      spread: 140,
      startVelocity: 25,
      gravity: 1,
      ticks: 80,
      colors: ['#ffffff'],
      shapes: ['circle'],
      origin: { y: 0.5 },
    });
  };

  const fireMilkConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      startVelocity: 35,
      gravity: 0.8,
      ticks: 200,
      colors: ['#ffffff'],
      shapes: ['circle'],
      origin: { y: 0.5 },
    });
  };

  // =============================================================
  // EFFECTS
  // =============================================================
  useEffect(() => {
    const audio = new Audio('/mouse/sounds/theme.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(() => {});

    return () => audio.pause();
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const unlock = () => {
      unlockIOSAudio();
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("mousedown", unlock);
    };

    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("mousedown", unlock, { once: true });

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("mousedown", unlock);
    };
  }, []);

  // SUCCESS SOUND
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0 && !hasMilkedThisRound) {
      playSuccessSound();
      playFinishSound();
    }
  }, [clicks, clicksToMilk, hasMilkedThisRound]);

  // SUCCESS → MILK + EFFECTS
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0 && !hasMilkedThisRound) {
      increaseMilkedCount();
      setHasMilkedThisRound(true);

      fireMilkConfetti();
      triggerShake();
    }
  }, [clicks, clicksToMilk, hasMilkedThisRound, increaseMilkedCount]);


  // =============================================================
  // WARNING TIMER
  // =============================================================
  const resetWarningTimeout = () => {
    if (warningTimeoutRef.current)
      clearTimeout(warningTimeoutRef.current);

    warningTimeoutRef.current = setTimeout(() => {
      playWarningSound();
    }, 8000);
  };

  useEffect(() => {
    resetWarningTimeout();
    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, []);


  // =============================================================
  // CLICK LOGIC
  // =============================================================
  const handleMouseClick = () => {
    if (clicks < clicksToMilk) {
      playClickSound();

      if (Math.random() < 0.1) {
        playMouseSound();
      }

      increaseMultiplier();

      fireMiniMilkParticles();

      setClicks(prev => prev + clicksPerMilk * multiplier);

      setIsFlipped(prev => !prev);

      resetWarningTimeout();
    }
  };

  const handlePlayAgain = () => {
    playStartSound();
    setClicks(0);
    setHasMilkedThisRound(false);
    increaseClicksToMilk();
    resetMultiplier();
    resetWarningTimeout();
  };


  // SPACEBAR SUPPORT
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") handleMouseClick();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });


  // =============================================================
  // UI VALUES
  // =============================================================
  const milked = clicks >= clicksToMilk;

  const progress = isMounted
    ? Math.min(clicks / clicksToMilk, 1)
    : 0;

  const mouseGlow =
    multiplier >= maxMultiplierCap
      ? "drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] animate-pulse"
      : multiplier >= maxMultiplierCap * 0.75
      ? "drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
      : multiplier >= maxMultiplierCap * 0.5
      ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
      : "";


  // =============================================================
  // RENDER
  // =============================================================
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background p-4 font-body overflow-hidden">

      {/* SHOP BUTTON */}
      <div className="fixed top-4 right-4 z-[20]">
        <Link href="/shop">
          <Button>
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* PASSIVE INCOME COUNTER */}
      {milkPerSecond > 0 && (
        <div className="fixed top-4 left-4 text-accent text-sm font-bold z-[30]">
          +{milkPerSecond}/s
        </div>
      )}

      {/* MILK CONTAINER */}
      <div className="fixed bottom-4 right-4 z-[999] h-48 w-10 rounded-lg border-4 border-gray-400 bg-gray-200/50 backdrop-blur-sm flex flex-col justify-end overflow-hidden">
        <div
          className="bg-white transition-all duration-500 ease-in-out"
          style={{ height: `${progress * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground">
            {milkedCount}
          </span>
        </div>
      </div>

      {/* GAME AREA */}
      <div className={`game-area ${isShaking ? "screenshake" : ""}`}>
        <Card className="w-full max-w-sm text-center shadow-2xl relative z-[10]">

          <CardHeader>
            <CardTitle className="text-accent flex items-center justify-center gap-2 text-4xl font-bold font-headline">
              <Rat className="h-8 w-8" /> Mouse Milker
            </CardTitle>

            <CardDescription>
              {milked
                ? "You did it!"
                : `Bitte melken Sie die Maus (Mäuse gemolken: ${totalMilkedCount})`}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center p-6">

            {milked ? (
              <div className="flex flex-col items-center gap-6">
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
                >
                  <Rat
                    className={`h-40 w-40 transition-transform duration-200 ${
                      isFlipped ? "scale-x-[-1]" : ""
                    } ${mouseGlow}`}
                  />
                </button>

                {/* Combo Bar */}
                <div className="w-40 h-2 bg-accent/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${comboProgress * 100}%` }}
                  />
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
                      : `${Math.max(0, Math.round(clicksToMilk - clicks))} more clicks to go!`}
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
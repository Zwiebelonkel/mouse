'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rat, ShoppingCart, RefreshCcw, Milk, BarChart3, Zap, Moon, Flame, Snowflake, Shield, Aperture } from "lucide-react";import Link from "next/link";
import { useMilkStore } from "@/store/milk";
import confetti from "canvas-confetti/dist/confetti.module.mjs";
import AudioToggle from "@/components/AudioToggle";
import { BOSSES } from "@/bosses/bosses";

// =============================================================
// ZAHL FORMATTER
// =============================================================
function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return Math.floor(num).toString();
}

// =============================================================
// iPHONE AUDIO UNLOCK
// =============================================================
function unlockIOSAudio() {
  if (useMilkStore.getState().isMuted) return;
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
    this.current = audio;
    audio.play().catch(() => {}); // ✅ Catch DOMException
  },
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
    if (useMilkStore.getState().isMuted) return;
    if (!loadedRef.current || poolRef.current.length === 0) return;

    const original =
      poolRef.current[Math.floor(Math.random() * poolRef.current.length)];

    const audio = original.cloneNode(true) as HTMLAudioElement;

    if (getPlaybackRate) audio.playbackRate = getPlaybackRate();

    if (exclusive) {
      exclusiveChannel.stop(); // ✅ Stoppe vorherigen Sound BEVOR neuer startet
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
  "/mouse/sounds/start1.mp3",
  "/mouse/sounds/start2.mp3",
  "/mouse/sounds/start3.mp3",
  "/mouse/sounds/start4.mp3",
  "/mouse/sounds/start5.mp3",
  "/mouse/sounds/start6.mp3",
  "/mouse/sounds/start7.mp3",
];

const successSounds = [
  "/mouse/sounds/sucess.mp3",
  "/mouse/sounds/sucess2.mp3",
  "/mouse/sounds/sucess3.mp3",
  "/mouse/sounds/sucess4.mp3",
  "/mouse/sounds/sucess5.mp3",
  "/mouse/sounds/sucess6.mp3",
  "/mouse/sounds/sucess7.mp3",
  "/mouse/sounds/sucess8.mp3",
  "/mouse/sounds/sucess10.mp3",
];

const finishSounds = ["/mouse/sounds/finish1.wav"];
const mouseSound = ["/mouse/sounds/mouse.wav"];
const bossClickSounds = ["/mouse/sounds/warning.mp3", "/mouse/sounds/warning1.mp3"];

const warningSounds = [
  "/mouse/sounds/warning.mp3",
  "/mouse/sounds/warning1.mp3",
  "/mouse/sounds/warning2.mp3",
  "/mouse/sounds/warning3.mp3",
  "/mouse/sounds/warning4.mp3",
  "/mouse/sounds/warning5.mp3",
  "/mouse/sounds/warning6.mp3",
  "/mouse/sounds/warning7.mp3",
  "/mouse/sounds/warning8.mp3",
  "/mouse/sounds/warning9.mp3",
  "/mouse/sounds/warning10.mp3",
  "/mouse/sounds/warning11.mp3",
];

export default function Home() {
  const [bossTimer, setBossTimer] = useState(0);
  const [bossResult, setBossResult] = useState<null | "win" | "lose">(null);
  const [defeatedBossName, setDefeatedBossName] = useState<string>("");

  
  const {
    milkedCount,
    totalMilkedCount,
    increaseMilkedCount,
    clicksPerMilk,
    clicksToMilk,
    autoClick,
    increaseClicksToMilk,
    baseMultiplierBonus,
    maxMultiplierBonus,
    comboDecayReduction,
    passiveMilk,
    isMuted,
    bossCounter,
    activeBoss,
    bossClicks,
    increaseBossCounter,
    activateBoss,
    increaseBossClicks,
    resetBoss,
    resetBossCounter,
  } = useMilkStore();

  // =============================================================
  // SOUND POOLS
  // =============================================================
  const playStartSound = useSoundPool(startSounds, undefined, true);
  const playSuccessSound = useSoundPool(successSounds, undefined, true);
  const playWarningSound = useSoundPool(warningSounds, undefined, true);
  const playBossSound = useSoundPool(
    activeBoss ? [activeBoss.sound] : [],
    undefined,
    true
  );
  const playBossClickSound = useSoundPool(bossClickSounds, undefined, false);

  const playClickSound = useSoundPool(["/mouse/sounds/click.mp3"], undefined, false);
  const playFinishSound = useSoundPool(finishSounds, undefined, false);
  const playMouseSound = useSoundPool(mouseSound, undefined, false);

  // =============================================================
  // MAUS WABER-ANIMATION (Idle nach 5 Sekunden)
  // =============================================================
  const [mouseRotation, setMouseRotation] = useState(0);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const resetIdleTimer = () => {
    setIsMouseIdle(false);
    setMouseRotation(0);
    
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    idleTimeoutRef.current = setTimeout(() => {
      setIsMouseIdle(true);
    }, 5000);
  };
  
  useEffect(() => {
    resetIdleTimer();
    
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isMouseIdle) {
      setMouseRotation(0);
      return;
    }
    
    const interval = setInterval(() => {
      setMouseRotation(() => {
        const time = Date.now() / 1000;
        return Math.sin(time * 2) * 8;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isMouseIdle]);
  // =============================================================
  // STATE
  // =============================================================
  const [clicks, setClicks] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasMilkedThisRound, setHasMilkedThisRound] = useState(false);
  const [displayedBossTimer, setDisplayedBossTimer] = useState(0);
  
  // Glas-Animation State
  const [glassAnimation, setGlassAnimation] = useState<'idle' | 'exit' | 'enter'>('idle');

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
  const [multiplier, setMultiplier] = useState(1 + (baseMultiplierBonus ?? 0));
  const [comboTimeout, setComboTimeout] = useState<NodeJS.Timeout | null>(null);
  const [comboProgress, setComboProgress] = useState(1);

  const comboTimeWindow = 150 * (1 + (comboDecayReduction ?? 0));

  const increaseMultiplier = () => {
    const maxMul = 2 + (maxMultiplierBonus ?? 0);

    setMultiplier((prev) => {
      if (prev >= maxMul) {
        // ✅ Kein Shake mehr bei max Combo
        triggerShake()
        return maxMul;
      }
      if (prev < 1.1) return 1.1;
      if (prev < 1.25) return 1.25;
      if (prev < 1.5) return 1.5;
      return Math.min(prev + 0.1, maxMul);
    });

    setComboProgress(1);
  };

  const resetMultiplier = () => {
    setMultiplier(1 + (baseMultiplierBonus ?? 0));
    setComboProgress(0);
  };

  useEffect(() => {
    if (multiplier <= 1 + (baseMultiplierBonus ?? 0)) return;

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
  }, [multiplier, comboTimeWindow, baseMultiplierBonus]);

  // =============================================================
  // PASSIVE INCOME
  // =============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveMilk > 0) {
        useMilkStore.setState((state) => ({
          milkedCount: state.milkedCount + passiveMilk / 60,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [passiveMilk]);

  // =============================================================
  // THEME MUSIC
  // =============================================================
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!themeAudioRef.current) {
      themeAudioRef.current = new Audio("/mouse/sounds/theme.mp3");
      themeAudioRef.current.loop = true;
      themeAudioRef.current.volume = 0.2;
    }

    if (isMuted) {
      themeAudioRef.current.pause();
    } else {
      themeAudioRef.current.play().catch(() => {});
    }

    return () => {
      if (themeAudioRef.current) {
        themeAudioRef.current.pause();
      }
    };
  }, [isMuted]);

  // =============================================================
  // iPHONE AUDIO UNLOCK
  // =============================================================
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

  // =============================================================
  // ERFOLGSSOUND + FINISHSOUND
  // =============================================================
  useEffect(() => {
    if (clicks >= clicksToMilk && clicks > 0 && !hasMilkedThisRound && !activeBoss) {
      playSuccessSound();
      playFinishSound();
    }
  }, [clicks, clicksToMilk, hasMilkedThisRound, activeBoss]);

  // =============================================================
  // CONFETTI
  // =============================================================
  const fireMilkConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      startVelocity: 30,
      gravity: 0.8,
      ticks: 180,
      colors: ["#ffffff"],
      shapes: ["circle"],
      origin: { y: 0.6 },
    });
  };

  const fireMiniMilkParticles = () => {
    confetti({
      particleCount: 10,
      spread: 140,
      startVelocity: 25,
      gravity: 1,
      ticks: 80,
      colors: ["#ffffff"],
      shapes: ["circle"],
      origin: { y: 0.6 },
    });
  };

  // =============================================================
  // WARNING TIMER
  // =============================================================
  const resetWarningTimeout = () => {
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

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
    resetIdleTimer(); // ✅ Timer zurücksetzen bei Klick
    
    if (activeBoss) {
      handleBossClick();
    } else if (clicks < clicksToMilk) {
      playClickSound();

      if (Math.random() < 0.1) {
        playMouseSound();
      }

      if (comboTimeout) clearTimeout(comboTimeout);
      increaseMultiplier();

      const timeout = setTimeout(() => resetMultiplier(), comboTimeWindow);
      setComboTimeout(timeout);

      fireMiniMilkParticles();

      setClicks((prev) => prev + clicksPerMilk * multiplier);

      setIsFlipped((prev) => !prev);

      resetWarningTimeout();
    }
  };

  const handleBossClick = () => {
    if (!activeBoss) return;

    resetIdleTimer(); // ✅ Timer zurücksetzen bei Boss-Klick
    
    playClickSound();
    
    // Combo-Logik auch beim Boss
    if (comboTimeout) clearTimeout(comboTimeout);
    increaseMultiplier();
    const timeout = setTimeout(() => resetMultiplier(), comboTimeWindow);
    setComboTimeout(timeout);

    // Erst den aktuellen Damage berechnen
    const damage = clicksPerMilk * multiplier;
    const newBossClicks = bossClicks + damage;
    
    // Dann im Store updaten
    increaseBossClicks(damage);

    // DANN checken ob Boss tot ist (mit dem NEUEN Wert!)
    if (newBossClicks >= activeBoss.hp) {
      // Boss-Name speichern BEVOR wir resetten
      setDefeatedBossName(activeBoss.name);
      
      useMilkStore.setState(state => ({
        milkedCount: state.milkedCount + activeBoss.rewardMultiplier * 10
      }));

      fireMilkConfetti();
      playSuccessSound(); // ✅ Nur EINMAL hier
      
      // ✅ WICHTIG: Erst Result setzen, DANN Boss resetten
      setBossResult("win");
      
      // Boss reset verzögern damit der State sauber gesetzt wird
      setTimeout(() => {
        resetBoss();
        document.documentElement.style.cursor = 'default';
      }, 50);
    }
  };

  useEffect(() => {
    if (autoClick > 0) {
      const intervalTime = Math.max(10, 1000 / autoClick);
  
      const interval = setInterval(() => {
        if (activeBoss) {
          handleBossClick();
        } else {
          handleMouseClick();
        }
      }, intervalTime);
  
      return () => clearInterval(interval);
    }
  }, [autoClick, activeBoss, bossClicks, clicks, multiplier]);

  // =============================================================
  // MILCH-ERFOLG (erhöht nur Counter) - NUR EINMAL!
  // =============================================================
  useEffect(() => {
    if (!activeBoss && clicks >= clicksToMilk && clicks > 0 && !hasMilkedThisRound) {
      increaseMilkedCount();
      playSuccessSound(); // ✅ 
      setHasMilkedThisRound(true);
      fireMilkConfetti();
      triggerShake();
    }
  }, [clicks, clicksToMilk, hasMilkedThisRound, activeBoss]);

  // =============================================================
  // BOSS TIMER
  // =============================================================
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (activeBoss) {
      setBossTimer(activeBoss.time);
      setDisplayedBossTimer(activeBoss.time);

      timerInterval = setInterval(() => {
        setBossTimer((prev) => {
          const nextTime = prev - 0.1;
          setDisplayedBossTimer(nextTime);
          if (nextTime <= 0) {
            clearInterval(timerInterval!);
            
            // ✅ WICHTIG: Erst Result setzen, DANN Boss resetten
            setBossResult("lose");
            
            setTimeout(() => {
              resetBoss();
              document.documentElement.style.cursor = 'default';
            }, 50);
            
            return 0;
          }
          return nextTime;
        });
      }, 100);
    } else {
      setBossTimer(0);
      setDisplayedBossTimer(0);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [activeBoss]);
  
  // =============================================================
  // CURSOR LOGIC
  // =============================================================
  useEffect(() => {
    if (activeBoss) {
      document.documentElement.style.cursor = `default`;
    } else {
      document.documentElement.style.cursor = 'default';
    }
    return () => {
      document.documentElement.style.cursor = 'default';
    };
  }, [activeBoss]);

  // =============================================================
  // RESET → NEUE RUNDE (mit Boss-Check!)
  // =============================================================
  const handlePlayAgain = () => {
    const currentBossCounter = useMilkStore.getState().bossCounter;
    
    // ✅ Glas-Animation starten
    setGlassAnimation('exit');
    
    // Nach Exit-Animation → Werte resetten + Enter-Animation
    setTimeout(() => {
      if (currentBossCounter >= 10) {
        const randomBoss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
        activateBoss(randomBoss);
        playBossSound();
        resetBossCounter();
      }

      playStartSound();
      setClicks(0);
      setHasMilkedThisRound(false);
      increaseClicksToMilk();
      resetMultiplier();
      resetWarningTimeout();
      
      if (!activeBoss) {
        document.documentElement.style.cursor = 'default';
      }
      
      // Enter-Animation starten
      setGlassAnimation('enter');
      
      // Nach Enter-Animation → zurück zu idle
      setTimeout(() => {
        setGlassAnimation('idle');
      }, 600);
    }, 600);
  };

  // =============================================================
  // SPACEBAR SUPPORT
  // =============================================================
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ✅ Nicht klicken wenn Boss Result Screen offen ist
      if (bossResult !== null) return;
      
      if (e.code === "Space") {
        if (activeBoss) {
          handleBossClick();
        } else {
          handleMouseClick();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeBoss, bossClicks, clicks, multiplier, bossResult]);

  const milked = clicks >= clicksToMilk;
  const progress = isMounted ? Math.min(clicks / clicksToMilk, 1) : 0;
  
  // ✅ Check ob max Combo erreicht
  const maxMul = 2 + (maxMultiplierBonus ?? 0);
  const isMaxCombo = multiplier >= maxMul;

  const mouseGlow =
    multiplier >= 2
      ? "drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] animate-pulse"
      : multiplier >= 1.5
      ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
      : "";

  // =============================================================
  // RENDER - BOSS RESULT SCREENS
  // =============================================================
  if (bossResult === "win") {
    return (
      <main className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm text-center p-6 shadow-2xl border-4 border-green-500">
          <h2 className="text-4xl font-bold text-green-500 mb-4 animate-pulse">
            🎉 Boss besiegt! 🎉
          </h2>
  
          <p className="text-xl text-white mb-2">
            {defeatedBossName || "Boss"}
          </p>
          
          <p className="text-white mb-6">
            Du hast den Boss erfolgreich gemolken und extra Milch erhalten!
          </p>
  
          <Button
            onClick={() => {
              setBossResult(null);
              setDefeatedBossName("");
            }}
            size="lg"
            className="w-full"
          >
            Weiter spielen
          </Button>
        </Card>
      </main>
    );
  }
  
  if (bossResult === "lose") {
    return (
      <main className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm text-center p-6 shadow-2xl border-4 border-red-500">
          <h2 className="text-4xl font-bold text-red-500 mb-4 animate-pulse">
            💀 Boss entkommen! 💀
          </h2>
  
          <p className="text-white mb-6">
            Du warst zu langsam – der Boss konnte entkommen. Versuche es beim nächsten Mal schneller!
          </p>
  
          <Button
            onClick={() => {
              setBossResult(null);
            }}
            size="lg"
            className="w-full"
          >
            Weiter spielen
          </Button>
        </Card>
      </main>
    );
  }
  
  // =============================================================
  // RENDER - MAIN GAME
  // =============================================================
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background p-4 font-body overflow-hidden">
      {/* TOP-LEFT BUTTON */}
      <div className="fixed top-4 left-4 z-[20] flex flex-row gap-2">
        <AudioToggle />
        <Link href="/stats">
          <Button>
            <BarChart3 className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-[20]">
        <Link href="/shop">
          <Button>
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Milch-Glas mit Wasserstand */}
      <div 
        className="fixed bottom-4 right-4 z-[999] w-24 h-56 transition-all duration-600 ease-in-out"
        style={{
          transform: 
            glassAnimation === 'exit' 
              ? 'translateX(200px) rotate(20deg)' 
              : glassAnimation === 'enter'
              ? 'translateY(0px) rotate(0deg)'
              : 'translateY(0px) rotate(0deg)',
          opacity: glassAnimation === 'exit' ? 0 : 1,
        }}
      >
        {/* Glas-Container */}
        <div 
          className="relative h-full w-full"
          style={{
            transform: glassAnimation === 'enter' ? 'translateY(0)' : 'translateY(0)',
            animation: glassAnimation === 'enter' ? 'slideUpGlass 0.6s ease-out' : 'none'
          }}
        >
          <svg
            viewBox="0 0 100 200"
            className="absolute inset-0 w-full h-full drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
          >
            {/* Clipping Path für Glas-Form */}
            <defs>
              <clipPath id="glassClip">
                <path d="M 20 10 L 30 190 L 70 190 L 80 10 Z" />
              </clipPath>
              
              {/* Wellen-Animation Pattern */}
              <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 10 Q 12.5 5, 25 10 T 50 10 T 75 10 T 100 10 L 100 20 L 0 20 Z"
                  fill="rgba(255,255,255,0.3)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="50 0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>
            </defs>

            {/* Milch-Füllung mit Clip */}
            <g clipPath="url(#glassClip)">
              {/* Haupt-Milch */}
              <rect
                x="0"
                y={200 - (progress * 180)}
                width="100"
                height={progress * 180}
                fill="white"
                className="transition-all duration-500 ease-out"
              />
              
              {/* Wellen-Overlay */}
              <rect
                x="0"
                y={200 - (progress * 180) - 5}
                width="100"
                height="10"
                fill="url(#waves)"
                opacity="0.6"
                className="transition-all duration-500 ease-out"
              />
              
              {/* Schaum-Effekt */}
              <ellipse
                cx="50"
                cy={200 - (progress * 180)}
                rx="30"
                ry="4"
                fill="white"
                opacity="0.8"
                className="transition-all duration-500 ease-out"
              >
                <animate
                  attributeName="ry"
                  values="4;5;4"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </ellipse>
            </g>

            {/* Glas-Körper (transparent, drüber) */}
            <path
              d="M 20 10 L 30 190 L 70 190 L 80 10 Z"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
            
            {/* Glas-Highlights */}
            <path
              d="M 25 15 L 32 180"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 75 15 L 68 180"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* Milch-Counter Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
              <span className="text-sm font-bold text-white drop-shadow-lg">
                {isMounted ? formatNumber(milkedCount || 0) : "0"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animationen für Glas */}
      <style jsx>{`
        @keyframes slideUpGlass {
          from {
            transform: translateY(300px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <div className={`game-area ${isShaking ? "screenshake" : ""}`}>
        <Card 
          className={`w-full max-w-sm text-center shadow-2xl relative z-[10] transition-all duration-300 ${
            isMaxCombo ? "animate-pulse ring-4 ring-white shadow-[0_0_30px_rgba(255,255,255,0.8)]" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="text-accent flex items-center justify-center gap-2 text-4xl font-bold font-headline">
              <Rat className="h-8 w-8" /> Mouse Milker
            </CardTitle>
            <CardDescription>
              {activeBoss ? (
                <span className="text-red-500 font-bold animate-pulse">
                  🔥 Boss: {activeBoss.name} 🔥
                </span>
              ) : milked ? (
                "You did it!"
              ) : (
                `Bitte melken Sie die Maus (${bossCounter}/10 bis Boss)`
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center p-6">
            {milked && !activeBoss ? (
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-xl bg-accent p-6 shadow-inner animate-pulse">
                  <p className="flex items-center gap-2 text-2xl font-bold text-accent-foreground">
                    <Milk className="h-6 w-6" /> Du hast die Maus gemolken!
                  </p>
                </div>
                <Button onClick={handlePlayAgain} size="lg">
                  <RefreshCcw className="mr-2 h-4 w-4" /> 
                  {bossCounter >= 10 ? "Boss bekämpfen! ⚔️" : "Erneut melken"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onMouseDown={handleMouseClick}
                  className="cursor-pointer rounded-full p-4 transition-transform duration-150 ease-in-out active:scale-90"
                >
                  <Rat
                    className={`h-40 w-40 transition-all duration-200 ${
                      isFlipped ? "scale-x-[-1]" : ""
                    } ${mouseGlow} ${activeBoss ? "animate-pulse" : ""}`}
                    style={{
                      ...(activeBoss ? { 
                        color: activeBoss.color, 
                        filter: `drop-shadow(0 0 15px ${activeBoss.color})` 
                      } : {}),
                      transform: `rotate(${mouseRotation}deg) ${isFlipped ? 'scaleX(-1)' : 'scaleX(1)'}`,
                    }}
                  />
                </button>

                {activeBoss && (
                  <>
                    <p className="text-xl font-bold" style={{ color: activeBoss.color }}>
                      {activeBoss.name}
                    </p>
                    <div className="w-40 h-3 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min((bossClicks / activeBoss.hp) * 100, 100)}%`,
                          backgroundColor: activeBoss.color
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(bossClicks)} / {formatNumber(activeBoss.hp)} HP
                    </p>
                    <p className="text-lg font-bold text-red-500">
                      ⏳ {displayedBossTimer.toFixed(1)}s
                    </p>
                  </>
                )}

                <div className="w-40 h-2 bg-accent/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${comboProgress * 100}%` }}
                  ></div>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  {Number(multiplier || 1).toFixed(2)}× Combo
                </p>

                {!activeBoss && (
                  <div className="text-center">
                    <p className="text-5xl font-bold text-foreground">
                      {formatNumber(clicks)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {clicks === 0
                        ? `Click the mouse ${clicksToMilk} times!`
                        : `${formatNumber(Math.max(0, clicksToMilk - clicks))} more clicks to go!`}
                    </p>
                  </div>
                )}

                {passiveMilk > 0 && (
                  <p className="text-xs mt-2 text-muted-foreground">
                    +{(passiveMilk / 60).toFixed(2)} / sec (passiv)
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mouse } from "lucide-react";

const CLICKS_TO_MILK = 10;

export default function Home() {
  const [clicks, setClicks] = useState(0);

  const handleMouseClick = () => {
    if (clicks < CLICKS_TO_MILK) {
      setClicks(clicks + 1);
    }
  };

  const handlePlayAgain = () => {
    setClicks(0);
  };

  const milked = clicks >= CLICKS_TO_MILK;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-sm text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl font-bold tracking-tight">
            Mouse Milker
          </CardTitle>
          <CardDescription>
            {milked ? "You did it!" : "A thrilling clicking adventure"}
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
                className="group rounded-full p-4 transition-transform duration-150 ease-in-out active:scale-90"
                aria-label="Milk the mouse"
              >
                <Mouse className="h-40 w-40 text-primary drop-shadow-lg transition-transform duration-200 group-hover:scale-105" />
              </button>
              <div className="text-center">
                <p className="text-5xl font-bold text-foreground">{clicks}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {clicks === 0
                    ? "Please milk the mouse"
                    : `${CLICKS_TO_MILK - clicks} more clicks to go!`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

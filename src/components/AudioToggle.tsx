'use client';

import { useMilkStore } from "@/store/milk";
import { Button } from "./ui/button";
import { Volume1, VolumeX } from "lucide-react";

export default function AudioToggle() {
  const { isMuted, toggleMute } = useMilkStore();

  return (
    <Button variant="outline" size="icon" onClick={toggleMute}>
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume1 className="h-5 w-5" />
      )}
    </Button>
  );
}

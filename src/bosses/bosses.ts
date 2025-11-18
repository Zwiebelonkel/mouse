// bosses.ts

export interface BossDefinition {
    id: string;
    name: string;
    color: string;
    hp: number;       // wie viele Klick-Punkte er aushält
    time: number;     // Sekunden Zeitlimit
    rewardMultiplier: number; // wie viel Milch man bekommt
    icon: string;     // z. B. Lucide Icon Name
    sound: string;    // Boss-Sounddatei
  }
  
  export const BOSSES: BossDefinition[] = [
    {
      id: "thunder",
      name: "Donner-Maus",
      color: "#ffe135",
      hp: 150,
      time: 8,
      rewardMultiplier: 3,
      icon: "zap",
      sound: "/mouse/sounds/bossStart.mp3"
    },
    {
      id: "shadow",
      name: "Schatten-Maus",
      color: "#6a5acd",
      hp: 200,
      time: 10,
      rewardMultiplier: 5,
      icon: "moon",
      sound: "/mouse/sounds/bossStart.mp3"
    },
    {
      id: "lava",
      name: "Lava-Maus",
      color: "#ff4500",
      hp: 250,
      time: 12,
      rewardMultiplier: 7,
      icon: "flame",
      sound: "/mouse/sounds/bossStart.mp3"
    },
    {
      id: "frost",
      name: "Frost-Maus",
      color: "#00bfff",
      hp: 350,
      time: 15,
      rewardMultiplier: 10,
      icon: "snowflake",
      sound: "/mouse/sounds/bossStart.mp3"
    },
    {
      id: "steel",
      name: "Stahl-Maus",
      color: "#a9a9a9",
      hp: 500,
      time: 20,
      rewardMultiplier: 15,
      icon: "shield",
      sound: "/mouse/sounds/bossStart.mp3"
    },
    {
      id: "dimensional",
      name: "Dimensions-Maus",
      color: "#f0f",
      hp: 1000,
      time: 30,
      rewardMultiplier: 30,
      icon: "aperture",
      sound: "/mouse/sounds/bossStart.mp3"
    }
  ];
  
import type { Level, Topic, World } from './types';
import { grade1Topics } from './grades/grade1';
import { grade2Topics } from './grades/grade2';
import { grade3Topics } from './grades/grade3';

export const worlds: World[] = [
  {
    id: 1,
    grade: "כיתה א'",
    name: 'יער המספרים',
    icon: '🌳',
    theme: {
      bg: 'linear-gradient(180deg, #d3f9d8 0%, #b2f2bb 55%, #8ce99a 100%)',
      accent: '#37b24d',
      accentDark: '#2b8a3e',
      soft: '#ebfbee',
    },
    topics: grade1Topics,
  },
  {
    id: 2,
    grade: "כיתה ב'",
    name: 'ים החשבון',
    icon: '🐠',
    theme: {
      bg: 'linear-gradient(180deg, #d0ebff 0%, #a5d8ff 55%, #74c0fc 100%)',
      accent: '#1c7ed6',
      accentDark: '#1864ab',
      soft: '#e7f5ff',
    },
    topics: grade2Topics,
  },
  {
    id: 3,
    grade: "כיתה ג'",
    name: 'מדבר הכפל',
    icon: '🐪',
    theme: {
      bg: 'linear-gradient(180deg, #fff3bf 0%, #ffe066 55%, #fcc419 100%)',
      accent: '#f08c00',
      accentDark: '#d9480f',
      soft: '#fff9db',
    },
    topics: grade3Topics,
  },
  {
    id: 4,
    grade: "כיתה ד'",
    name: 'הרי השברים',
    icon: '⛰️',
    theme: {
      bg: 'linear-gradient(180deg, #e5dbff 0%, #d0bfff 55%, #b197fc 100%)',
      accent: '#7048e8',
      accentDark: '#5f3dc4',
      soft: '#f3f0ff',
    },
    topics: [],
  },
  {
    id: 5,
    grade: "כיתה ה'",
    name: "ג'ונגל העשרוניים",
    icon: '🦜',
    theme: {
      bg: 'linear-gradient(180deg, #c3fae8 0%, #96f2d7 55%, #63e6be 100%)',
      accent: '#0ca678',
      accentDark: '#087f5b',
      soft: '#e6fcf5',
    },
    topics: [],
  },
  {
    id: 6,
    grade: "כיתה ו'",
    name: 'חלל האחוזים',
    icon: '🚀',
    theme: {
      bg: 'linear-gradient(180deg, #364fc7 0%, #3b5bdb 50%, #4c6ef5 100%)',
      accent: '#f59f00',
      accentDark: '#e67700',
      soft: '#edf2ff',
    },
    topics: [],
  },
];

export interface LevelRef {
  world: World;
  topic: Topic;
  level: Level;
}

const index = new Map<string, LevelRef>();
for (const world of worlds) {
  for (const topic of world.topics) {
    for (const level of topic.levels) index.set(level.id, { world, topic, level });
  }
}

export function findLevel(id: string): LevelRef | undefined {
  return index.get(id);
}

export function findWorld(id: number): World | undefined {
  return worlds.find((w) => w.id === id);
}

export function allTopics(): { world: World; topic: Topic }[] {
  return worlds.flatMap((world) => world.topics.map((topic) => ({ world, topic })));
}

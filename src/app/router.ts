import { useEffect, useState } from 'react';

export type Route =
  | { name: 'map' }
  | { name: 'world'; worldId: number }
  | { name: 'play'; levelId: string }
  | { name: 'badges' }
  | { name: 'parents' }
  | { name: 'dev' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'world' && parts[1]) return { name: 'world', worldId: Number(parts[1]) };
  if (parts[0] === 'play' && parts[1]) return { name: 'play', levelId: decodeURIComponent(parts[1]) };
  if (parts[0] === 'badges') return { name: 'badges' };
  if (parts[0] === 'parents') return { name: 'parents' };
  if (parts[0] === 'dev') return { name: 'dev' };
  return { name: 'map' };
}

export function go(path: string): void {
  window.location.hash = path;
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

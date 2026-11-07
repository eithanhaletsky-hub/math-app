import { useRoute } from './app/router';
import { MapScreen } from './screens/MapScreen';
import { WorldScreen } from './screens/WorldScreen';
import { LevelScreen } from './screens/LevelScreen';
import { DevScreen } from './screens/DevScreen';

export function App() {
  const route = useRoute();
  switch (route.name) {
    case 'world':
      return <WorldScreen key={route.worldId} worldId={route.worldId} />;
    case 'play':
      return <LevelScreen key={route.levelId} levelId={route.levelId} />;
    case 'dev':
      return <DevScreen />;
    // badges & parents screens arrive in stage 3
    default:
      return <MapScreen />;
  }
}

import { useRoute } from './app/router';
import { MapScreen } from './screens/MapScreen';
import { WorldScreen } from './screens/WorldScreen';
import { LevelScreen } from './screens/LevelScreen';
import { BadgesScreen } from './screens/BadgesScreen';
import { ParentsScreen } from './screens/ParentsScreen';
import { DevScreen } from './screens/DevScreen';
import { BadgeToaster } from './components/BadgeToaster';

function Screen() {
  const route = useRoute();
  switch (route.name) {
    case 'world':
      return <WorldScreen key={route.worldId} worldId={route.worldId} />;
    case 'play':
      return <LevelScreen key={route.levelId} levelId={route.levelId} />;
    case 'badges':
      return <BadgesScreen />;
    case 'parents':
      return <ParentsScreen />;
    case 'dev':
      return <DevScreen />;
    default:
      return <MapScreen />;
  }
}

export function App() {
  return (
    <>
      <Screen />
      <BadgeToaster />
    </>
  );
}

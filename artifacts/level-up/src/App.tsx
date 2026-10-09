import { Route, Switch } from 'wouter';
import './index.css';
import { ProgressProvider, useProgress } from './store/progress';
import { AppShell } from './layout/AppShell';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { TopicPage } from './pages/TopicPage';
import { Practice } from './pages/Practice';
import { Games } from './pages/Games';
import { GamePlayer } from './pages/games/GamePlayer';
import { Adventure } from './pages/Adventure';
import { Missions, MissionPlayer } from './pages/Missions';
import { Notebook } from './pages/Notebook';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

function Routes() {
  const { profile } = useProgress();
  if (!profile) return <Onboarding />;
  return (
    <AppShell>
      <Switch>
        <Route path="/"><Home /></Route>
        <Route path="/learn"><Learn /></Route>
        <Route path="/learn/:topicId">{(p) => <TopicPage key={p.topicId} topicId={p.topicId} />}</Route>
        <Route path="/practice"><Practice /></Route>
        <Route path="/games"><Games /></Route>
        <Route path="/games/:gameId">{(p) => <GamePlayer key={p.gameId} gameId={p.gameId} />}</Route>
        <Route path="/adventure"><Adventure /></Route>
        <Route path="/adventure/:level">{(p) => <Adventure key={p.level} levelParam={p.level} />}</Route>
        <Route path="/missions"><Missions /></Route>
        <Route path="/missions/:missionId">{(p) => <MissionPlayer key={p.missionId} missionId={p.missionId} />}</Route>
        <Route path="/notebook"><Notebook /></Route>
        <Route path="/achievements"><Achievements /></Route>
        <Route path="/profile"><Profile /></Route>
        <Route><NotFound /></Route>
      </Switch>
    </AppShell>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Routes />
    </ProgressProvider>
  );
}

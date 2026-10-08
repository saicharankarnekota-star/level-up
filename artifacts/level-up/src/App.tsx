import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Award, BookOpen,
  Check, CheckCircle2, ChevronRight, CircleHelp, Compass, Flame, Gamepad2,
  Lightbulb, LockKeyhole, Menu, PenLine, Play, Plus, Search,
  ShieldCheck, Sparkles, Star, Target, Trophy, X, Zap,
} from 'lucide-react';
import './index.css';

type Profile = { name: string; age: number; grade: string; avatar: string; interests: string[]; xp: number; level: number; streak: number };
type Activity = { lessonsCompleted: number; missionsCompleted: number; questionsAnswered: number; gamesPlayed: number; creationsCount: number; dailyGoal: number };
type Creation = { id: string; title: string; type: string; topic: string; content: string; createdAt: string };
type AppData = { profile: Profile; activity: Activity; mission: { completed: boolean; currentStep: number }; creations: Creation[]; badges: string[]; games: Record<string, number> };

const initialData: AppData = {
  profile: { name: 'Alex', age: 10, grade: 'Grade 5', avatar: 'A', interests: ['Space', 'Animals', 'Drawing'], xp: 740, level: 8, streak: 4 },
  activity: { lessonsCompleted: 12, missionsCompleted: 2, questionsAnswered: 38, gamesPlayed: 9, creationsCount: 1, dailyGoal: 3 },
  mission: { completed: false, currentStep: 0 },
  creations: [{ id: 'seed-1', title: 'Why the moon changes shape', type: 'Explanation', topic: 'Space', content: 'The moon does not change shape. We see different amounts of its sunlit side as it travels around Earth.', createdAt: 'Today' }],
  badges: ['Curious starter', 'Four-day spark', 'Idea maker', 'Trail finder'],
  games: {},
};

const pages = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/missions', label: 'Missions', icon: Target },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/practice', label: 'Practice', icon: Zap },
  { href: '/create', label: 'Create', icon: PenLine },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
];

function readSaved(): AppData {
  try {
    const saved = localStorage.getItem('level-up-progress-v1');
    if (saved) {
      const restored = JSON.parse(saved);
      const profile = { ...initialData.profile, ...restored.profile };
      return {
        ...initialData,
        ...restored,
        profile: { ...profile, level: Math.floor(profile.xp / 100) + 1 },
        activity: { ...initialData.activity, ...restored.activity },
      };
    }
  } catch { /* Keep the friendly demo state if storage is unavailable. */ }
  return initialData;
}

function App() {
  const [location, navigate] = useLocation();
  const [data, setData] = useState<AppData>(readSaved);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => { localStorage.setItem('level-up-progress-v1', JSON.stringify(data)); }, [data]);
  useEffect(() => { setMobileOpen(false); }, [location]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const patch = (fn: (d: AppData) => AppData) => setData(current => fn(current));
  const awardXp = (amount: number) => patch(d => {
    const xp = d.profile.xp + amount;
    const level = Math.floor(xp / 100) + 1;
    return { ...d, profile: { ...d.profile, xp, level } };
  });
  const completeMission = () => patch(d => ({
    ...d,
    mission: { completed: true, currentStep: 3 },
    activity: { ...d.activity, missionsCompleted: d.activity.missionsCompleted + (d.mission.completed ? 0 : 1) },
    profile: { ...d.profile, xp: d.profile.xp + (d.mission.completed ? 0 : 120), level: Math.floor((d.profile.xp + (d.mission.completed ? 0 : 120)) / 100) + 1 },
    badges: d.badges.includes('Fraction explorer') ? d.badges : [...d.badges, 'Fraction explorer'],
  }));

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <Link href="/" className="brand" aria-label="LEVEL UP home"><span className="brand-mark"><span /></span><span>LEVEL<span className="brand-accent">UP</span><small>LEARN YOUR WAY</small></span></Link>
      <div className="nav-caption">YOUR ADVENTURE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {pages.map(({ href, label, icon: Icon }) => <Link data-testid={`link-${label.toLowerCase()}`} key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`}><Icon size={18} strokeWidth={2.1}/><span>{label}</span>{href === '/missions' && !data.mission.completed && <i className="nav-dot" />}</Link>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="daily-side"><div className="daily-side-top"><span>DAILY SPARK</span><Flame size={15}/></div><strong>{Math.min(data.activity.lessonsCompleted % data.activity.dailyGoal, data.activity.dailyGoal)}/{data.activity.dailyGoal}</strong><div className="tiny-track"><span style={{ width: `${Math.min((data.activity.lessonsCompleted % data.activity.dailyGoal) / data.activity.dailyGoal * 100, 100)}%` }}/></div><small>Little steps add up.</small></div>
        <Link href="/profile" className="sidebar-profile"><span className="avatar">{data.profile.avatar.slice(0, 1).toUpperCase()}</span><span><b>{data.profile.name}</b><small>Level {data.profile.level} learner</small></span><ChevronRight size={16}/></Link>
      </div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar">
        <button className="icon-button menu-trigger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu size={20}/></button>
        <div className="crumb"><span>YOUR SPACE</span><ChevronRight size={13}/><b>{pages.find(p => p.href === location)?.label ?? 'Explore'}</b></div>
        <div className="top-actions">
          <div className="xp-pill"><Zap size={14} fill="currentColor"/><span>{data.profile.xp} XP</span></div>
          <button className="streak-pill" onClick={() => setToast(`You're on a ${data.profile.streak}-day learning streak. Keep it going!`)}><Flame size={15}/><b>{data.profile.streak}</b><span>day streak</span></button>
          <Link href="/profile" className="avatar top-avatar" aria-label="Open profile">{data.profile.avatar.slice(0, 1).toUpperCase()}</Link>
        </div>
      </header>
      <div className="page-wrap">
        <Switch>
          <Route path="/"><Dashboard data={data} navigate={navigate} search={search} setSearch={setSearch}/></Route>
          <Route path="/learn"><Learn data={data} search={search} setSearch={setSearch} go={navigate} onComplete={() => { patch(d => ({ ...d, activity: { ...d.activity, lessonsCompleted: d.activity.lessonsCompleted + 1 }, badges: d.activity.lessonsCompleted + 1 >= 10 && !d.badges.includes('Trail finder') ? [...d.badges, 'Trail finder'] : d.badges })); awardXp(25); setToast('Lesson complete. +25 XP'); }}/></Route>
          <Route path="/missions"><Missions data={data} onStart={() => navigate('/missions/fraction-galaxy')} /></Route>
          <Route path="/missions/fraction-galaxy"><Mission data={data} onStep={(currentStep) => patch(d => ({ ...d, mission: { ...d.mission, currentStep } }))} onComplete={() => { completeMission(); setToast('Mission complete. +120 XP and a new badge!'); }} go={navigate}/></Route>
          <Route path="/games"><Games data={data} finish={(name, xp) => { patch(d => ({ ...d, activity: { ...d.activity, gamesPlayed: d.activity.gamesPlayed + 1 }, games: { ...d.games, [name]: (d.games[name] ?? 0) + 1 } })); awardXp(xp); setToast(`Nice run! +${xp} XP`); }}/></Route>
          <Route path="/practice"><Practice data={data} onDone={(n) => { patch(d => ({ ...d, activity: { ...d.activity, questionsAnswered: d.activity.questionsAnswered + n } })); awardXp(35); setToast('Practice finished. +35 XP'); }}/></Route>
          <Route path="/create"><Create data={data} onSave={(c) => { patch(d => ({ ...d, creations: [c, ...d.creations], activity: { ...d.activity, creationsCount: d.activity.creationsCount + 1 } })); awardXp(20); setToast('Your idea is saved. +20 XP'); }}/></Route>
          <Route path="/achievements"><Achievements data={data}/></Route>
          <Route path="/profile"><ProfilePage data={data} save={(profile) => { patch(d => ({ ...d, profile })); setToast('Profile updated.'); }}/></Route>
          <Route><NotFound go={navigate}/></Route>
        </Switch>
      </div>
    </main>
    {toast && <div className="toast" role="status"><CheckCircle2 size={18}/>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={15}/></button></div>}
  </div>;
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Dashboard({ data, navigate, search, setSearch }: { data: AppData; navigate: (path: string) => void; search: string; setSearch: (s: string) => void }) {
  const done = data.mission.completed;
  return <div className="dashboard page-enter">
    <div className="welcome-line"><div><div className="eyebrow">TUESDAY, YOUR DAY TO DISCOVER</div><h1>Hey {data.profile.name}<span className="wave-mark">.</span></h1><p>What will you figure out today?</p></div><div className="welcome-stamp"><Sparkles size={18}/><span>Curiosity<br/>looks good on you</span></div></div>
    <div className="dashboard-grid">
      <section className="hero-card">
        <div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot"/> PICK UP WHERE YOU LEFT OFF</div><h2>{done ? 'Ready for another\nbright idea?' : 'A universe of\nfractions awaits.'}</h2><p>{done ? 'Your next small step could lead somewhere big.' : 'Help the Star Keeper share moon-pies fairly across the galaxy.'}</p><button className="button button-yellow" onClick={() => navigate(done ? '/learn' : '/missions/fraction-galaxy')}>{done ? 'Explore a lesson' : 'Continue mission'}<ArrowRight size={17}/></button><span className="hero-meta">{done ? 'Pick any path that sparks' : 'Fraction Galaxy · 3 short challenges'}</span></div>
        <div className="orbit-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="planet"><div className="planet-ring"/><span className="planet-crater crater-a"/><span className="planet-crater crater-b"/></div><span className="orbit-star star-a">✦</span><span className="orbit-star star-b">✧</span><span className="orbit-star star-c">✦</span><span className="orbit-label">THE NEXT<br/>BIG THING</span></div>
      </section>
      <section className="daily-card">
        <div className="card-overline">YOUR DAILY SPARK <Flame size={16}/></div><h3>Three little<br/>learning moments.</h3><p>That’s your goal. No rush, just progress.</p><div className="goal-row"><div className="goal-dots">{[0,1,2].map((n) => <span key={n} className={n < data.activity.lessonsCompleted % 3 ? 'filled' : ''}>{n < data.activity.lessonsCompleted % 3 && <Check size={12}/>}</span>)}</div><b>{data.activity.lessonsCompleted % 3}<small> / 3</small></b></div><button className="text-action" onClick={() => navigate('/learn')}>Find a quick lesson <ArrowRight size={15}/></button>
      </section>
    </div>
    <div className="section-head"><div><div className="eyebrow">MADE FOR YOUR KIND OF CURIOUS</div><h2>Pick your next adventure</h2></div><button className="text-action" onClick={() => navigate('/learn')}>See everything <ArrowRight size={15}/></button></div>
    <div className="adventure-row">
      <button className="adventure-card adventure-mission" onClick={() => navigate('/missions')}><span className="adventure-icon"><Target size={20}/></span><span className="adventure-copy"><b>Missions</b><small>Big ideas, bite-sized steps</small></span><span className="adventure-count">{data.activity.missionsCompleted} done</span><ArrowUpRight size={17}/></button>
      <button className="adventure-card adventure-games" onClick={() => navigate('/games')}><span className="adventure-icon"><Gamepad2 size={20}/></span><span className="adventure-copy"><b>Brain games</b><small>Play your way to sharper</small></span><span className="adventure-count">{data.activity.gamesPlayed} played</span><ArrowUpRight size={17}/></button>
      <button className="adventure-card adventure-create" onClick={() => navigate('/create')}><span className="adventure-icon"><PenLine size={20}/></span><span className="adventure-copy"><b>Make something</b><small>Your ideas belong here</small></span><span className="adventure-count">{data.creations.length} saved</span><ArrowUpRight size={17}/></button>
    </div>
    <div className="bottom-dashboard">
      <section className="continue-card"><div className="section-head compact"><div><div className="eyebrow">KEEP THE MOMENTUM</div><h2>Little wins add up</h2></div><span className="soft-chip"><Flame size={14}/>{data.profile.streak} day streak</span></div><div className="stats-row"><Stat label="Lessons explored" value={data.activity.lessonsCompleted} icon={<BookOpen size={17}/>} color="sage"/><Stat label="Questions solved" value={data.activity.questionsAnswered} icon={<CheckCircle2 size={17}/>} color="sun"/><Stat label="XP earned" value={data.profile.xp} icon={<Zap size={17}/>} color="ink"/></div><div className="level-row"><div className="level-copy"><b>Level {data.profile.level} explorer</b><span>{100 - data.profile.xp % 100} XP to level {data.profile.level + 1}</span></div><div className="progress-line"><span style={{width:`${data.profile.xp%100}%`}}/></div></div></section>
      <section className="quick-search"><div className="eyebrow">GOT A QUESTION IN MIND?</div><h2>Go find out.</h2><p>Search topics and find your next learning trail.</p><form onSubmit={e => { e.preventDefault(); navigate('/learn'); }} className="search-field"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Try “fractions” or “space”" aria-label="Search learning topics"/><button aria-label="Search"><ArrowRight size={17}/></button></form></section>
    </div>
    <div className="local-note"><LockKeyhole size={13}/> Your progress stays on this device.</div>
  </div>;
}
function Stat({ label, value, icon, color }: { label: string; value: number; icon: ReactNode; color: string }) { return <div className="stat-item"><span className={`stat-icon ${color}`}>{icon}</span><b>{value}</b><small>{label}</small></div>; }

const lessons = [
  { title: 'Fractions in the wild', topic: 'Math', age: 'Ages 8–12', length: '8 min', description: 'Spot halves, thirds, and quarters hiding in everyday things.', palette: 'lesson-sage', glyph: '½', tags: ['fractions','math','parts'] },
  { title: 'How stars are born', topic: 'Science', age: 'Ages 9–13', length: '10 min', description: 'Follow a cloud of gas on its incredible journey to becoming a star.', palette: 'lesson-indigo', glyph: '✳', tags: ['space','stars','science'] },
  { title: 'The secret life of bees', topic: 'Nature', age: 'Ages 7–11', length: '7 min', description: 'Meet the tiny team keeping a whole garden buzzing.', palette: 'lesson-gold', glyph: '✿', tags: ['nature','animals','bees'] },
  { title: 'Build a better bridge', topic: 'Engineering', age: 'Ages 10–14', length: '12 min', description: 'Test how shape and strength help a bridge span the gap.', palette: 'lesson-coral', glyph: '⌁', tags: ['engineering','build','design'] },
];

function Learn({ data, search, setSearch, go, onComplete }: { data: AppData; search: string; setSearch: (s: string) => void; go: (path: string) => void; onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const filtered = useMemo(() => lessons.filter(l => (filter === 'All' || l.topic === filter) && (!search || `${l.title} ${l.description} ${l.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()))), [filter, search]);
  const lesson = lessons.find(l => l.title === selected);
  return <div className="page-enter">
    {!lesson ? <><PageTitle eyebrow="LEARN SOMETHING THAT STICKS" title="Choose a trail." description="Real ideas, made easier to explore. Pick what feels interesting." action={<div className="learn-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search a topic" aria-label="Search lessons"/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14}/></button>}</div>}/>
      <div className="filter-row">{['All','Math','Science','Nature','Engineering'].map(f => <button key={f} className={`filter-chip ${filter === f ? 'selected' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
      {filtered.length ? <div className="lesson-grid">{filtered.map((item, i) => <button key={item.title} className={`lesson-card ${item.palette}`} onClick={() => setSelected(item.title)}><div className="lesson-art"><span>{item.glyph}</span><small>{item.topic}</small></div><div className="lesson-body"><div className="lesson-meta"><span>{item.age}</span><span>{item.length}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="lesson-bottom"><span>{i < data.activity.lessonsCompleted ? 'Explore again' : 'Start exploring'}</span><span className="circle-arrow"><ArrowRight size={15}/></span></div></div></button>)}</div> : <div className="empty-card"><Search size={25}/><h3>No trails found just yet.</h3><p>Try a different topic or clear your search.</p><button className="button button-dark" onClick={() => {setSearch('');setFilter('All');}}>Show all trails</button></div>}
      <div className="learn-footnote"><Lightbulb size={16}/><span>Good learning starts with a good question. Follow yours.</span></div>
    </> : <div className="lesson-detail"><button className="back-link" onClick={() => setSelected(null)}><ArrowLeft size={16}/> Back to trails</button><div className={`lesson-detail-banner ${lesson.palette}`}><span className="lesson-big-glyph">{lesson.glyph}</span><div><span className="eyebrow">{lesson.topic.toUpperCase()} · {lesson.length}</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div></div><div className="lesson-reading"><div className="reading-label"><BookOpen size={17}/> THE BIG IDEA</div><h2>Look a little closer.</h2><p>Learning is about noticing patterns. In this trail, you’ll connect a simple idea to things you already know, then try it out for yourself.</p><div className="idea-box"><span className="idea-mark">“</span><div><b>Here’s your first thought to take with you:</b><p>{lesson.title === 'Fractions in the wild' ? 'A fraction is one way to describe how many equal parts you have out of a whole.' : lesson.title === 'How stars are born' ? 'A star begins when a huge cloud of gas and dust gathers together under gravity.' : lesson.title === 'The secret life of bees' ? 'A honeybee colony works together, with different bees helping the whole group thrive.' : 'Triangles are strong because their shape stays steady when you push on their corners.'}</p></div></div><p>Take a moment to look around. Can you find an example of this idea in your world?</p><button className="button button-dark" onClick={() => {onComplete();setSelected(null);}}>I explored this idea <Check size={17}/></button></div></div>}
  </div>;
}

function Missions({ data, onStart }: { data: AppData; onStart: () => void }) {
  return <div className="page-enter"><PageTitle eyebrow="A LITTLE CHALLENGE, A BIG IDEA" title="Missions." description="Follow a trail of challenges. Every step makes the idea clearer."/><section className="mission-list-card"><div className="mission-art"><div className="mission-sun"/><span className="mission-orbit orb-a"/><span className="mission-orbit orb-b"/><span className="mission-rock">½</span><span className="mission-spark spark-1">✦</span><span className="mission-spark spark-2">✧</span><small>FRACTION<br/>GALAXY</small></div><div className="mission-info"><div className="mission-status">{data.mission.completed ? <><CheckCircle2 size={14}/> MISSION COMPLETE</> : <><span className="live-dot"/> READY WHEN YOU ARE</>}</div><h2>Fraction Galaxy</h2><p>Help the Star Keeper split moon-pies fairly. Along the way, you’ll discover what fractions really mean.</p><div className="mission-tags"><span>Math</span><span>3 challenges</span><span>About 6 min</span></div><div className="mission-progress"><div className="mission-progress-label"><span>Your journey</span><b>{data.mission.completed ? '3 of 3' : `${data.mission.currentStep} of 3`}</b></div><div className="progress-line"><span style={{width: data.mission.completed ? '100%' : `${data.mission.currentStep / 3 * 100}%`}}/></div></div><button className="button button-dark" onClick={onStart}>{data.mission.completed ? 'Play it again' : data.mission.currentStep ? 'Continue mission' : 'See the mission'}<ArrowRight size={17}/></button></div></section><div className="mission-note"><Lightbulb size={17}/><span>There’s no timer. You can ask for a hint whenever you need one.</span></div></div>;
}

function Mission({ data, onStep, onComplete, go }: { data: AppData; onStep: (step: number) => void; onComplete: () => void; go: (p: string) => void }) {
  const [step, setStep] = useState(data.mission.completed ? 0 : data.mission.currentStep);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const questions = [
    { prompt: 'The Star Keeper has one moon-pie and wants to share it equally with 2 friends. How many equal pieces should the pie be cut into?', options: ['2 pieces', '3 pieces', '4 pieces'], correct: '3 pieces', teach: 'Count everyone sharing: the Star Keeper plus 2 friends makes 3 people. Three equal pieces means everyone gets one third.' },
    { prompt: 'Three equal slices make the whole moon-pie. The Star Keeper gives away one slice. What fraction of the pie is left?', options: ['1/3', '2/3', '3/3'], correct: '2/3', teach: 'There were 3 equal slices. One went to a friend, so 2 of those 3 slices are still there: two thirds.' },
    { prompt: 'A tiny moon is split into 4 equal parts. The crew uses 2 parts. What fraction did they use?', options: ['1/4', '2/4', '4/2'], correct: '2/4', teach: 'The bottom number tells you there are 4 equal parts. The top number tells you 2 were used. That is two fourths, also called one half.' },
  ];
  const question = questions[Math.min(step, 2)];
  const check = () => {
    if (!answer) { setFeedback('Choose an answer to keep going.'); return; }
    if (answer === question.correct) { setFeedback('That’s it. You reasoned it out!'); }
    else setFeedback('Not quite yet. Try another answer, or open a hint.');
  };
  const advance = () => { setAnswer('');setHint(false);setFeedback(''); if (step < 2) { const next = step + 1;setStep(next);onStep(next); } else { setFinished(true); onComplete(); } };
  if (finished) return <div className="mission-finish page-enter"><button className="back-link" onClick={() => go('/missions')}><ArrowLeft size={16}/> Back to missions</button><div className="finish-badge"><Trophy size={38}/><span>NEW BADGE</span></div><div className="eyebrow">THAT WAS SOME CLEVER THINKING</div><h1>Galaxy helper,<br/>you did it.</h1><p>You helped make the moon-pies fair for everyone. Fractions are a way to describe equal parts of a whole.</p><div className="reward-row"><div><Zap size={18}/><b>+120 XP</b></div><div><Award size={18}/><b>Fraction explorer</b></div></div><button className="button button-dark" onClick={() => go('/missions')}>Back to missions <ArrowRight size={17}/></button></div>;
  return <div className="page-enter mission-play"><button className="back-link" onClick={() => go('/missions')}><ArrowLeft size={16}/> Leave mission</button><div className="play-top"><div><div className="eyebrow">FRACTION GALAXY · CHALLENGE {step + 1} OF 3</div><h1>Moon-pie rescue</h1></div><div className="play-progress">{questions.map((_,i)=><span className={i<=step?'on':''} key={i}/>)}</div></div><div className="mission-play-grid"><div className="story-panel"><div className="story-sky"><div className="story-moon">½</div><span className="story-star ss1">✦</span><span className="story-star ss2">✧</span><span className="story-star ss3">✦</span><div className="space-caption">A SMALL PROBLEM<br/>IN A VERY BIG PLACE</div></div><div className="story-text"><span className="story-label">THE STORY</span><p>At the edge of the Milky Way, the Star Keeper is packing moon-pies for the crew. Each pie needs to be shared fairly, with no crumbs left behind.</p><div className="concept-tag"><span>Today's idea</span><b>Equal parts make fractions</b></div></div></div><div className="challenge-panel"><div className="challenge-top"><span className="challenge-number">0{step + 1}</span><span>YOUR CHALLENGE</span></div><h2>{question.prompt}</h2><div className="answer-options">{question.options.map((option, i) => <button key={option} className={`answer-option ${answer===option?'chosen':''} ${feedback.includes('reasoned')&&answer===option?'correct':''}`} onClick={() => {setAnswer(option);setFeedback('');}}><span className="option-letter">{String.fromCharCode(65+i)}</span>{option}{answer===option&&<Check size={17}/>}</button>)}</div>{hint&&<div className="hint-box"><Lightbulb size={18}/><div><b>A little breakdown</b><p>{question.teach}</p></div></div>}{feedback&&<div className={`answer-feedback ${feedback.includes('reasoned')?'success':''}`}>{feedback}</div>}<div className="challenge-actions"><button className="hint-action" onClick={() => setHint(!hint)}><CircleHelp size={16}/>{hint?'Hide hint':'I need a hint'}</button>{feedback.includes('reasoned')?<button className="button button-dark" onClick={advance}>{step===2?'Finish mission':'Next challenge'}<ArrowRight size={16}/></button>:<button className="button button-dark" onClick={check}>Check answer <Check size={16}/></button>}</div><div className="no-rush"><ShieldCheck size={14}/> No timer. Take all the time you need.</div></div></div></div>;
}

const gameList = [
  { name:'Math Dash', sub:'Quick-fire number patterns', category:'MATH', time:'2 min', theme:'game-dash', symbol:'÷', instruction:'Which number completes the pattern: 4, 8, 12, __?', choices:['14','16','18'], correct:'16', explainer:'The pattern adds 4 each time: 4, 8, 12, then 16.' },
  { name:'Memory Match', sub:'Find pairs that belong together', category:'MEMORY', time:'2 min', theme:'game-memory', symbol:'◒', instruction:'Which fraction is the same as one half?', choices:['2/4','1/3','3/4'], correct:'2/4', explainer:'Two out of four equal pieces cover exactly half of the whole.' },
  { name:'Robot Logic', sub:'Think ahead, step by step', category:'LOGIC', time:'3 min', theme:'game-robot', symbol:'□', instruction:'A robot moves 2 spaces forward, then turns right. What does it do next?', choices:['Turns left','Moves forward in a new direction','Moves backward'], correct:'Moves forward in a new direction', explainer:'After turning right, the robot faces a new direction. Its next forward move follows that direction.' },
  { name:'Word Wizard', sub:'Make a word from clues', category:'WORDS', time:'2 min', theme:'game-words', symbol:'Aa', instruction:'Which word means “to look closely and notice”?', choices:['Observe','Imagine','Whisper'], correct:'Observe', explainer:'To observe is to look carefully and notice details.' },
];
function Games({ data, finish }: { data: AppData; finish: (n: string, x: number) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(false);
  const game = gameList.find(g => g.name === active);
  const close = () => { setActive(null);setAnswer('');setResult(false); };
  return <div className="page-enter">{!game ? <><PageTitle eyebrow="PLAY WITH A PURPOSE" title="Brain games." description="Short, satisfying challenges that give your thinking a workout."/><div className="game-grid">{gameList.map((g,i)=><button key={g.name} className={`game-card ${g.theme}`} onClick={() => setActive(g.name)}><div className="game-art"><span className="game-symbol">{g.symbol}</span><span className="game-level">0{i+1}</span><span className="game-decoration dec-one"/><span className="game-decoration dec-two"/></div><div className="game-card-body"><div className="game-meta"><span>{g.category}</span><span>{g.time}</span></div><h3>{g.name}</h3><p>{g.sub}</p><div className="game-start"><span>{data.games[g.name] ? `Played ${data.games[g.name]} ${data.games[g.name]===1?'time':'times'}` : 'Ready to play'}</span><span><Play size={14} fill="currentColor"/></span></div></div></button>)}</div><div className="game-footer"><Gamepad2 size={19}/><p>Every game has a real idea hiding inside. Play, notice, learn.</p></div></> : <div className="game-play-card"><button className="back-link" onClick={close}><ArrowLeft size={16}/> All games</button><div className={`game-play-head ${game.theme}`}><span className="game-play-symbol">{game.symbol}</span><div><div className="eyebrow">{game.category} · QUICK ROUND</div><h1>{game.name}</h1></div></div><div className="game-question"><span className="eyebrow">YOUR CHALLENGE</span><h2>{game.instruction}</h2><div className="game-answers">{game.choices.map((c,i)=><button key={c} className={`answer-option ${answer===c?'chosen':''} ${result&&answer===game.correct?'correct':''}`} onClick={()=>{setAnswer(c);setResult(false);}}><span className="option-letter">{String.fromCharCode(65+i)}</span>{c}</button>)}</div>{result&&<div className={`hint-box ${answer===game.correct?'game-right':'game-wrong'}`}><CheckCircle2 size={18}/><div><b>{answer===game.correct?'You got it!':'Good try — here’s the idea'}</b><p>{game.explainer}</p></div></div>}<button className="button button-dark" disabled={!answer} onClick={()=>{if(!result){setResult(true);if(answer===game.correct)finish(game.name,15);}else close();}}>{result?'Play another':'Check my thinking'}<ArrowRight size={16}/></button></div></div>}</div>;
}

function Practice({ data, onDone }: { data: AppData; onDone: (n:number)=>void }) {
  const qs = [
    { q:'A pizza is cut into 8 equal slices. You eat 3. What fraction is left?', choices:['3/8','5/8','8/5'], answer:'5/8', why:'Eight slices were there and three were eaten, so five of the eight slices remain.' },
    { q:'Which is bigger: one half or one fourth?', choices:['One half','One fourth','They are the same'], answer:'One half', why:'If the whole is split into 2 equal parts, each part is larger than when it is split into 4.' },
    { q:'Two out of four equal parts is the same as…', choices:['One half','One third','One whole'], answer:'One half', why:'Two of four parts cover half of the whole.' },
  ];
  const [index,setIndex]=useState(0);const [answer,setAnswer]=useState('');const [checked,setChecked]=useState(false);const [right,setRight]=useState(0);const [finished,setFinished]=useState(false);const [,navigate]=useLocation();
  const q=qs[index];
  const next=()=>{const total=right+(answer===q.answer?1:0);if(index===qs.length-1){setRight(total);setFinished(true);onDone(qs.length);}else{setRight(total);setIndex(index+1);setAnswer('');setChecked(false);}};
  if(finished)return <div className="practice-finish page-enter"><div className="finish-badge practice-badge"><CheckCircle2 size={38}/></div><div className="eyebrow">PRACTICE, NOT PRESSURE</div><h1>You showed up.<br/>That’s the win.</h1><p>You got {right} out of {qs.length} questions right. Now you’ve got a little more fraction know-how for next time.</p><div className="practice-score"><span>QUESTIONS ANSWERED</span><b>{data.activity.questionsAnswered + qs.length}</b></div><button className="button button-dark" onClick={()=>{setIndex(0);setRight(0);setFinished(false);setAnswer('');setChecked(false);}}>Try another round <ArrowRight size={16}/></button></div>;
  return <div className="page-enter"><button className="back-link" onClick={()=>navigate('/')}><ArrowLeft size={16}/> Back home</button><div className="practice-wrap"><div className="practice-progress">{qs.map((_,i)=><span key={i} className={i<index?'done':i===index?'current':''}/>)}</div><div className="eyebrow">FRACTION PRACTICE · QUESTION {index+1} OF {qs.length}</div><h1>Let’s see what<br/>you’ve noticed.</h1><div className="practice-question"><span className="question-mark">?</span><h2>{q.q}</h2><div className="answer-options">{q.choices.map((c,i)=><button key={c} className={`answer-option ${answer===c?'chosen':''} ${checked&&answer===q.answer?'correct':''}`} onClick={()=>{setAnswer(c);setChecked(false);}}><span className="option-letter">{String.fromCharCode(65+i)}</span>{c}</button>)}</div>{checked&&<div className={`hint-box ${answer===q.answer?'game-right':'game-wrong'}`}><Lightbulb size={17}/><div><b>{answer===q.answer?'Exactly right.':'Here’s the thinking.'}</b><p>{q.why}</p></div></div>}<button className="button button-dark practice-submit" disabled={!answer} onClick={()=>checked?next():setChecked(true)}>{checked?(index===qs.length-1?'Finish practice':'Next question'):'Check answer'}<ArrowRight size={16}/></button></div><div className="practice-reassure"><ShieldCheck size={15}/> This is just for you. Every try teaches you something.</div></div></div>;
}

function Create({ data, onSave }: { data: AppData; onSave: (c:Creation)=>void }) {
  const [title,setTitle]=useState('');const [topic,setTopic]=useState('');const [content,setContent]=useState('');const [type,setType]=useState('Explanation');const [notice,setNotice]=useState('');
  const save=()=>{if(!title.trim()||!content.trim()){setNotice('Add a title and a few words to save your idea.');return;}onSave({id:Date.now().toString(),title:title.trim(),topic:topic.trim()||'My ideas',content:content.trim(),type,createdAt:'Just now'});setTitle('');setTopic('');setContent('');setNotice('');};
  return <div className="page-enter"><PageTitle eyebrow="YOUR IDEAS, YOUR WORDS" title="Make it make sense." description="Explain something you learned, or invent a story around it."/><div className="create-layout"><section className="create-form-card"><div className="create-card-top"><span className="create-mark"><PenLine size={20}/></span><div><b>A fresh page</b><small>Start with what you know. Let curiosity take it from there.</small></div></div><label className="field-label">What are you making?</label><div className="type-select">{['Explanation','Story'].map(t=><button key={t} className={type===t?'chosen':''} onClick={()=>setType(t)}>{t==='Story'?<Sparkles size={15}/>:<Lightbulb size={15}/>} {t}</button>)}</div><label className="field-label" htmlFor="create-title">Give it a title</label><input id="create-title" data-testid="input-create-title" className="form-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder={type==='Story'?'The little moon who got lost':'Why the moon changes shape'}/><label className="field-label" htmlFor="create-topic">A topic (optional)</label><input id="create-topic" className="form-input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Space, fractions, my cat…"/><label className="field-label" htmlFor="create-content">Put your idea into words</label><textarea id="create-content" className="form-input create-textarea" value={content} onChange={e=>setContent(e.target.value)} placeholder={type==='Story'?'Once upon a time, beyond the clouds…':'I learned that…'} rows={7}/><div className="create-submit-row"><span><LockKeyhole size={13}/> Saved just on this device</span><button className="button button-dark" onClick={save}><Plus size={16}/> Save my idea</button></div>{notice&&<div className="form-notice">{notice}</div>}</section><aside className="saved-ideas"><div className="saved-head"><div><div className="eyebrow">THE THINGS YOU'VE MADE</div><h2>Your idea shelf</h2></div><span>{data.creations.length}</span></div>{data.creations.length===0?<div className="empty-shelf"><PenLine size={20}/><b>Your shelf is waiting.</b><p>Save a thought and it’ll live here.</p></div>:data.creations.map(c=><article key={c.id} className="saved-idea"><div className="saved-type">{c.type==='Story'?<Sparkles size={13}/>:<Lightbulb size={13}/>} {c.type} <span>· {c.topic}</span></div><h3>{c.title}</h3><p>{c.content}</p><small>{c.createdAt}</small></article>)}</aside></div></div>;
}

const badgeInfo = [
  {name:'Curious starter',desc:'You began your learning adventure.',icon:Sparkles, earned:true},
  {name:'Four-day spark',desc:'Showed up to learn four days in a row.',icon:Flame,earned:true},
  {name:'Fraction explorer',desc:'Completed the Fraction Galaxy mission.',icon:Target,earned:false},
  {name:'Idea maker',desc:'Saved your first explanation or story.',icon:PenLine,earned:false},
  {name:'Bright streak',desc:'Reach a seven-day learning streak.',icon:Zap,earned:false},
  {name:'Trail finder',desc:'Explore ten different lessons.',icon:Compass,earned:false},
];
function Achievements({ data }: { data: AppData }) {
  const earnedNames=new Set(data.badges);
  return <div className="page-enter"><PageTitle eyebrow="NOTICE HOW FAR YOU'VE COME" title="Your bright spots." description="Every badge is a little reminder of what you can do."/><div className="achievement-summary"><div className="achievement-medal"><Trophy size={27}/></div><div><b>{data.badges.length} bright spots so far</b><span>There’s always another thing to discover.</span></div><div className="achievement-counter"><strong>{data.badges.length}</strong><small>OF {badgeInfo.length}</small></div></div><div className="badge-grid">{badgeInfo.map((b,i)=>{const unlocked=earnedNames.has(b.name);const Icon=b.icon;return <div key={b.name} className={`badge-card ${unlocked?'unlocked':'locked'}`}><div className="badge-art"><span className="badge-number">0{i+1}</span><Icon size={25}/>{!unlocked&&<span className="badge-lock"><LockKeyhole size={14}/></span>}</div><div className="badge-content"><span className={`badge-state ${unlocked?'state-earned':'state-locked'}`}>{unlocked?<><Check size={12}/> EARNED</>:'STILL AHEAD'}</span><h3>{b.name}</h3><p>{b.desc}</p></div></div>})}</div><div className="progress-nudge"><div className="nudge-icon"><ArrowDownRight size={21}/></div><div><b>Progress is more than a badge.</b><p>Every question you try and idea you make counts as growth. Keep following what interests you.</p></div></div></div>;
}

function ProfilePage({ data, save }: { data: AppData; save:(p:Profile)=>void }) {
  const [draft,setDraft]=useState(data.profile);const [saved,setSaved]=useState(false);
  useEffect(()=>{setDraft(data.profile);},[data.profile]);
  const avatars=['A','B','C','D','E','F'];
  const interests=['Space','Animals','Drawing','Sports','Music','Puzzles','Nature','Stories'];
  const toggle=(interest:string)=>setDraft(p=>({...p,interests:p.interests.includes(interest)?p.interests.filter(i=>i!==interest):[...p.interests,interest]}));
  const submit=(e:FormEvent)=>{e.preventDefault();if(!draft.name.trim())return;save({...draft,name:draft.name.trim(),age:Number(draft.age)});setSaved(true);window.setTimeout(()=>setSaved(false),2000);};
  return <div className="page-enter"><PageTitle eyebrow="THIS SPACE IS YOURS" title="A little about you." description="Make your learning space feel like yours. You can change things anytime."/><form className="profile-layout" onSubmit={submit}><section className="profile-card"><div className="profile-preview"><div className="profile-avatar-large">{draft.avatar}</div><div><span className="eyebrow">YOUR LEARNER CARD</span><h2>{draft.name||'Your name'}</h2><p>{draft.grade} · Level {data.profile.level}</p></div><span className="preview-star"><Star size={20} fill="currentColor"/></span></div><div className="profile-fields"><label className="field-label" htmlFor="profile-name">What should we call you?</label><input id="profile-name" className="form-input" value={draft.name} maxLength={24} onChange={e=>setDraft({...draft,name:e.target.value})}/><div className="two-fields"><div><label className="field-label" htmlFor="profile-age">Your age</label><select id="profile-age" className="form-input" value={draft.age} onChange={e=>setDraft({...draft,age:Number(e.target.value)})}>{Array.from({length:13},(_,i)=>i+5).map(age=><option key={age} value={age}>{age} years old</option>)}</select></div><div><label className="field-label" htmlFor="profile-grade">Your grade</label><select id="profile-grade" className="form-input" value={draft.grade} onChange={e=>setDraft({...draft,grade:e.target.value})}>{['Grade K','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'].map(g=><option key={g}>{g}</option>)}</select></div></div><div className="field-label">Pick your avatar</div><div className="avatar-picker">{avatars.map(a=><button type="button" key={a} className={`avatar-choice ${draft.avatar===a?'selected':''}`} onClick={()=>setDraft({...draft,avatar:a})} aria-label={`Choose avatar ${a}`}>{a}</button>)}</div><div className="field-label">What do you like exploring?</div><div className="interest-picker">{interests.map(i=><button type="button" key={i} className={`interest-chip ${draft.interests.includes(i)?'picked':''}`} onClick={()=>toggle(i)}>{draft.interests.includes(i)&&<Check size={12}/>} {i}</button>)}</div><button className="button button-dark save-profile" type="submit">{saved?<><Check size={16}/> Saved!</>:<>Save my profile <ArrowRight size={16}/></>}</button></div></section><aside className="profile-side"><div className="profile-stat-card"><div className="eyebrow">YOUR LEARNING SO FAR</div><div className="profile-level-circle"><span>LEVEL</span><b>{data.profile.level}</b></div><h3>{data.profile.xp} XP</h3><p>Every bit of progress is yours to keep.</p><div className="progress-line"><span style={{width:`${data.profile.xp%100}%`}}/></div><div className="profile-next">{100-data.profile.xp%100} XP to level {data.profile.level+1}</div></div><div className="privacy-card"><LockKeyhole size={17}/><div><b>Just your device.</b><p>Your profile and progress live in this browser only. Nothing is syncing to an account.</p></div></div></aside></form></div>;
}
function NotFound({go}:{go:(p:string)=>void}) { return <div className="not-found"><div className="eyebrow">WRONG TURN? ALL PART OF THE ADVENTURE.</div><h1>Nothing here<br/>for now.</h1><p>That page isn’t on this trail.</p><button className="button button-dark" onClick={()=>go('/')}>Head back home <ArrowRight size={16}/></button></div>; }

export default App;

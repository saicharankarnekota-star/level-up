import { Link } from 'wouter';
import { Trophy } from 'lucide-react';
import { useProfile } from '../store/progress';
import { PageTitle } from '../layout/AppShell';
import { games } from './games/gameList';

export function Games() {
  const { profile } = useProfile();
  return (
    <div className="page-enter">
      <PageTitle eyebrow="GAMES" title="Play with what you learned" description={`Games use Grade ${profile.grade} questions. Beat your best score!`} />
      <div className="grid gap-4 sm:grid-cols-2">
        {games.map((g) => (
          <Link key={g.id} href={`/games/${g.id}`} className="group overflow-hidden rounded-3xl border border-[#E6E1D6] bg-[#FFFDF8] transition hover:-translate-y-1 hover:shadow-lg">
            <div className={`grid h-32 place-items-center text-7xl transition group-hover:scale-105 ${g.tone}`}>{g.emoji}</div>
            <div className="p-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A92A2]">{g.subject}</div>
              <h3 className="mt-1 font-['Space_Grotesk'] text-xl font-semibold text-[#232B40]">{g.title}</h3>
              <p className="mt-1 text-sm text-[#6B7385]">{g.description}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#A0782A]">
                <Trophy size={13} /> {profile.gameBest[g.id] ? `Best: ${profile.gameBest[g.id]}` : 'Not played yet'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

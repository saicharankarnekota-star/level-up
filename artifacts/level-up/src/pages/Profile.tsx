import { useState } from 'react';
import { Palette, RotateCcw, Trash2, Users } from 'lucide-react';
import type { Grade } from '../types';
import { useProfile } from '../store/progress';
import { levelInfo } from '../store/rewards';
import { badgeRules } from '../store/badges';
import { topics } from '../data/topics';
import { friendlyDate } from '../lib/date';
import { PageTitle } from '../layout/AppShell';
import { AvatarRenderer } from '../components/avatar/AvatarRenderer';
import { AvatarCustomizerModal } from '../components/avatar/AvatarCustomizerModal';

export function Profile() {
  const { profile, updateProfile, resetProgress, deleteProfile, switchProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [studioOpen, setStudioOpen] = useState(false);
  const lvl = levelInfo(profile.xp);
  const s = profile.stats;
  const accuracy = s.questionsAnswered ? Math.round((s.correctAnswers / s.questionsAnswered) * 100) : 0;

  const stats = [
    { label: 'Topics starred', value: `${topics.filter((t) => (profile.topics[t.id]?.stars ?? 0) > 0).length}/${topics.length}` },
    { label: 'Questions answered', value: s.questionsAnswered },
    { label: 'Accuracy', value: `${accuracy}%` },
    { label: 'Games played', value: s.gamesPlayed },
    { label: 'Mistakes fixed', value: s.mistakesReviewed },
    { label: 'Badges', value: `${Object.keys(profile.badges).length}/${badgeRules.length}` },
    { label: 'Best streak', value: `${profile.bestStreak} days` },
    { label: 'Missions', value: profile.missionsCompleted.length },
  ];

  return (
    <div className="page-enter">
      <PageTitle eyebrow="PROFILE" title="Your learner profile" description={`Learning since ${friendlyDate(profile.createdAt)}`} />
      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-preview">
            <AvatarRenderer config={profile.avatarConfig} size={64} />
            <div><div className="eyebrow">LEVEL {lvl.level} LEARNER</div><h2>{profile.name}</h2><p>Grade {profile.grade} · {profile.xp} XP</p></div>
          </div>
          <form className="profile-fields" onSubmit={(e) => { e.preventDefault(); if (name.trim()) updateProfile({ name: name.trim() }); }}>
            <label className="field-label" htmlFor="profile-name">Name</label>
            <div className="flex gap-2">
              <input id="profile-name" className="form-input" maxLength={20} value={name} onChange={(e) => setName(e.target.value)} />
              <button type="submit" className="button button-dark" disabled={!name.trim() || name.trim() === profile.name}>Save</button>
            </div>
            <div className="field-label">Grade</div>
            <div className="grid grid-cols-2 gap-2">
              {([1, 2] as Grade[]).map((g) => (
                <button key={g} type="button" onClick={() => g !== profile.grade && updateProfile({ grade: g })}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold ${profile.grade === g ? 'border-[#27314D] bg-[#FFF3C4]' : 'border-[#E6E1D6] bg-white'}`}>Grade {g}</button>
              ))}
            </div>
            <div className="field-label">Avatar</div>
            <button type="button" className="button button-yellow w-full" onClick={() => setStudioOpen(true)}><Palette size={15} /> Open avatar studio</button>

            <div className="mt-6 grid gap-2 border-t border-[#EEECE5] pt-5 sm:grid-cols-3">
              <button type="button" className="button bg-white text-[#27314D] border border-[#E0DBCF]" onClick={() => switchProfile(null)}><Users size={15} /> Switch learner</button>
              <button type="button" className="button bg-[#FFF7E6] text-[#A0782A]"
                onClick={() => window.confirm('Reset all progress for this learner? XP, stars and badges will be cleared.') && resetProgress()}><RotateCcw size={15} /> Reset progress</button>
              <button type="button" className="button bg-[#FDECEC] text-[#B42318]"
                onClick={() => window.confirm(`Delete ${profile.name}'s profile forever?`) && deleteProfile(profile.id)}><Trash2 size={15} /> Delete learner</button>
            </div>
          </form>
        </div>

        <div className="profile-side">
          <div className="profile-stat-card">
            <div className="eyebrow">LEVEL PROGRESS</div>
            <div className="profile-level-circle"><span>LEVEL</span><b>{lvl.level}</b></div>
            <h3>{profile.xp} XP</h3>
            <p>{lvl.toNext} XP to Level {lvl.level + 1}</p>
            <div className="progress-line"><span style={{ width: `${(lvl.into / lvl.span) * 100}%` }} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {stats.map((st) => (
              <div key={st.label} className="rounded-2xl border border-[#E6E1D6] bg-[#FFFDF8] p-3">
                <div className="font-['Space_Grotesk'] text-xl font-semibold text-[#232B40]">{st.value}</div>
                <div className="text-[11px] font-bold text-[#8A92A2]">{st.label}</div>
              </div>
            ))}
          </div>
          <div className="privacy-card"><Users size={18} /><div><b>Saved on this device</b><p>Progress is stored in this browser only. Each learner on this device has their own profile.</p></div></div>
        </div>
      </div>

      {studioOpen && (
        <AvatarCustomizerModal isOpen onClose={() => setStudioOpen(false)} currentConfig={profile.avatarConfig}
          onSave={(avatarConfig) => updateProfile({ avatarConfig })} userName={profile.name} />
      )}
    </div>
  );
}

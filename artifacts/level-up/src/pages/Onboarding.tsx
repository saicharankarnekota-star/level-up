import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import type { AvatarCharacter, AvatarColorTheme, Grade } from '../types';
import { GRADES } from '../data/grades';
import { useProgress } from '../store/progress';
import { levelInfo } from '../store/rewards';
import { AvatarRenderer, defaultAvatarConfig } from '../components/avatar/AvatarRenderer';
import { SpeakButton } from '../components/SpeakButton';

const characters: AvatarCharacter[] = ['astronaut', 'robot', 'owl', 'fox', 'cat', 'dino', 'wizard', 'star'];
const colors: { id: AvatarColorTheme; hex: string }[] = [
  { id: 'gold', hex: '#F4CF55' }, { id: 'cyan', hex: '#4ECDC4' }, { id: 'emerald', hex: '#58A986' },
  { id: 'purple', hex: '#9D4EDD' }, { id: 'coral', hex: '#FF6B6B' }, { id: 'navy', hex: '#3D5A80' },
];

export function Onboarding() {
  const { profiles, createProfile, switchProfile } = useProgress();
  const [creating, setCreating] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(1);
  const [character, setCharacter] = useState<AvatarCharacter>('astronaut');
  const [color, setColor] = useState<AvatarColorTheme>('gold');
  const avatar = { ...defaultAvatarConfig, character, colorTheme: color, accessory: 'none' as const };

  return (
    <div className="min-h-dvh bg-[#F9F7F0] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="brand justify-center pb-6 text-[#27314D]">
          <span className="brand-mark"><span /></span>
          <span>LEVEL<span className="text-[#D9A928]">UP</span><small className="text-[#8A92A2]">SEE IT · LEARN IT · PLAY IT</small></span>
        </div>

        {!creating ? (
          <div className="page-enter rounded-3xl border border-[#E5E1D7] bg-white p-6 text-center">
            <h1 className="font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">Who is learning today?</h1>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profiles.map((p) => (
                <button key={p.id} type="button" onClick={() => switchProfile(p.id)}
                  className="rounded-2xl border-2 border-[#E6E1D6] p-4 transition hover:-translate-y-0.5 hover:border-[#27314D]">
                  <div className="flex justify-center"><AvatarRenderer config={p.avatarConfig} size={72} /></div>
                  <b className="mt-2 block text-[#27314D]">{p.name}</b>
                  <small className="text-[#6B7385]">Grade {p.grade} · Level {levelInfo(p.xp).level}</small>
                </button>
              ))}
              <button type="button" onClick={() => setCreating(true)}
                className="grid place-items-center rounded-2xl border-2 border-dashed border-[#CFC9BA] p-4 text-[#6B7385] hover:border-[#27314D]">
                <span><Plus className="mx-auto" /> New learner</span>
              </button>
            </div>
          </div>
        ) : (
          <form className="page-enter rounded-3xl border border-[#E5E1D7] bg-white p-6"
            onSubmit={(e) => { e.preventDefault(); if (name.trim()) createProfile(name, grade, avatar); }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">Hi there! Let's get you ready 🚀</h1>
                <p className="mt-1 text-sm text-[#6B7385]">See ideas come alive, learn them, then play with them.</p>
              </div>
              <SpeakButton text="Hi there! Type your name, pick your grade, and choose a buddy." />
            </div>

            <label className="field-label text-sm" htmlFor="name">What is your name?</label>
            <input id="name" className="form-input h-12 text-base" maxLength={20} placeholder="Type your name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />

            <div className="field-label text-sm">Which grade are you in?</div>
            <div className="grid gap-3 sm:grid-cols-3">
              {GRADES.map(({ grade: g, emoji, blurb }) => (
                <button key={g} type="button" onClick={() => setGrade(g)}
                  className={`rounded-2xl border-2 p-4 text-left transition ${grade === g ? 'border-[#27314D] bg-[#FFF3C4]' : 'border-[#E6E1D6] hover:border-[#27314D]'}`}>
                  <div className="text-3xl">{emoji}</div>
                  <b className="font-['Space_Grotesk'] text-lg">Grade {g}</b>
                  <small className="block text-[#6B7385]">{blurb}</small>
                </button>
              ))}
            </div>

            <div className="field-label text-sm">Pick your buddy</div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <AvatarRenderer config={avatar} size={110} animate />
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-2">
                  {characters.map((c) => (
                    <button key={c} type="button" onClick={() => setCharacter(c)} aria-label={c}
                      className={`grid place-items-center rounded-2xl border-2 p-1.5 ${character === c ? 'border-[#27314D] bg-[#FFF3C4]' : 'border-[#E6E1D6]'}`}>
                      <AvatarRenderer config={{ ...avatar, character: c }} size={46} />
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  {colors.map((c) => (
                    <button key={c.id} type="button" aria-label={c.id} onClick={() => setColor(c.id)}
                      className={`h-8 w-8 rounded-full border-2 ${color === c.id ? 'border-[#27314D] ring-2 ring-[#27314D]/20' : 'border-white'}`} style={{ background: c.hex }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {profiles.length > 0 ? <button type="button" className="text-sm font-bold text-[#6B7385]" onClick={() => setCreating(false)}>← Back</button> : <span />}
              <button type="submit" className="button button-yellow min-h-12 px-6 text-sm" disabled={!name.trim()}>Start learning <ArrowRight size={16} /></button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

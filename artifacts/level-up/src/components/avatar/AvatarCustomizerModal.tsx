import React, { useState } from 'react';
import {
  Sparkles, X, Check, Dices, RefreshCw, Palette,
  Crown, Smile, Compass, User
} from 'lucide-react';
import type {
  AvatarConfig,
  AvatarCharacter,
  AvatarExpression,
  AvatarColorTheme,
  AvatarAccessory,
  AvatarAura,
} from '../../types';
import { AvatarRenderer, defaultAvatarConfig } from './AvatarRenderer';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSave: (newConfig: AvatarConfig) => void;
  userName?: string;
}

const characters: { id: AvatarCharacter; name: string; desc: string; icon: string }[] = [
  { id: 'astronaut', name: 'Astronaut', desc: 'Space wanderer', icon: '🚀' },
  { id: 'robot', name: 'Cyber Bot', desc: 'Logic master', icon: '🤖' },
  { id: 'owl', name: 'Wise Owl', desc: 'Curious scholar', icon: '🦉' },
  { id: 'fox', name: 'Clever Fox', desc: 'Quick thinker', icon: '🦊' },
  { id: 'cat', name: 'Tech Cat', desc: 'Sharp explorer', icon: '🐱' },
  { id: 'dino', name: 'Dino Genius', desc: 'Mighty learner', icon: '🦖' },
  { id: 'wizard', name: 'Wizard', desc: 'Idea conjurer', icon: '🧙' },
  { id: 'star', name: 'Star Hero', desc: 'Bright spark', icon: '⭐' },
];

const expressions: { id: AvatarExpression; name: string; desc: string; icon: string }[] = [
  { id: 'happy', name: 'Happy', desc: 'Warm joyful smile', icon: '😊' },
  { id: 'focused', name: 'Focused', desc: 'Determined thinker', icon: '🧐' },
  { id: 'curious', name: 'Curious', desc: 'Eager questioner', icon: '🤓' },
  { id: 'cool', name: 'Cool', desc: 'Confident shades', icon: '😎' },
  { id: 'winking', name: 'Winking', desc: 'Playful spirit', icon: '😉' },
  { id: 'excited', name: 'Excited', desc: 'Starry excitement', icon: '🤩' },
];

const colorThemes: { id: AvatarColorTheme; name: string; hex: string; desc: string }[] = [
  { id: 'gold', name: 'Solar Gold', hex: '#F4CF55', desc: 'Bright & warm' },
  { id: 'cyan', name: 'Electric Teal', hex: '#4ECDC4', desc: 'Fresh & energetic' },
  { id: 'emerald', name: 'Forest Mint', hex: '#58A986', desc: 'Steady & calm' },
  { id: 'purple', name: 'Cyber Violet', hex: '#9D4EDD', desc: 'Mystical & bold' },
  { id: 'coral', name: 'Sunset Rose', hex: '#FF6B6B', desc: 'Spirited & bright' },
  { id: 'navy', name: 'Midnight Deep', hex: '#3D5A80', desc: 'Sharp & cool' },
];

const accessories: { id: AvatarAccessory; name: string; desc: string; icon: string }[] = [
  { id: 'none', name: 'No Gear', desc: 'Classic look', icon: '✨' },
  { id: 'helmet', name: 'Astro Helmet', desc: 'Glass shield', icon: '🪖' },
  { id: 'gradcap', name: 'Scholar Cap', desc: 'Academic master', icon: '🎓' },
  { id: 'wizardhat', name: 'Magic Hat', desc: 'Spellbound hat', icon: '🧙‍♂️' },
  { id: 'headphones', name: 'Headphones', desc: 'Focus vibes', icon: '🎧' },
  { id: 'crown', name: 'Golden Crown', desc: 'Victory royalty', icon: '👑' },
  { id: 'goggles', name: 'Goggles', desc: 'Inventor specs', icon: '🥽' },
];

const auras: { id: AvatarAura; name: string; desc: string; icon: string }[] = [
  { id: 'orbit', name: 'Orbital Ring', desc: 'Cosmic satellite ring', icon: '🪐' },
  { id: 'flame', name: 'Strike Flame', desc: 'Day-to-day streak fire', icon: '🔥' },
  { id: 'circuits', name: 'Circuit Matrix', desc: 'Digital pathways', icon: '⚡' },
  { id: 'leaf', name: 'Nature Aura', desc: 'Swirling green leaves', icon: '🍃' },
  { id: 'rainbow', name: 'Spectrum Pulse', desc: 'Prismatic pulse ring', icon: '🌈' },
  { id: 'none', name: 'Minimal', desc: 'Clean background', icon: '⚪' },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
  userName = 'Learner',
}) => {
  const [draft, setDraft] = useState<AvatarConfig>(() => ({
    ...defaultAvatarConfig,
    ...currentConfig,
  }));
  const [tab, setTab] = useState<'character' | 'expression' | 'color' | 'gear' | 'aura'>('character');

  if (!isOpen) return null;

  const randomize = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)].id;
    const randomExpr = expressions[Math.floor(Math.random() * expressions.length)].id;
    const randomCol = colorThemes[Math.floor(Math.random() * colorThemes.length)].id;
    const randomAcc = accessories[Math.floor(Math.random() * accessories.length)].id;
    const randomAur = auras[Math.floor(Math.random() * auras.length)].id;
    setDraft({
      character: randomChar,
      expression: randomExpr,
      colorTheme: randomCol,
      accessory: randomAcc,
      aura: randomAur,
    });
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FFFDF8] border border-[#E5E1D8] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFECE5] bg-[#27314D] text-[#F7F5EE]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#F4CF55] text-[#202842]">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold font-['Space_Grotesk'] tracking-tight">Avatar Studio</h2>
              <p className="text-xs text-[#A8B0C1]">Design your personal learning companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8B0C1] hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Studio Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden flex-1">
          {/* Left Column: Live Preview & Presets */}
          <div className="md:col-span-5 p-6 bg-[#F7F5EE] border-b md:border-b-0 md:border-r border-[#E8E4DA] flex flex-col items-center justify-between">
            <div className="text-center w-full">
              <span className="text-[10px] font-bold tracking-widest text-[#7C8492] uppercase">Live Preview</span>
              <div className="my-5 p-6 rounded-2xl bg-[#202842] border border-[#39425B] shadow-inner flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold text-[#F4CF55]">
                  <Sparkles size={10} /> Active Look
                </div>
                <AvatarRenderer config={draft} size={110} animate={true} />
                <h3 className="mt-4 text-base font-bold text-[#F7F5EE] font-['Space_Grotesk']">{userName}</h3>
                <span className="text-xs text-[#9DA6B8] capitalize">
                  {draft.character} · {draft.expression}
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button
                type="button"
                onClick={randomize}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#DCD6C9] bg-white text-[#384157] text-xs font-bold hover:bg-[#EFECE3] transition active:scale-95"
              >
                <Dices size={15} /> Randomize Look
              </button>
              <div className="text-[10px] text-center text-[#8D939F]">
                Updates everywhere in LEVEL UP instantly!
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#E8E4DA] bg-white px-3 pt-3 overflow-x-auto gap-1">
              {[
                { id: 'character', label: 'Character', icon: User },
                { id: 'expression', label: 'Mood', icon: Smile },
                { id: 'color', label: 'Colors', icon: Palette },
                { id: 'gear', label: 'Gear', icon: Crown },
                { id: 'aura', label: 'Aura', icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                      active
                        ? 'border-[#27314D] text-[#27314D]'
                        : 'border-transparent text-[#7F8694] hover:text-[#27314D]'
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="p-5 overflow-y-auto max-h-[320px] flex-1">
              {/* Character selection */}
              {tab === 'character' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {characters.map((c) => {
                    const selected = draft.character === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, character: c.id }))}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                          selected
                            ? 'border-[#27314D] bg-[#27314D] text-white shadow-sm'
                            : 'border-[#E5E1D8] bg-white text-[#2B3448] hover:border-[#BFC6D4]'
                        }`}
                      >
                        <span className="text-xl">{c.icon}</span>
                        <div className="min-w-0">
                          <b className="block text-xs font-semibold">{c.name}</b>
                          <small className={`block text-[10px] truncate ${selected ? 'text-gray-300' : 'text-[#858A94]'}`}>
                            {c.desc}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Expression selection */}
              {tab === 'expression' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {expressions.map((e) => {
                    const selected = draft.expression === e.id;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, expression: e.id }))}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                          selected
                            ? 'border-[#27314D] bg-[#27314D] text-white shadow-sm'
                            : 'border-[#E5E1D8] bg-white text-[#2B3448] hover:border-[#BFC6D4]'
                        }`}
                      >
                        <span className="text-xl">{e.icon}</span>
                        <div className="min-w-0">
                          <b className="block text-xs font-semibold">{e.name}</b>
                          <small className={`block text-[10px] truncate ${selected ? 'text-gray-300' : 'text-[#858A94]'}`}>
                            {e.desc}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Color Themes */}
              {tab === 'color' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {colorThemes.map((c) => {
                    const selected = draft.colorTheme === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, colorTheme: c.id }))}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                          selected
                            ? 'border-[#27314D] bg-[#27314D] text-white shadow-sm'
                            : 'border-[#E5E1D8] bg-white text-[#2B3448] hover:border-[#BFC6D4]'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-black/20 flex-shrink-0 shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="min-w-0">
                          <b className="block text-xs font-semibold">{c.name}</b>
                          <small className={`block text-[10px] truncate ${selected ? 'text-gray-300' : 'text-[#858A94]'}`}>
                            {c.desc}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Gear / Accessories */}
              {tab === 'gear' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {accessories.map((a) => {
                    const selected = draft.accessory === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, accessory: a.id }))}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                          selected
                            ? 'border-[#27314D] bg-[#27314D] text-white shadow-sm'
                            : 'border-[#E5E1D8] bg-white text-[#2B3448] hover:border-[#BFC6D4]'
                        }`}
                      >
                        <span className="text-xl">{a.icon}</span>
                        <div className="min-w-0">
                          <b className="block text-xs font-semibold">{a.name}</b>
                          <small className={`block text-[10px] truncate ${selected ? 'text-gray-300' : 'text-[#858A94]'}`}>
                            {a.desc}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Aura */}
              {tab === 'aura' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {auras.map((u) => {
                    const selected = draft.aura === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, aura: u.id }))}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                          selected
                            ? 'border-[#27314D] bg-[#27314D] text-white shadow-sm'
                            : 'border-[#E5E1D8] bg-white text-[#2B3448] hover:border-[#BFC6D4]'
                        }`}
                      >
                        <span className="text-xl">{u.icon}</span>
                        <div className="min-w-0">
                          <b className="block text-xs font-semibold">{u.name}</b>
                          <small className={`block text-[10px] truncate ${selected ? 'text-gray-300' : 'text-[#858A94]'}`}>
                            {u.desc}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8E4DA] bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#666E7C] hover:text-[#27314D] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition shadow-md active:scale-95"
              >
                <Check size={15} /> Save My Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

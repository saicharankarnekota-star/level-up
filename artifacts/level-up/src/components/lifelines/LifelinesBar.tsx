import React from 'react';
import { Target, Lightbulb, Compass, Shield, Sparkles } from 'lucide-react';
import type { LifelineInventory } from '../../types';

interface LifelinesBarProps {
  inventory: LifelineInventory;
  onUseFiftyFifty: () => void;
  onUseAIClue: () => void;
  onUseRealLife: () => void;
  onUseSecondChance: () => void;
  disabled?: boolean;
  fiftyFiftyUsed?: boolean;
  aiClueUsed?: boolean;
  realLifeUsed?: boolean;
  secondChanceUsed?: boolean;
}

export const LifelinesBar: React.FC<LifelinesBarProps> = ({
  inventory,
  onUseFiftyFifty,
  onUseAIClue,
  onUseRealLife,
  onUseSecondChance,
  disabled = false,
  fiftyFiftyUsed = false,
  aiClueUsed = false,
  realLifeUsed = false,
  secondChanceUsed = false,
}) => {
  return (
    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#F6F3E9] via-[#FAF7EE] to-[#F6F3E9] border border-[#E7E1D2] shadow-xs">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8291] flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#D3A924]" /> Lifelines & Hints
        </span>
        <span className="text-[10px] text-[#9398A2]">Use when stuck!</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* 1. 50:50 Lifeline */}
        <button
          type="button"
          disabled={disabled || fiftyFiftyUsed || inventory.fiftyFifty <= 0}
          onClick={onUseFiftyFifty}
          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
            fiftyFiftyUsed
              ? 'border-[#DEE2E6] bg-[#ECECEC] text-[#868E96] opacity-60 cursor-not-allowed'
              : inventory.fiftyFifty > 0
              ? 'border-[#E0D7C4] bg-white text-[#2B3448] hover:border-[#27314D] hover:shadow-xs active:scale-95'
              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#9E9E9E] opacity-50'
          }`}
          title="Eliminates 2 wrong answer choices"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAEFF9] text-[#3A60A4] flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Target size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <b className="text-[11px] font-bold block truncate">50:50</b>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#E5E9F2] text-[#4A5D82] font-semibold">
                {fiftyFiftyUsed ? 'Used' : `${inventory.fiftyFifty}x`}
              </span>
            </div>
            <small className="text-[9px] text-[#858A94] block truncate">Cut 2 options</small>
          </div>
        </button>

        {/* 2. AI Clue Lifeline */}
        <button
          type="button"
          disabled={disabled || aiClueUsed || inventory.aiClue <= 0}
          onClick={onUseAIClue}
          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
            aiClueUsed
              ? 'border-[#DEE2E6] bg-[#ECECEC] text-[#868E96] opacity-60 cursor-not-allowed'
              : inventory.aiClue > 0
              ? 'border-[#E0D7C4] bg-white text-[#2B3448] hover:border-[#27314D] hover:shadow-xs active:scale-95'
              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#9E9E9E] opacity-50'
          }`}
          title="Gentle guiding thought starter"
        >
          <div className="w-7 h-7 rounded-lg bg-[#FFF6D9] text-[#9E8224] flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Lightbulb size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <b className="text-[11px] font-bold block truncate">AI Clue</b>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#FFF0BD] text-[#8F721A] font-semibold">
                {aiClueUsed ? 'Used' : `${inventory.aiClue}x`}
              </span>
            </div>
            <small className="text-[9px] text-[#858A94] block truncate">Guiding hint</small>
          </div>
        </button>

        {/* 3. Real-Life Example Lifeline */}
        <button
          type="button"
          disabled={disabled || realLifeUsed || inventory.realLife <= 0}
          onClick={onUseRealLife}
          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
            realLifeUsed
              ? 'border-[#DEE2E6] bg-[#ECECEC] text-[#868E96] opacity-60 cursor-not-allowed'
              : inventory.realLife > 0
              ? 'border-[#E0D7C4] bg-white text-[#2B3448] hover:border-[#27314D] hover:shadow-xs active:scale-95'
              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#9E9E9E] opacity-50'
          }`}
          title="See how this works in everyday life"
        >
          <div className="w-7 h-7 rounded-lg bg-[#E7F6ED] text-[#3B8A5E] flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Compass size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <b className="text-[11px] font-bold block truncate">Real Life</b>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#D4EEDB] text-[#2C754C] font-semibold">
                {realLifeUsed ? 'Used' : `${inventory.realLife}x`}
              </span>
            </div>
            <small className="text-[9px] text-[#858A94] block truncate">Real world story</small>
          </div>
        </button>

        {/* 4. Second Chance Shield */}
        <button
          type="button"
          disabled={disabled || secondChanceUsed || inventory.secondChance <= 0}
          onClick={onUseSecondChance}
          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
            secondChanceUsed
              ? 'border-[#DEE2E6] bg-[#ECECEC] text-[#868E96] opacity-60 cursor-not-allowed'
              : inventory.secondChance > 0
              ? 'border-[#E0D7C4] bg-white text-[#2B3448] hover:border-[#27314D] hover:shadow-xs active:scale-95'
              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#9E9E9E] opacity-50'
          }`}
          title="Protect your streak and get a second try"
        >
          <div className="w-7 h-7 rounded-lg bg-[#FFEFE5] text-[#B85822] flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Shield size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <b className="text-[11px] font-bold block truncate">Shield</b>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#FFE2CF] text-[#9C4B1C] font-semibold">
                {secondChanceUsed ? 'Active' : `${inventory.secondChance}x`}
              </span>
            </div>
            <small className="text-[9px] text-[#858A94] block truncate">Second chance</small>
          </div>
        </button>
      </div>
    </div>
  );
};

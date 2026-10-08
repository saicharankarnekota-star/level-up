import React from 'react';
import type { AvatarConfig, AvatarColorTheme } from '../../types';

interface AvatarRendererProps {
  config?: Partial<AvatarConfig>;
  size?: number;
  className?: string;
  animate?: boolean;
}

const colorPalettes: Record<AvatarColorTheme, { main: string; light: string; dark: string; accent: string; text: string }> = {
  gold: { main: '#F4CF55', light: '#FFF3C4', dark: '#C49718', accent: '#FF7A00', text: '#2B2510' },
  cyan: { main: '#4ECDC4', light: '#C7F8F4', dark: '#1F938B', accent: '#006699', text: '#0C2D2B' },
  emerald: { main: '#58A986', light: '#D2F0E2', dark: '#2C6D51', accent: '#26A69A', text: '#0F2C20' },
  purple: { main: '#9D4EDD', light: '#E8D2FA', dark: '#5A189A', accent: '#E0AAFF', text: '#230838' },
  coral: { main: '#FF6B6B', light: '#FFE0E0', dark: '#C92A2A', accent: '#FFA07A', text: '#3E1010' },
  navy: { main: '#3D5A80', light: '#D3E2F4', dark: '#1D2D44', accent: '#98C1D9', text: '#0B1522' },
};

export const defaultAvatarConfig: AvatarConfig = {
  character: 'astronaut',
  expression: 'happy',
  colorTheme: 'gold',
  accessory: 'helmet',
  aura: 'orbit',
};

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  config = defaultAvatarConfig,
  size = 64,
  className = '',
  animate = true,
}) => {
  const merged: AvatarConfig = { ...defaultAvatarConfig, ...config };
  const palette = colorPalettes[merged.colorTheme] || colorPalettes.gold;

  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Avatar ${merged.character}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <radialGradient id={`aura-${merged.colorTheme}`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor={palette.light} stopOpacity="0.8" />
            <stop offset="100%" stopColor={palette.main} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`grad-body-${merged.colorTheme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="60%" stopColor={palette.main} />
            <stop offset="100%" stopColor={palette.dark} />
          </linearGradient>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Aura Layer */}
        {merged.aura === 'orbit' && (
          <g opacity="0.75" className={animate ? 'animate-spin-slow origin-center' : ''}>
            <ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke={palette.main} strokeWidth="1.5" strokeDasharray="3 3" transform="rotate(-20 50 50)" />
            <circle cx="92" cy="36" r="3.5" fill={palette.accent} />
            <circle cx="8" cy="64" r="2.5" fill={palette.main} />
          </g>
        )}
        {merged.aura === 'flame' && (
          <g opacity="0.6">
            <path d="M50 4 C40 20 30 25 35 45 C25 40 22 55 28 65 C18 68 20 80 30 88 C40 98 60 98 70 88 C80 80 82 68 72 65 C78 55 75 40 65 45 C70 25 60 20 50 4 Z" fill={`url(#aura-${merged.colorTheme})`} />
          </g>
        )}
        {merged.aura === 'circuits' && (
          <g stroke={palette.dark} strokeWidth="1.2" opacity="0.4">
            <path d="M12 50 H24 L30 40" fill="none" />
            <circle cx="12" cy="50" r="2" fill={palette.accent} />
            <path d="M88 50 H76 L70 60" fill="none" />
            <circle cx="88" cy="50" r="2" fill={palette.accent} />
            <path d="M50 10 V22" fill="none" />
            <circle cx="50" cy="10" r="2" fill={palette.accent} />
          </g>
        )}
        {merged.aura === 'leaf' && (
          <g opacity="0.75">
            <path d="M82 25 C88 20 90 28 85 32 C80 30 78 26 82 25 Z" fill="#58A986" />
            <path d="M15 75 C10 70 8 78 13 82 C18 80 20 76 15 75 Z" fill="#58A986" />
          </g>
        )}
        {merged.aura === 'rainbow' && (
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#aura-coral)" strokeWidth="2.5" opacity="0.5" strokeDasharray="6 3" />
        )}

        {/* 2. Base Character Body */}
        {/* Background Avatar Disc */}
        <circle cx="50" cy="50" r="40" fill={`url(#grad-body-${merged.colorTheme})`} stroke={palette.dark} strokeWidth="2.5" />

        {/* Character specific features */}
        {merged.character === 'astronaut' && (
          <g>
            {/* Space collar */}
            <path d="M30 82 Q50 90 70 82 L75 92 Q50 100 25 92 Z" fill={palette.dark} />
            {/* Visor dome reflection */}
            <circle cx="50" cy="48" r="30" fill="#18233C" stroke={palette.dark} strokeWidth="2" />
            <ellipse cx="43" cy="38" rx="8" ry="4" fill="#FFFFFF" opacity="0.3" transform="rotate(-30 43 38)" />
          </g>
        )}

        {merged.character === 'robot' && (
          <g>
            {/* Robot ears / antenna bolts */}
            <rect x="12" y="42" width="6" height="14" rx="2" fill={palette.dark} />
            <rect x="82" y="42" width="6" height="14" rx="2" fill={palette.dark} />
            {/* Antenna top */}
            <line x1="50" y1="12" x2="50" y2="4" stroke={palette.dark} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="3" r="3" fill={palette.accent} />
            {/* Robot face screen */}
            <rect x="22" y="24" width="56" height="48" rx="14" fill="#1A2234" stroke={palette.dark} strokeWidth="2" />
            {/* Corner screen bolts */}
            <circle cx="26" cy="28" r="1.5" fill="#4B5875" />
            <circle cx="74" cy="28" r="1.5" fill="#4B5875" />
          </g>
        )}

        {merged.character === 'owl' && (
          <g>
            {/* Owl ear tufts */}
            <path d="M22 28 L32 10 L40 24 Z" fill={palette.dark} />
            <path d="M78 28 L68 10 L60 24 Z" fill={palette.dark} />
            {/* Eye mask feathers */}
            <circle cx="36" cy="46" r="16" fill="#FFFDF8" stroke={palette.dark} strokeWidth="1.5" />
            <circle cx="64" cy="46" r="16" fill="#FFFDF8" stroke={palette.dark} strokeWidth="1.5" />
            {/* Owl beak */}
            <polygon points="50,50 45,58 55,58" fill="#F4A261" stroke={palette.dark} strokeWidth="1" />
          </g>
        )}

        {merged.character === 'fox' && (
          <g>
            {/* Fox ears */}
            <path d="M18 36 L26 8 L42 22 Z" fill={palette.dark} />
            <path d="M22 32 L27 15 L37 23 Z" fill="#FFE3E3" />
            <path d="M82 36 L74 8 L58 22 Z" fill={palette.dark} />
            <path d="M78 32 L73 15 L63 23 Z" fill="#FFE3E3" />
            {/* Fox white cheeks */}
            <path d="M20 54 Q32 64 50 68 Q68 64 80 54 Q75 78 50 82 Q25 78 20 54 Z" fill="#FFFDF5" />
            {/* Fox button nose */}
            <circle cx="50" cy="62" r="3.5" fill="#1A1F2C" />
          </g>
        )}

        {merged.character === 'cat' && (
          <g>
            {/* Cat ears */}
            <polygon points="22,34 30,12 44,25" fill={palette.dark} />
            <polygon points="26,30 31,17 39,24" fill="#FFC6C6" />
            <polygon points="78,34 70,12 56,25" fill={palette.dark} />
            <polygon points="74,30 69,17 61,24" fill="#FFC6C6" />
            {/* Cat whiskers */}
            <line x1="20" y1="58" x2="33" y2="56" stroke={palette.dark} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="19" y1="63" x2="33" y2="62" stroke={palette.dark} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="80" y1="58" x2="67" y2="56" stroke={palette.dark} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="81" y1="63" x2="67" y2="62" stroke={palette.dark} strokeWidth="1.2" strokeLinecap="round" />
            {/* Cat nose */}
            <polygon points="50,56 47,53 53,53" fill="#E76F51" />
          </g>
        )}

        {merged.character === 'dino' && (
          <g>
            {/* Dino back spikes */}
            <polygon points="46,12 50,4 54,12" fill={palette.accent} stroke={palette.dark} strokeWidth="1" />
            <polygon points="62,15 68,8 72,17" fill={palette.accent} stroke={palette.dark} strokeWidth="1" />
            <polygon points="34,16 28,9 26,18" fill={palette.accent} stroke={palette.dark} strokeWidth="1" />
            {/* Cheerful snout */}
            <path d="M30 52 Q50 48 70 52 Q72 74 50 78 Q28 74 30 52 Z" fill="#FFFDF8" opacity="0.3" />
            {/* Dino nostrils */}
            <circle cx="45" cy="58" r="1.5" fill={palette.dark} />
            <circle cx="55" cy="58" r="1.5" fill={palette.dark} />
          </g>
        )}

        {merged.character === 'wizard' && (
          <g>
            {/* Wizard mystical rune aura */}
            <circle cx="50" cy="50" r="36" fill="none" stroke={palette.accent} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
            {/* Third eye star gem */}
            <polygon points="50,22 52,27 57,27 53,30 55,35 50,32 45,35 47,30 43,27 48,27" fill="#F4CF55" />
          </g>
        )}

        {merged.character === 'star' && (
          <g>
            {/* Star points poking out */}
            <polygon points="50,4 56,15 44,15" fill={palette.accent} />
            <polygon points="90,40 78,44 82,34" fill={palette.accent} />
            <polygon points="10,40 22,44 18,34" fill={palette.accent} />
            <polygon points="76,82 66,74 74,68" fill={palette.accent} />
            <polygon points="24,82 34,74 26,68" fill={palette.accent} />
          </g>
        )}

        {/* 3. Expressions (Eyes, Eyebrows, Mouth) */}
        {/* Expression layer */}
        {merged.expression === 'happy' && (
          <g>
            {/* Curved joyful eyes */}
            <path d="M34 46 Q40 40 46 46" fill="none" stroke={merged.character === 'robot' || merged.character === 'astronaut' ? palette.accent : palette.dark} strokeWidth="3" strokeLinecap="round" />
            <path d="M54 46 Q60 40 66 46" fill="none" stroke={merged.character === 'robot' || merged.character === 'astronaut' ? palette.accent : palette.dark} strokeWidth="3" strokeLinecap="round" />
            {/* Rosy cheeks */}
            <circle cx="28" cy="52" r="4" fill="#FF8FA3" opacity="0.5" />
            <circle cx="72" cy="52" r="4" fill="#FF8FA3" opacity="0.5" />
            {/* Open happy mouth */}
            <path d="M42 56 Q50 67 58 56 Z" fill={merged.character === 'robot' ? palette.accent : '#D90429'} stroke={palette.dark} strokeWidth="1.2" />
          </g>
        )}

        {merged.expression === 'focused' && (
          <g>
            {/* Determined brows */}
            <line x1="32" y1="39" x2="45" y2="43" stroke={palette.dark} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="68" y1="39" x2="55" y2="43" stroke={palette.dark} strokeWidth="2.5" strokeLinecap="round" />
            {/* Sharp pupils */}
            <circle cx="40" cy="48" r="3.5" fill={merged.character === 'robot' || merged.character === 'astronaut' ? palette.accent : palette.dark} />
            <circle cx="60" cy="48" r="3.5" fill={merged.character === 'robot' || merged.character === 'astronaut' ? palette.accent : palette.dark} />
            {/* Small gleam */}
            <circle cx="41.5" cy="46.5" r="1.2" fill="#FFFFFF" />
            <circle cx="61.5" cy="46.5" r="1.2" fill="#FFFFFF" />
            {/* Confident line smile */}
            <path d="M44 60 Q50 64 56 60" fill="none" stroke={palette.dark} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {merged.expression === 'curious' && (
          <g>
            {/* Inquisitive round glasses */}
            <circle cx="39" cy="46" r="9" fill="rgba(255,255,255,0.4)" stroke={palette.dark} strokeWidth="2" />
            <circle cx="61" cy="46" r="9" fill="rgba(255,255,255,0.4)" stroke={palette.dark} strokeWidth="2" />
            <line x1="48" y1="46" x2="52" y2="46" stroke={palette.dark} strokeWidth="2" />
            {/* Inquisitive pupils looking slightly up */}
            <circle cx="39" cy="44" r="3.5" fill={palette.dark} />
            <circle cx="61" cy="44" r="3.5" fill={palette.dark} />
            <circle cx="41" cy="42" r="1.2" fill="#FFF" />
            <circle cx="63" cy="42" r="1.2" fill="#FFF" />
            {/* Small curious 'o' mouth */}
            <circle cx="50" cy="62" r="3" fill="#D90429" stroke={palette.dark} strokeWidth="1" />
          </g>
        )}

        {merged.expression === 'cool' && (
          <g>
            {/* Dark cool sunglasses */}
            <path d="M28 42 L48 42 L45 52 L31 52 Z" fill="#111827" stroke={palette.dark} strokeWidth="1.5" />
            <path d="M52 42 L72 42 L69 52 L55 52 Z" fill="#111827" stroke={palette.dark} strokeWidth="1.5" />
            <line x1="48" y1="44" x2="52" y2="44" stroke="#111827" strokeWidth="2" />
            {/* Sunglasses lens reflection */}
            <line x1="32" y1="44" x2="42" y2="50" stroke="#FFF" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <line x1="56" y1="44" x2="66" y2="50" stroke="#FFF" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            {/* Asymmetrical smirk */}
            <path d="M44 61 Q52 62 58 57" fill="none" stroke={palette.dark} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {merged.expression === 'winking' && (
          <g>
            {/* Left winking eye */}
            <path d="M33 47 Q39 51 45 47" fill="none" stroke={merged.character === 'robot' || merged.character === 'astronaut' ? palette.accent : palette.dark} strokeWidth="3" strokeLinecap="round" />
            {/* Right wide open sparkling eye */}
            <circle cx="60" cy="46" r="5" fill={merged.character === 'robot' || merged.character === 'astronaut' ? palette.accent : palette.dark} />
            <polygon points="60,42 61.5,45 64,45 62,47 63,50 60,48 57,50 58,47 56,45 58.5,45" fill="#FFF" />
            {/* Cheerful grin */}
            <path d="M42 58 Q50 68 58 58 Z" fill="#D90429" stroke={palette.dark} strokeWidth="1.2" />
          </g>
        )}

        {merged.expression === 'excited' && (
          <g>
            {/* Star-burst big joyful eyes */}
            <circle cx="39" cy="46" r="6" fill="#1D2A44" />
            <polygon points="39,41 40.5,44 43.5,44 41,46 42,49 39,47 36,49 37,46 34.5,44 37.5,44" fill="#F4CF55" />
            <circle cx="61" cy="46" r="6" fill="#1D2A44" />
            <polygon points="61,41 62.5,44 65.5,44 63,46 64,49 61,47 58,49 59,46 56.5,44 59.5,44" fill="#F4CF55" />
            {/* Wide ecstatic smile */}
            <path d="M40 56 Q50 71 60 56 Z" fill="#D90429" stroke={palette.dark} strokeWidth="1.5" />
            <path d="M43 56 Q50 60 57 56" fill="#FFF" />
          </g>
        )}

        {/* 4. Accessories / Headgear */}
        {merged.accessory === 'helmet' && merged.character !== 'astronaut' && (
          <g>
            {/* Clear dome bubble over head */}
            <ellipse cx="50" cy="46" rx="38" ry="36" fill="none" stroke="#A8DADC" strokeWidth="2.5" opacity="0.8" />
            <path d="M26 30 Q38 18 56 16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        )}

        {merged.accessory === 'gradcap' && (
          <g>
            {/* Graduation mortarboard */}
            <polygon points="50,6 80,18 50,26 20,18" fill="#1A2035" stroke={palette.dark} strokeWidth="1.5" />
            {/* Under cap band */}
            <path d="M34 22 Q50 28 66 22 L64 26 Q50 32 36 26 Z" fill="#2E374D" />
            {/* Golden button and hanging tassel */}
            <circle cx="50" cy="16" r="2" fill="#F4CF55" />
            <path d="M50 16 Q65 20 68 32 L70 38" fill="none" stroke="#F4CF55" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="67" y="36" width="5" height="7" rx="1" fill="#E5B824" />
          </g>
        )}

        {merged.accessory === 'wizardhat' && (
          <g>
            {/* Cone hat */}
            <path d="M22 25 Q50 16 78 25 L60 2 Q50 -4 46 0 Z" fill="#3A0CA3" stroke={palette.dark} strokeWidth="1.5" />
            {/* Hat brim */}
            <ellipse cx="50" cy="24" rx="32" ry="7" fill="#4361EE" stroke={palette.dark} strokeWidth="1.5" />
            {/* Gold star on hat */}
            <polygon points="50,10 51.5,13.5 55,13.5 52,15.5 53,19 50,17 47,19 48,15.5 45,13.5 48.5,13.5" fill="#F4CF55" />
          </g>
        )}

        {merged.accessory === 'headphones' && (
          <g>
            {/* Headphone band arching over top */}
            <path d="M16 46 C16 18 84 18 84 46" fill="none" stroke="#1D2A44" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M16 46 C16 18 84 18 84 46" fill="none" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
            {/* Left Ear cup */}
            <rect x="10" y="38" width="10" height="20" rx="4" fill="#1D2A44" stroke={palette.accent} strokeWidth="1.5" />
            {/* Right Ear cup */}
            <rect x="80" y="38" width="10" height="20" rx="4" fill="#1D2A44" stroke={palette.accent} strokeWidth="1.5" />
          </g>
        )}

        {merged.accessory === 'crown' && (
          <g>
            {/* Regal golden crown */}
            <polygon points="26,24 28,10 38,18 50,7 62,18 72,10 74,24" fill="#F4CF55" stroke="#C49718" strokeWidth="1.5" />
            {/* Jewels on crown */}
            <circle cx="28" cy="11" r="2" fill="#E63946" />
            <circle cx="50" cy="8" r="2.5" fill="#457B9D" />
            <circle cx="72" cy="11" r="2" fill="#E63946" />
            {/* Crown base velvet cushion */}
            <path d="M26 23 Q50 27 74 23 L73 26 Q50 30 27 26 Z" fill="#C49718" />
          </g>
        )}

        {merged.accessory === 'goggles' && (
          <g>
            {/* Explorer goggles resting on forehead */}
            <rect x="25" y="24" width="22" height="15" rx="5" fill="#784F33" stroke="#2B1E16" strokeWidth="1.5" />
            <rect x="28" y="27" width="16" height="9" rx="3" fill="#A8DADC" opacity="0.8" />
            <rect x="53" y="24" width="22" height="15" rx="5" fill="#784F33" stroke="#2B1E16" strokeWidth="1.5" />
            <rect x="56" y="27" width="16" height="9" rx="3" fill="#A8DADC" opacity="0.8" />
            <line x1="47" y1="31" x2="53" y2="31" stroke="#2B1E16" strokeWidth="2.5" />
            <line x1="16" y1="31" x2="25" y2="31" stroke="#2B1E16" strokeWidth="2" />
            <line x1="75" y1="31" x2="84" y2="31" stroke="#2B1E16" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};

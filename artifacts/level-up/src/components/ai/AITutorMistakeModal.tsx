import React, { useState } from 'react';
import {
  Sparkles, X, MessageSquare, Lightbulb, Compass, ArrowRight,
  Bot, HelpCircle, Check, Send, BookOpen, HeartHandshake, Zap
} from 'lucide-react';
import type { QuestionMisconception, AvatarConfig } from '../../types';
import { AvatarRenderer } from '../avatar/AvatarRenderer';

interface AITutorMistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  misconception?: QuestionMisconception;
  realLifeExample?: {
    headline: string;
    scenario: string;
    takeaway: string;
  };
  userAvatar?: AvatarConfig;
  subject?: string;
  onRetry?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AITutorMistakeModal: React.FC<AITutorMistakeModalProps> = ({
  isOpen,
  onClose,
  questionText,
  studentAnswer,
  correctAnswer,
  explanation,
  misconception,
  realLifeExample,
  userAvatar,
  subject = 'Math',
  onRetry,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hey! Don't worry at all — every great scientist and mathematician learns by making mistakes! Let's figure out what tripped you up so you'll nail it next time.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'reallife' | 'chat'>('breakdown');

  if (!isOpen) return null;

  const handleSendPrompt = (userPromptText: string) => {
    if (!userPromptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userPromptText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI generating contextual response
    setTimeout(() => {
      let aiReply = '';
      const lower = userPromptText.toLowerCase();

      if (lower.includes('simple') || lower.includes('easy') || lower.includes('8') || lower.includes('kid')) {
        aiReply = `Think of it like this: If you cut a candy bar into parts, the bottom number is how many equal pieces exist in total. The top number is how many you actually get to eat. If you only look at the pieces eaten, you forget how big the whole bar was!`;
      } else if (lower.includes('real') || lower.includes('example') || lower.includes('life')) {
        aiReply = realLifeExample
          ? `Here's a great everyday picture: ${realLifeExample.scenario}`
          : `Imagine sharing 8 slices of pizza among 4 hungry friends. Everyone gets 2 slices, which is 2/8 (or 1/4) of the pizza! Real life is full of these patterns!`;
      } else if (lower.includes('why') || lower.includes('trap') || lower.includes('wrong')) {
        aiReply = misconception?.whyWrong
          ? `The trap here was: ${misconception.whyWrong} The golden rule to remember: ${misconception.keyRule || 'Check the total equal parts first!'}`
          : `When you chose "${studentAnswer}", your brain was looking at one part of the problem, but we also needed to consider the whole system. Take one breath and re-read the units!`;
      } else if (lower.includes('science') || lower.includes('matter') || lower.includes('force')) {
        aiReply = `In Science, always ask: "What is moving, heating up, or transforming?" When matter changes from ice to water, the molecules stay the same, they just move faster!`;
      } else {
        aiReply = `Great question! Here is the key secret: whenever you see "${questionText.slice(0, 45)}...", remember that "${correctAnswer}" is true because ${explanation}. You are super close to mastering this!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    'Explain simply like I’m 8',
    'Show me another real-life example',
    'Why is my answer a common trap?',
    'Give me a trick to remember this!',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FFFDF8] border border-[#E5E1D8] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with AI Tutor Nova */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E1CE] bg-gradient-to-r from-[#202842] via-[#2A3452] to-[#202842] text-[#F7F5EE]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#F4CF55] text-[#202842] flex items-center justify-center font-bold shadow-md">
                <Bot size={22} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#58B794] border-2 border-[#202842]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-['Space_Grotesk'] tracking-tight">Nova · AI Learning Guide</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-[#F4CF55] tracking-wide">
                  Mistake Explorer
                </span>
              </div>
              <p className="text-xs text-[#A8B0C1]">Let's turn this slip-up into a big breakthrough!</p>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E4DA] bg-white px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'breakdown'
                ? 'border-[#27314D] text-[#27314D]'
                : 'border-transparent text-[#7F8694] hover:text-[#27314D]'
            }`}
          >
            <Lightbulb size={14} /> The Thinking Ladder
          </button>
          <button
            onClick={() => setActiveTab('reallife')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'reallife'
                ? 'border-[#27314D] text-[#27314D]'
                : 'border-transparent text-[#7F8694] hover:text-[#27314D]'
            }`}
          >
            <Compass size={14} /> Real-Life Story
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-[#27314D] text-[#27314D]'
                : 'border-transparent text-[#7F8694] hover:text-[#27314D]'
            }`}
          >
            <MessageSquare size={14} /> Ask Nova AI
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Question Summary Bar */}
          <div className="p-3.5 rounded-xl bg-[#F8F6EF] border border-[#E8E3D5] text-xs space-y-2">
            <div className="flex items-center justify-between text-[#858A94] text-[10px] font-bold uppercase tracking-wider">
              <span>{subject} Challenge</span>
              <span className="text-[#A4673A]">Mistake Analysis</span>
            </div>
            <p className="font-semibold text-[#27314D]">{questionText}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-[#FFF2E8] border border-[#F4D2BC] text-[#93522E]">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#A2643D]">You Selected</span>
                <b className="text-xs">{studentAnswer || 'Skipped'}</b>
              </div>
              <div className="p-2 rounded-lg bg-[#EDF7EF] border border-[#C5E8CF] text-[#2A6E4B]">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#3D855E]">Correct Answer</span>
                <b className="text-xs">{correctAnswer}</b>
              </div>
            </div>
          </div>

          {/* TAB 1: Breakdown */}
          {activeTab === 'breakdown' && (
            <div className="space-y-4 animate-fade-in">
              {/* Misconception Alert */}
              <div className="p-4 rounded-xl bg-[#FFF9E8] border-l-4 border-[#F4CF55] border border-[#EFE5C6] space-y-1.5">
                <div className="flex items-center gap-2 text-[#9A7A1E] text-xs font-bold">
                  <HeartHandshake size={15} />
                  <span>The Sneaky Trap Nova Spotted</span>
                </div>
                <p className="text-xs text-[#5D553C] leading-relaxed">
                  {misconception?.misconception ||
                    `It's so easy to pick "${studentAnswer}" when looking at the numbers quickly! But let's see why this rule works differently.`}
                </p>
                {misconception?.whyWrong && (
                  <div className="pt-1 text-[11px] text-[#786D49] italic">
                    💡 <b>Why it happens:</b> {misconception.whyWrong}
                  </div>
                )}
              </div>

              {/* 3-Step Thinking Ladder */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#798190]">
                  Nova's 3-Step Thinking Ladder
                </span>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E7E3D8]">
                    <span className="w-5 h-5 rounded-full bg-[#EBF3EB] text-[#4E8F6C] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="text-xs">
                      <b className="text-[#2B3448]">Spot the Core Clue</b>
                      <p className="text-[#727987] mt-0.5">
                        Notice the question is asking for parts of the whole, not just what was taken away.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E7E3D8]">
                    <span className="w-5 h-5 rounded-full bg-[#FFF6D9] text-[#9E8224] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="text-xs">
                      <b className="text-[#2B3448]">Apply the Concept</b>
                      <p className="text-[#727987] mt-0.5">{explanation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E7E3D8]">
                    <span className="w-5 h-5 rounded-full bg-[#EDF7EF] text-[#2F855A] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="text-xs">
                      <b className="text-[#2B3448]">Lock In the Golden Rule</b>
                      <p className="text-[#727987] mt-0.5">
                        {misconception?.keyRule ||
                          `Double check the remaining parts before confirming! That's how champions solve it.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Real-Life Story */}
          {activeTab === 'reallife' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#F0F7F4] border border-[#CFE7DC] space-y-2">
                <div className="flex items-center gap-2 text-[#3D785F] text-xs font-bold">
                  <Compass size={16} />
                  <span>{realLifeExample?.headline || 'How This Lives in the Real World'}</span>
                </div>
                <p className="text-xs text-[#486356] leading-relaxed">
                  {realLifeExample?.scenario ||
                    'Think about cutting a birthday pizza into 8 slices. If your family eats 3 slices, the 5 leftover slices are 5/8 of the pizza. Numbers are just recipes for real things!'}
                </p>
                <div className="pt-2 border-t border-[#D6EBE1] flex items-center gap-2 text-[11px] text-[#2C624B] font-semibold">
                  <Zap size={13} className="text-[#E7A934]" />
                  <span>Takeaway: {realLifeExample?.takeaway || 'Always identify the total number of parts first!'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Chat with Nova */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[280px] bg-white border border-[#E7E3D8] rounded-xl overflow-hidden animate-fade-in">
              {/* Chat history */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#FAF9F5]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {m.sender === 'ai' ? (
                      <div className="w-6 h-6 rounded-lg bg-[#27314D] text-[#F4CF55] flex items-center justify-center flex-shrink-0 text-xs">
                        <Bot size={14} />
                      </div>
                    ) : (
                      <div className="flex-shrink-0">
                        <AvatarRenderer config={userAvatar} size={24} animate={false} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-2.5 rounded-xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#27314D] text-white rounded-br-xs'
                          : 'bg-white border border-[#E7E3D8] text-[#2E3649] rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-[#828896] italic pl-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#828896] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#828896] animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#828896] animate-bounce delay-200" />
                    <span>Nova is thinking...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="p-2 bg-white border-t border-[#EFECE5] flex gap-1.5 overflow-x-auto">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendPrompt(q)}
                    className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full border border-[#DCD6C9] bg-[#F7F5EE] text-[#505A6E] hover:border-[#27314D] hover:text-[#27314D] transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt(input);
                }}
                className="flex items-center gap-2 p-2 bg-white border-t border-[#EFECE5]"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nova why or for another hint..."
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F7F5EE] border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#27314D]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-1.5 rounded-lg bg-[#27314D] text-white disabled:opacity-40 hover:bg-[#3A476C] transition"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8E4DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#7A8291]">
            <Sparkles size={14} className="text-[#D3A924]" />
            <span>Reviewing mistakes awards <b>+10 Brain XP</b></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#666E7C] hover:text-[#27314D] transition"
            >
              Close
            </button>
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  onRetry();
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition shadow-md active:scale-95"
              >
                <span>Try Again</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

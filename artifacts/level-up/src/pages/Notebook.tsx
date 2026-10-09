import { useState } from 'react';
import { NotebookPen, Pencil, Trash2 } from 'lucide-react';
import type { Note } from '../types';
import { topicById, topicsFor } from '../data/topics';
import { useProfile } from '../store/progress';
import { friendlyDate } from '../lib/date';
import { PageTitle } from '../layout/AppShell';

const prompts = ['Today I learned...', 'I was surprised that...', 'I can see this at home when...', 'A question I still have is...'];

export function Notebook() {
  const { profile, saveNote, deleteNote } = useProfile();
  const [editing, setEditing] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [topicId, setTopicId] = useState('');
  const gradeTopics = topicsFor(profile.grade);
  const valid = title.trim().length > 0 && text.trim().length >= 10;

  const reset = () => { setEditing(null); setTitle(''); setText(''); setTopicId(''); };
  const startEdit = (n: Note) => { setEditing(n); setTitle(n.title); setText(n.text); setTopicId(n.topicId ?? ''); };

  return (
    <div className="page-enter">
      <PageTitle eyebrow="MY NOTEBOOK" title="Write what you discovered" description="Writing about an idea helps you remember it. Your notes stay on this device." />
      <div className="create-layout">
        <form className="create-form-card" onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          saveNote({ id: editing?.id, title: title.trim(), text: text.trim(), topicId: topicId || undefined });
          reset();
        }}>
          <div className="create-card-top">
            <span className="create-mark"><NotebookPen size={18} /></span>
            <div><b>{editing ? 'Edit note' : 'New note'}</b><small>Pick a starter or write your own</small></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button key={p} type="button" className="rounded-full border border-[#E0DBCF] bg-white px-3 py-1.5 text-xs font-bold text-[#3E475A] hover:border-[#27314D]"
                onClick={() => setText(text ? `${text}\n${p} ` : `${p} `)}>{p}</button>
            ))}
          </div>
          <label className="field-label" htmlFor="note-title">Title</label>
          <input id="note-title" className="form-input" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Why the Moon shines" />
          <label className="field-label" htmlFor="note-topic">Topic (optional)</label>
          <select id="note-topic" className="form-input" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            <option value="">No topic</option>
            {gradeTopics.map((t) => <option key={t.id} value={t.id}>{t.emoji} {t.title}</option>)}
          </select>
          <label className="field-label" htmlFor="note-text">My note</label>
          <textarea id="note-text" className="form-input create-textarea" maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write at least a sentence..." />
          <div className="create-submit-row">
            <span>{text.trim().length < 10 ? 'Write at least 10 letters' : 'Looks great!'}</span>
            <div className="flex gap-2">
              {editing && <button type="button" className="button button-dark" onClick={reset}>Cancel</button>}
              <button type="submit" className="button button-yellow" disabled={!valid}>{editing ? 'Update note' : 'Save note'}</button>
            </div>
          </div>
        </form>

        <div className="saved-ideas">
          <div className="saved-head"><div><div className="eyebrow">SAVED</div><h2>My notes</h2></div><span>{profile.notes.length}</span></div>
          {profile.notes.length === 0 && <div className="empty-shelf"><b>No notes yet</b><p>Your first note earns XP!</p></div>}
          {profile.notes.map((n) => {
            const t = topicById(n.topicId);
            return (
              <div key={n.id} className="saved-idea">
                <div className="flex items-center justify-between">
                  <span className="saved-type">{t ? `${t.emoji} ${t.title}` : 'Note'}</span>
                  <span className="flex gap-1">
                    <button type="button" aria-label="Edit note" className="rounded-lg p-1.5 text-[#6B7385] hover:bg-[#F3F0E8]" onClick={() => startEdit(n)}><Pencil size={13} /></button>
                    <button type="button" aria-label="Delete note" className="rounded-lg p-1.5 text-[#B42318] hover:bg-[#FDECEC]"
                      onClick={() => { if (window.confirm(`Delete "${n.title}"?`)) { deleteNote(n.id); if (editing?.id === n.id) reset(); } }}><Trash2 size={13} /></button>
                  </span>
                </div>
                <h3>{n.title}</h3>
                <p className="whitespace-pre-line">{n.text}</p>
                <small>{friendlyDate(n.createdAt)}{n.updatedAt !== n.createdAt ? ` · edited ${friendlyDate(n.updatedAt)}` : ''}</small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

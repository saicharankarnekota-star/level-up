import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Grade, Subject, Topic } from '../types';
import { topics } from '../data/topics';
import { useProfile } from '../store/progress';
import { PageTitle } from '../layout/AppShell';
import { TopicCard } from '../components/TopicCard';
import { Chip } from '../components/visualizers/common';

export const nextTopic = (list: Topic[], progress: Record<string, { stars: number } | undefined>) =>
  list.find((t) => (progress[t.id]?.stars ?? 0) === 0);

export function Learn() {
  const { profile } = useProfile();
  const [grade, setGrade] = useState<Grade>(profile.grade);
  const [subject, setSubject] = useState<Subject | 'All'>('All');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => topics.filter((t) =>
    (q ? `${t.title} ${t.blurb} ${t.subject}`.toLowerCase().includes(q) : t.grade === grade) && (subject === 'All' || t.subject === subject)),
  [q, grade, subject]);

  const groups: Subject[] = subject === 'All' ? ['Math', 'Science'] : [subject];
  const upNext = nextTopic(topics.filter((t) => t.grade === profile.grade), profile.topics);
  const starred = topics.filter((t) => t.grade === grade && (profile.topics[t.id]?.stars ?? 0) > 0).length;
  const gradeTotal = topics.filter((t) => t.grade === grade).length;

  return (
    <div className="page-enter">
      <PageTitle eyebrow="LEARN" title="Pick a topic" description="Every topic has 3 steps: See it with a model, Learn the big idea, then Practice to earn stars."
        action={(
          <label className="relative block w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A92A2]" />
            <input className="form-input h-11 pl-9 text-sm" placeholder="Search topics (e.g. clock, plants)" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        )} />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {!q && ([1, 2] as Grade[]).map((g) => <Chip key={g} active={grade === g} onClick={() => setGrade(g)}>Grade {g}</Chip>)}
        <span className="mx-1 h-5 w-px bg-[#E0DBCF]" />
        {(['All', 'Math', 'Science'] as const).map((s) => <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>{s === 'Math' ? '🔢 ' : s === 'Science' ? '🔬 ' : ''}{s}</Chip>)}
        {!q && <span className="ml-auto text-xs font-bold text-[#6B7385]">{starred}/{gradeTotal} topics starred in Grade {grade}</span>}
      </div>

      {visible.length === 0 && (
        <div className="empty-shelf">
          <b>No topics match “{query}”</b>
          <p>Try another word, or clear the search.</p>
          <button type="button" className="button button-dark mt-3" onClick={() => { setQuery(''); setSubject('All'); }}>Show all topics</button>
        </div>
      )}

      {groups.map((s) => {
        const list = visible.filter((t) => t.subject === s);
        if (!list.length) return null;
        return (
          <section key={s} className="mb-8">
            <h2 className="mb-3 font-['Space_Grotesk'] text-xl font-semibold text-[#232B40]">{s === 'Math' ? '🔢 Math' : '🔬 Science'}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => <TopicCard key={t.id} topic={t} progress={profile.topics[t.id]} highlight={t.id === upNext?.id} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

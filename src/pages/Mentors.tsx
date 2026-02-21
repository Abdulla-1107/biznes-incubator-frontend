import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/Section';
import { Search, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getLocalizedField } from '@/lib/api';
import { CardSkeleton, ErrorState, EmptyState } from '@/components/ApiStates';

export default function MentorsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'uz' | 'en' | 'ru';
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['mentors', { isActive: true }],
    queryFn: () => api.get('/mentors', { params: { isActive: true } }).then(r => r.data),
  });

  const allMentors = Array.isArray(data) ? data : data?.data || [];

  const filtered = allMentors.filter((m: any) =>
    (m.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader title={t('sections.mentors')} description={t('sections.mentors_desc')} />
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {isLoading ? <CardSkeleton count={6} /> :
         error ? <ErrorState onRetry={() => refetch()} /> :
         filtered.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((mentor: any, i: number) => (
              <motion.div
                key={mentor.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 text-center card-hover group"
              >
                <div className="relative w-24 h-24 rounded-full mx-auto mb-4 p-1 bg-gradient-brand">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl font-bold text-foreground overflow-hidden">
                    {mentor.photoUrl ? <img src={mentor.photoUrl} alt="" className="w-full h-full object-cover" /> : (mentor.fullName || '?').charAt(0)}
                  </div>
                  {mentor.linkedinUrl && (
                    <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 rounded-full bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Linkedin className="w-6 h-6 text-primary-foreground" />
                    </a>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{mentor.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {getLocalizedField(mentor, 'position', lang)}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {getLocalizedField(mentor, 'bio', lang)}
                </p>
                {mentor.specialization && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(Array.isArray(mentor.specialization) ? mentor.specialization : [mentor.specialization]).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

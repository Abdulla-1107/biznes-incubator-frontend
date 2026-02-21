import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Section, SectionHeader } from '@/components/Section';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, getLocalizedField } from '@/lib/api';
import { CardSkeleton, ErrorState, EmptyState } from '@/components/ApiStates';

const stageColors: Record<string, string> = {
  IDEA: 'bg-accent/20 text-accent',
  MVP: 'bg-primary/20 text-primary',
  EARLY: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  GROWTH: 'bg-green-500/20 text-green-600 dark:text-green-400',
  SCALE: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  SCALING: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
};

export default function StartupsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'uz' | 'en' | 'ru';
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['startups'],
    queryFn: () => api.get('/startups').then(r => r.data),
  });

  const allStartups = Array.isArray(data) ? data : data?.data || [];

  const filtered = allStartups.filter((s: any) => {
    const name = getLocalizedField(s, 'name', lang).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || (s.industry || '').toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || s.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader title={t('sections.startups')} description={t('sections.startups_desc')} />

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'IDEA', 'MVP', 'EARLY', 'GROWTH', 'SCALE'].map(stage => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  stageFilter === stage ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {stage === 'ALL' ? t('common.all') : t(`stages.${stage}`, stage)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? <CardSkeleton count={6} /> :
         error ? <ErrorState onRetry={() => refetch()} /> :
         filtered.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((startup: any, i: number) => (
              <motion.div
                key={startup.id || i}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-lg mb-4 overflow-hidden">
                  {startup.logoUrl ? <img src={startup.logoUrl} alt="" className="w-full h-full object-cover" /> : getLocalizedField(startup, 'name', lang).charAt(0)}
                </div>
                <h3 className="font-heading font-semibold text-foreground text-lg mb-2">{getLocalizedField(startup, 'name', lang)}</h3>
                <div className="flex gap-2 mb-3">
                  {startup.industry && <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">{startup.industry}</span>}
                  {startup.stage && (
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${stageColors[startup.stage] || 'bg-muted text-muted-foreground'}`}>
                      {String(t(`stages.${startup.stage}`, startup.stage))}
                    </span>
                  )}
                </div>
                {startup.teamSize && <p className="text-xs text-muted-foreground">👥 {startup.teamSize} members</p>}
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

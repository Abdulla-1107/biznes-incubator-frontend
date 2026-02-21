import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Section, SectionHeader } from '@/components/Section';
import { Calendar, MapPin, Globe, Users, DollarSign } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api, getLocalizedField } from '@/lib/api';
import { CardSkeleton, ErrorState, EmptyState } from '@/components/ApiStates';
import { toast } from 'sonner';

const eventTypes = ['ALL', 'TRAINING', 'MASTERCLASS', 'WEBINAR', 'PITCH_DAY', 'WORKSHOP'] as const;

const typeBadgeColors: Record<string, string> = {
  TRAINING: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  MASTERCLASS: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  WEBINAR: 'bg-green-500/20 text-green-600 dark:text-green-400',
  PITCH_DAY: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  WORKSHOP: 'bg-pink-500/20 text-pink-600 dark:text-pink-400',
};

export default function EventsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'uz' | 'en' | 'ru';
  const [activeType, setActiveType] = useState('ALL');
  const [regModal, setRegModal] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ fullName: '', email: '', phone: '' });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', { isActive: true }],
    queryFn: () => api.get('/events', { params: { isActive: true } }).then(r => r.data),
  });

  const registerMutation = useMutation({
    mutationFn: (eventId: string) =>
      api.post(`/events/${eventId}/register`, regForm),
    onSuccess: () => {
      toast.success(t('common.register') + ' ✅');
      setRegModal(null);
      setRegForm({ fullName: '', email: '', phone: '' });
    },
    onError: () => toast.error(t('common.error')),
  });

  const allEvents = Array.isArray(data) ? data : data?.data || [];
  const filtered = activeType === 'ALL' ? allEvents : allEvents.filter((e: any) => e.category === activeType || e.type === activeType);

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader title={t('nav.events')} />

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {type === 'ALL' ? t('common.all') : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {isLoading ? <CardSkeleton count={4} className="!grid-cols-1 !md:grid-cols-2" /> :
         error ? <ErrorState onRetry={() => refetch()} /> :
         filtered.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((event: any, i: number) => {
              const spotsLeft = (event.maxParticipants || 0) - (event.registeredCount || 0);
              return (
                <motion.div
                  key={event.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden card-hover"
                >
                  <div className="h-32 bg-gradient-brand opacity-80 relative overflow-hidden">
                    {event.coverUrl && <img src={event.coverUrl} alt="" className="w-full h-full object-cover" />}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold ${typeBadgeColors[event.category || event.type] || 'bg-muted text-muted-foreground'}`}>
                      {(event.category || event.type || '').replace('_', ' ')}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-foreground text-lg mb-3">
                      {getLocalizedField(event, 'title', lang)}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      {event.startDate && (
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.startDate).toLocaleDateString(lang)}</span>
                      )}
                      <span className="flex items-center gap-1">
                        {event.format === 'ONLINE' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        {event.format === 'ONLINE' ? t('common.online') : getLocalizedField(event, 'location', lang) || event.format}
                      </span>
                      <span className="flex items-center gap-1">
                        {event.isFree || event.price === 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-semibold">{t('common.free')}</span>
                        ) : (
                          <><DollarSign className="w-4 h-4" /> {(event.price || 0).toLocaleString()} UZS</>
                        )}
                      </span>
                      {event.maxParticipants > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {spotsLeft > 0 ? `${spotsLeft} ${t('common.spots_left')}` : t('common.full')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setRegModal(event.id)}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      {t('common.register')}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Registration Modal */}
      {regModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setRegModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-2xl border border-border p-6 w-full max-w-md space-y-4"
          >
            <h3 className="font-heading font-semibold text-foreground text-lg">{t('common.register')}</h3>
            <input
              value={regForm.fullName}
              onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder={t('apply.fullName')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="email"
              value={regForm.email}
              onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
              placeholder={t('apply.email')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="tel"
              value={regForm.phone}
              onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))}
              placeholder={t('apply.phone')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={() => regModal && registerMutation.mutate(regModal)}
              disabled={registerMutation.isPending}
              className="w-full py-3 rounded-xl bg-gradient-brand text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {registerMutation.isPending ? t('common.loading') : t('common.register')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

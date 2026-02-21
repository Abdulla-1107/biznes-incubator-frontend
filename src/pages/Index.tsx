import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Star } from 'lucide-react';
import { Section, SectionHeader } from '@/components/Section';
import { useCountUp } from '@/hooks/useCountUp';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getLocalizedField } from '@/lib/api';
import { CardSkeleton, ErrorState, EmptyState } from '@/components/ApiStates';

function TypewriterWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % words.length), 3000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-gradient inline-block"
    >
      {words[index]}
    </motion.span>
  );
}

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { count, ref } = useCountUp(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl p-6 text-center card-hover"
    >
      <div className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
    </motion.div>
  );
}

const stageColors: Record<string, string> = {
  IDEA: 'bg-accent/20 text-accent',
  MVP: 'bg-primary/20 text-primary',
  EARLY: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  GROWTH: 'bg-green-500/20 text-green-600 dark:text-green-400',
  SCALE: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  SCALING: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
};

const catEmoji: Record<string, string> = {
  BUSINESS_MODEL: '📊', LAUNCH: '🚀', TECHNICAL: '💻',
  MARKETING_SALES: '📣', EDUCATION: '🎓', INVESTMENT: '💰',
};

export default function Index() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'uz' | 'en' | 'ru';
  const words = t('hero.words', { returnObjects: true }) as string[];

  // const statsQuery = useQuery({
  //   queryKey: ['statistics'],
  //   queryFn: () => api.get('/statistics').then(r => r.data),
  // });

  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data),
  });

  const startupsQuery = useQuery({
    queryKey: ['startups', { limit: 6, status: 'ACTIVE' }],
    queryFn: () => api.get('/startups', { params: { limit: 6, status: 'ACTIVE' } }).then(r => r.data),
  });

  const mentorsQuery = useQuery({
    queryKey: ['mentors', { isActive: true, limit: 6 }],
    queryFn: () => api.get('/mentors', { params: { isActive: true, limit: 6 } }).then(r => r.data),
  });

  const partnersQuery = useQuery({
    queryKey: ['partners', { isActive: true }],
    queryFn: () => api.get('/partners', { params: { isActive: true } }).then(r => r.data),
  });

  // const testimonialsQuery = useQuery({
  //   queryKey: ['testimonials', { isActive: true }],
  //   queryFn: () => api.get('/testimonials', { params: { isActive: true } }).then(r => r.data),
  // });

  const blogQuery = useQuery({
    queryKey: ['event', { isPublished: true, limit: 3 }],
    queryFn: () => api.get('/events', { params: { isPublished: true, limit: 3 } }).then(r => r.data),
  });

  // const stats = statsQuery.data;
  const services = servicesQuery.data;
  const startups = Array.isArray(startupsQuery.data) ? startupsQuery.data : startupsQuery.data?.data || [];
  const mentors = Array.isArray(mentorsQuery.data) ? mentorsQuery.data : mentorsQuery.data?.data || [];
  const partners = Array.isArray(partnersQuery.data) ? partnersQuery.data : partnersQuery.data?.data || [];
  // const testimonials = Array.isArray(testimonialsQuery.data) ? testimonialsQuery.data : testimonialsQuery.data?.data || [];
  const blogPosts = Array.isArray(blogQuery.data) ? blogQuery.data : blogQuery.data?.data || [];

  // Flatten grouped services for display
  const flatServices = services
    ? Object.entries(services).flatMap(([category, items]: [string, any]) =>
        (Array.isArray(items) ? items : []).map((s: any) => ({ ...s, category }))
      ).slice(0, 6)
    : [];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand animate-gradient opacity-10" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-float-delayed" />

        <div className="container mx-auto px-4 relative z-10 text-center pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-tight mb-6">
              <TypewriterWord words={words} />
              <br />
              <span className="text-foreground">{t('hero.title_suffix')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply" className="px-8 py-4 rounded-xl bg-gradient-brand text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                {t('hero.cta_primary')}
              </Link>
              <Link to="/services" className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-muted transition-colors">
                {t('hero.cta_secondary')}
              </Link>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-20">
            <ChevronDown className="w-6 h-6 text-muted-foreground mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {/* <Section>
        {statsQuery.isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4].map(i => <div key={i} className="glass rounded-2xl p-6 text-center animate-pulse"><div className="h-12 bg-muted rounded mb-2" /><div className="h-4 bg-muted rounded w-2/3 mx-auto" /></div>)}
          </div>
        ) : statsQuery.error ? (
          <ErrorState onRetry={() => statsQuery.refetch()} />
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard value={stats.startups || 0} suffix="+" label={t('stats.startups')} delay={0} />
            <StatCard value={stats.mentors || 0} suffix="+" label={t('stats.mentors')} delay={0.1} />
            <StatCard value={stats.successRate || 0} suffix="%" label={t('stats.success_rate')} delay={0.2} />
            <StatCard value={stats.partners || 0} suffix="+" label={t('stats.partners')} delay={0.3} />
          </div>
        ) : null}
      </Section> */}

      {/* Services */}
      {/* <Section className="bg-muted/30">
        <SectionHeader title={t('sections.services')} description={t('sections.services_desc')} />
        {servicesQuery.isLoading ? <CardSkeleton count={6} /> :
         servicesQuery.error ? <ErrorState onRetry={() => servicesQuery.refetch()} /> :
         flatServices.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flatServices.map((svc: any, i: number) => (
              <motion.div
                key={svc.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.15)' }}
                className="bg-card rounded-2xl border border-border p-6 cursor-pointer transition-colors"
              >
                <div className="text-4xl mb-4">{svc.icon || catEmoji[svc.category] || '📋'}</div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    {getLocalizedField(svc, 'title', lang)}
                  </h3>
                  {svc.isPremium && (
                    <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold shrink-0 ml-2">Premium</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getLocalizedField(svc, 'description', lang)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Section> */}

      {/* Startups Showcase */}
      <Section>
        <SectionHeader title={t('sections.startups')} description={t('sections.startups_desc')} />
        {startupsQuery.isLoading ? <CardSkeleton count={6} /> :
         startupsQuery.error ? <ErrorState onRetry={() => startupsQuery.refetch()} /> :
         startups.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup: any, i: number) => (
              <motion.div
                key={startup.id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
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
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/startups" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            {t('sections.view_all')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* Mentors */}
      <Section className="bg-muted/30">
        <SectionHeader title={t('sections.mentors')} description={t('sections.mentors_desc')} />
        {mentorsQuery.isLoading ? <CardSkeleton count={6} /> :
         mentorsQuery.error ? <ErrorState onRetry={() => mentorsQuery.refetch()} /> :
         mentors.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor: any, i: number) => (
              <motion.div
                key={mentor.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 text-center card-hover"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-brand mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-2xl overflow-hidden">
                  {mentor.photoUrl ? <img src={mentor.photoUrl} alt="" className="w-full h-full object-cover" /> : (mentor.fullName || '?').charAt(0)}
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{mentor.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {getLocalizedField(mentor, 'position', lang)}
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

      {/* Partners */}
      {partners.length > 0 && (
        <Section>
          <SectionHeader title={t('sections.partners')} description={t('sections.partners_desc')} />
          <div className="flex flex-wrap gap-6 justify-center">
            {partners.map((partner: any, i: number) => (
              <motion.a
                key={partner.id || i}
                href={partner.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="w-32 h-20 rounded-xl border border-border bg-card flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all card-hover"
              >
                {partner.logoUrl ? (
                  <img src={partner.logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">{partner.name}</span>
                )}
              </motion.a>
            ))}
          </div>
        </Section>
      )}

      {/* Testimonials */}
      {/* <Section className={partners.length > 0 ? 'bg-muted/30' : ''}>
        <SectionHeader title={t('sections.testimonials')} description={t('sections.testimonials_desc')} />
        {testimonialsQuery.isLoading ? <CardSkeleton count={3} /> :
         testimonialsQuery.error ? <ErrorState onRetry={() => testimonialsQuery.refetch()} /> :
         testimonials.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item: any, i: number) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 card-hover"
              >
                {item.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  "{getLocalizedField(item, 'content', lang) || getLocalizedField(item, 'quote', lang) || item.content || ''}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground font-semibold text-sm overflow-hidden">
                    {item.avatarUrl ? <img src={item.avatarUrl} alt="" className="w-full h-full object-cover" /> : (item.fullName || item.name || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.fullName || item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.company || item.position || ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section> */}

      {/* Blog Preview */}
      {/* <Section className="bg-muted/30">
        <SectionHeader title={t('sections.blog')} description={t('sections.blog_desc')} />
        {blogQuery.isLoading ? <CardSkeleton count={3} /> :
         blogQuery.error ? <ErrorState onRetry={() => blogQuery.refetch()} /> :
         blogPosts.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post: any, i: number) => (
              <motion.div
                key={post.id || post.slug || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden card-hover group"
              >
                <div className="h-48 bg-gradient-brand opacity-80 group-hover:opacity-100 transition-opacity overflow-hidden">
                  {post.coverUrl && <img src={post.coverUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    {post.tag && <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{post.tag}</span>}
                    {post.createdAt && <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString(lang)}</span>}
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-3 line-clamp-2">
                    {getLocalizedField(post, 'title', lang)}
                  </h3>
                  <Link to={`/blog/${post.slug || post.id}`} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:underline">
                    {t('common.read_more')} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section> */}

      {/* CTA */}
      <Section>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-brand p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-brand animate-gradient opacity-90" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-4">
              {t('sections.cta_title')}
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              {t('sections.cta_desc')}
            </p>
            <Link to="/apply" className="inline-flex px-8 py-4 rounded-xl bg-background text-foreground font-semibold text-lg hover:bg-background/90 transition-colors">
              {t('hero.cta_primary')} <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

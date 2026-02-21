import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Section } from '@/components/Section';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(9).max(20),
  subject: z.string().trim().min(2).max(200).optional(),
  message: z.string().trim().min(10).max(1000),
});

type ContactForm = z.infer<typeof schema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: ContactForm) => api.post('/contact', data),
    onSuccess: () => {
      toast.success(t('contact.success'));
      reset();
    },
    onError: () => toast.error(t('common.error')),
  });

  const onSubmit = (data: ContactForm) => mutation.mutate(data);

  return (
    <div className="pt-20">
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">{t('contact.title')}</h1>
            <p className="text-muted-foreground">{t('contact.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              {[
                { icon: MapPin, text: t('contact.address') },
                { icon: Mail, text: 'info@incubator.uz' },
                { icon: Phone, text: '+998 71 123 45 67' },
                { icon: Send, text: '@incubator_uz (Telegram)' },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground">{text}</p>
                </motion.div>
              ))}
              <p className="text-sm text-muted-foreground italic">{t('contact.response_note')}</p>
            </div>

            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input {...register('fullName')} placeholder={t('apply.fullName')} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <input type="email" {...register('email')} placeholder={t('apply.email')} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <input type="tel" {...register('phone')} placeholder={t('apply.phone')} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <textarea {...register('message')} rows={5} placeholder={t('contact.message')} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={mutation.isPending} className="w-full py-3 rounded-xl bg-gradient-brand text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                {mutation.isPending ? t('common.loading') : t('contact.send')}
              </button>
            </motion.form>
          </div>
        </div>
      </Section>
    </div>
  );
}

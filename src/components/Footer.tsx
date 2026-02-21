import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rocket, Send, Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const pageLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/startups', label: t('nav.startups') },
    { to: '/services', label: t('nav.services') },
    { to: '/mentors', label: t('nav.mentors') },
    { to: '/events', label: t('nav.events') },
    { to: '/blog', label: t('nav.blog') },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="h-1 bg-gradient-brand" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">Incubator</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t('footer.pages')}</h4>
            <div className="flex flex-col gap-2">
              {pageLinks.map(link => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t('footer.social')}</h4>
            <div className="flex gap-3">
              {[
                { icon: Send, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t('footer.contact_info')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>{t('contact.address')}</p>
              <p>info@incubator.uz</p>
              <p>+998 71 123 45 67</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {year} Incubator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

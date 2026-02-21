import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Section, SectionHeader } from "@/components/Section";
import { useQuery } from "@tanstack/react-query";
import { api, getLocalizedField } from "@/lib/api";
import { CardSkeleton, ErrorState, EmptyState } from "@/components/ApiStates";

const catEmoji: Record<string, string> = {
  BUSINESS_MODEL: "📊",
  LAUNCH: "🚀",
  TECHNICAL: "💻",
  MARKETING_SALES: "📣",
  EDUCATION: "🎓",
  INVESTMENT: "💰",
};

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "uz" | "en" | "ru";
  const [active, setActive] = useState<string>("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/services").then((r) => r.data),
  });

  // 🔥 SERVICESNI CATEGORY BO'YICHA GROUP QILAMIZ
  const groupedData = useMemo(() => {
    if (!data) return {};

    return data.reduce((acc: any, svc: any) => {
      if (!svc.isActive) return acc; // inactive larni chiqarmaymiz

      if (!acc[svc.category]) {
        acc[svc.category] = [];
      }

      acc[svc.category].push(svc);
      return acc;
    }, {});
  }, [data]);

  const categories = Object.keys(groupedData);
  const activeCategory = active || categories[0] || "";
  const services = groupedData[activeCategory] || [];

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          title={t("sections.services")}
          description={t("sections.services_desc")}
        />

        {isLoading ? (
          <CardSkeleton count={4} />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : categories.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* CATEGORY TABS */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {catEmoji[cat] || "📋"} {cat.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* SERVICES GRID */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {services.length === 0 ? (
                <EmptyState />
              ) : (
                services.map((svc: any, i: number) => (
                  <motion.div
                    key={svc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-2xl border border-border p-6 card-hover"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading font-semibold text-foreground text-lg">
                        {getLocalizedField(svc, "title", lang)}
                      </h3>

                      {svc.isPremium ? (
                        <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                          {t("common.premium")}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold">
                          {t("common.free")}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {getLocalizedField(svc, "description", lang)}
                    </p>

                    {svc.price > 0 && (
                      <p className="text-sm font-semibold text-foreground mt-3">
                        {svc.price.toLocaleString()} UZS
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          </>
        )}
      </Section>
    </div>
  );
}

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Section } from "@/components/Section";
import { Check, Lightbulb, Rocket, TrendingUp, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(9).max(20),
  ideaDescription: z.string().trim().min(10).max(3000),
  industry: z.string().min(1),
  stage: z.string().min(1),
  teamSize: z.coerce.number().min(1).max(100),
  investmentNeeded: z.coerce.number().optional(),
  fileUrl: z.string().url().optional().or(z.literal("")),
  terms: z.literal(true, { errorMap: () => ({ message: "Required" }) }),
});

type FormData = z.infer<typeof schema>;

const stageOptions = [
  { value: "IDEA", icon: Lightbulb },
  { value: "MVP", icon: Rocket },
  { value: "GROWTH", icon: TrendingUp },
  { value: "SCALING", icon: Zap },
];

const industries = [
  "FinTech",
  "EdTech",
  "HealthTech",
  "AgriTech",
  "E-commerce",
  "Logistics",
  "AI_ML",
  "IoT",
  "CleanTech",
  "FoodTech",
];

export default function ApplyPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false as any },
  });

  const selectedStage = watch("stage");
  const ideaLength = (watch("ideaDescription") || "").length;

  const submitMutation = useMutation({
    mutationFn: (data: FormData) => {
      console.log(data);
      const { terms, stage, ...body } = data;

      return api.post("/applications", body);
    },
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error(t("common.error")),
  });

  const onSubmit = (data: FormData) => submitMutation.mutate(data);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <div className="pt-20">
        <Section>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              {t("apply.success")}
            </h2>
            <p className="text-muted-foreground">{t("apply.success_desc")}</p>
          </motion.div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              {t("apply.title")}
            </h1>
            <p className="text-muted-foreground">{t("apply.subtitle")}</p>
          </div>

          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-colors ${s <= step ? "bg-gradient-brand" : "bg-muted"}`}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t(`apply.step${s}`)}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.fullName")}
                    </label>
                    <input
                      {...register("fullName")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.fullName && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.email")}
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.phone")}
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("apply.next")}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.ideaDescription")}
                    </label>
                    <textarea
                      {...register("ideaDescription")}
                      rows={5}
                      maxLength={3000}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {ideaLength}/3000
                    </p>
                    {errors.ideaDescription && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.ideaDescription.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.industry")}
                    </label>
                    <select
                      {...register("industry")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">---</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind.replace("_", "/")}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.industry.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("apply.stage")}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {stageOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setValue("stage", opt.value)}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedStage === opt.value ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/50"}`}
                          >
                            <Icon className="w-5 h-5 text-primary mb-2" />
                            <p className="font-semibold text-foreground text-sm">
                              {t(`stages.${opt.value}`)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    {errors.stage && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.stage.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.teamSize")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register("teamSize")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.teamSize && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.teamSize.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                    >
                      {t("apply.prev")}
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t("apply.next")}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.investmentNeeded")}
                    </label>
                    <input
                      type="number"
                      {...register("investmentNeeded")}
                      placeholder="50000"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("apply.fileUrl")}
                    </label>
                    <input
                      {...register("fileUrl")}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.fileUrl && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.fileUrl.message}
                      </p>
                    )}
                  </div>
                  <label className="flex items-center gap-3 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("terms")}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-foreground">
                      {t("apply.terms")}
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-destructive text-xs">
                      {errors.terms.message}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                    >
                      {t("apply.prev")}
                    </button>
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="flex-1 py-3 rounded-xl bg-gradient-brand text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitMutation.isPending
                        ? t("common.loading")
                        : t("apply.submit")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </Section>
    </div>
  );
}

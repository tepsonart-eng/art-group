"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Calendar } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { getYoutubeId } from "@/lib/youtube";

export type ProjectEntry = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  category: string;
  colorFrom: string;
  colorTo: string;
  youtubeUrl: string | null;
  contextFr: string;
  contextEn: string;
  objectivesFr: string;
  objectivesEn: string;
  location: string;
  projectDate: string;
};

export type PortfolioTabEntry = {
  id: string;
  slug: string;
  labelFr: string;
  labelEn: string;
};

export function PortfolioSection({
  projects,
  tabs,
}: {
  projects: ProjectEntry[];
  tabs: PortfolioTabEntry[];
}) {
  const { dict, locale } = useDictionary();
  const [activeTab, setActiveTab] = useState("all");
  const [videoProject, setVideoProject] = useState<ProjectEntry | null>(null);
  const [detailProject, setDetailProject] = useState<ProjectEntry | null>(null);

  const filtered = useMemo(
    () => (activeTab === "all" ? projects : projects.filter((p) => p.category === activeTab)),
    [projects, activeTab]
  );

  return (
    <section id="realisations" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="title-composite text-center">
        <h2 className="text-3xl sm:text-4xl">
          <span className="accent-serif">{dict.portfolio.titleAccent}</span>{" "}
          <span className="accent-bold">{dict.portfolio.titleBold}</span>
        </h2>
        <div className="divider-dots" />
        <p className="mx-auto mt-2 max-w-xl text-text-muted">{dict.portfolio.subtitle}</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors ${
            activeTab === "all" ? "bg-accent text-white" : "bg-surface-alt text-text-muted hover:text-accent"
          }`}
        >
          {dict.portfolio.allTab}
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.slug)}
            className={`rounded-full px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.slug ? "bg-accent text-white" : "bg-surface-alt text-text-muted hover:text-accent"
            }`}
          >
            {locale === "fr" ? tab.labelFr : tab.labelEn}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-text-muted">{dict.portfolio.empty}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const title = locale === "fr" ? project.titleFr : project.titleEn;
            const tabLabel =
              tabs.find((t) => t.slug === project.category) &&
              (locale === "fr"
                ? tabs.find((t) => t.slug === project.category)!.labelFr
                : tabs.find((t) => t.slug === project.category)!.labelEn);

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})`,
                }}
              >
                {tabLabel && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-ink">
                    {tabLabel}
                  </span>
                )}
                <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                  <h3 className="font-display text-lg font-bold text-white">{title}</h3>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {project.youtubeUrl && (
                    <button onClick={() => setVideoProject(project)} className="btn-pill-solid">
                      {dict.portfolio.watchVideo}
                    </button>
                  )}
                  <button onClick={() => setDetailProject(project)} className="btn-pill-outline !border-white !text-white hover:!bg-white hover:!text-ink">
                    {dict.portfolio.viewProject}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {videoProject?.youtubeUrl && (
          <ModalShell onClose={() => setVideoProject(null)}>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(videoProject.youtubeUrl)}`}
                title={locale === "fr" ? videoProject.titleFr : videoProject.titleEn}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </ModalShell>
        )}
        {detailProject && (
          <ModalShell onClose={() => setDetailProject(null)}>
            <div
              className="aspect-video w-full rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${detailProject.colorFrom}, ${detailProject.colorTo})`,
              }}
            />
            <h3 className="mt-6 font-display text-2xl font-extrabold">
              {locale === "fr" ? detailProject.titleFr : detailProject.titleEn}
            </h3>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
              {detailProject.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {detailProject.location}
                </span>
              )}
              {detailProject.projectDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {detailProject.projectDate}
                </span>
              )}
            </div>
            {(locale === "fr" ? detailProject.contextFr : detailProject.contextEn) && (
              <div className="mt-5">
                <h4 className="font-display text-sm font-bold uppercase tracking-wide text-accent">
                  {dict.portfolio.context}
                </h4>
                <p className="mt-1 text-sm text-text-muted">
                  {locale === "fr" ? detailProject.contextFr : detailProject.contextEn}
                </p>
              </div>
            )}
            {(locale === "fr" ? detailProject.objectivesFr : detailProject.objectivesEn) && (
              <div className="mt-4">
                <h4 className="font-display text-sm font-bold uppercase tracking-wide text-accent">
                  {dict.portfolio.objectives}
                </h4>
                <p className="mt-1 text-sm text-text-muted">
                  {locale === "fr" ? detailProject.objectivesFr : detailProject.objectivesEn}
                </p>
              </div>
            )}
          </ModalShell>
        )}
      </AnimatePresence>
    </section>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const { dict } = useDictionary();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-ink/80 px-4 py-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label={dict.portfolio.close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt hover:text-accent"
        >
          <X size={16} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidLocale, getDictionary, type Locale } from "@/lib/i18n";

type SearchRow = { label: string; href: string; groupKey: string; rank: number };

function buildTsQuery(raw: string): string | null {
  const tokens = raw
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `${t}:*`).join(" & ");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const rawLocale = searchParams.get("locale") ?? "fr";
    const locale = (isValidLocale(rawLocale) ? rawLocale : "fr") as Locale;
    const config = locale === "fr" ? "french" : "english";

    const tsquery = buildTsQuery(q);
    if (!tsquery) return NextResponse.json({ results: [] });

    const [dict, trainings, resources, projects, faqs] = await Promise.all([
      getDictionary(locale),
      prisma.$queryRaw<SearchRow[]>`
        SELECT
          CASE WHEN ${locale} = 'fr' THEN "titleFr" ELSE "titleEn" END AS label,
          ('/' || ${locale} || '/formations/' || slug) AS href,
          'trainings' AS "groupKey",
          ts_rank(
            to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "titleFr" || ' ' || "shortDescFr" ELSE "titleEn" || ' ' || "shortDescEn" END),
            to_tsquery(${config}::regconfig, ${tsquery})
          ) AS rank
        FROM "Training"
        WHERE published = true
          AND to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "titleFr" || ' ' || "shortDescFr" ELSE "titleEn" || ' ' || "shortDescEn" END)
              @@ to_tsquery(${config}::regconfig, ${tsquery})
        ORDER BY rank DESC
        LIMIT 6
      `,
      prisma.$queryRaw<SearchRow[]>`
        SELECT
          CASE WHEN ${locale} = 'fr' THEN "titleFr" ELSE "titleEn" END AS label,
          ('/' || ${locale} || '/ressources') AS href,
          'resources' AS "groupKey",
          ts_rank(
            to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "titleFr" || ' ' || "descriptionFr" ELSE "titleEn" || ' ' || "descriptionEn" END),
            to_tsquery(${config}::regconfig, ${tsquery})
          ) AS rank
        FROM "Resource"
        WHERE published = true
          AND to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "titleFr" || ' ' || "descriptionFr" ELSE "titleEn" || ' ' || "descriptionEn" END)
              @@ to_tsquery(${config}::regconfig, ${tsquery})
        ORDER BY rank DESC
        LIMIT 6
      `,
      prisma.$queryRaw<SearchRow[]>`
        SELECT
          CASE WHEN ${locale} = 'fr' THEN "titleFr" ELSE "titleEn" END AS label,
          ('/' || ${locale} || '#realisations') AS href,
          'projects' AS "groupKey",
          ts_rank(
            to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "titleFr" || ' ' || "contextFr" ELSE "titleEn" || ' ' || "contextEn" END),
            to_tsquery(${config}::regconfig, ${tsquery})
          ) AS rank
        FROM "Project"
        WHERE published = true
          AND to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "titleFr" || ' ' || "contextFr" ELSE "titleEn" || ' ' || "contextEn" END)
              @@ to_tsquery(${config}::regconfig, ${tsquery})
        ORDER BY rank DESC
        LIMIT 6
      `,
      prisma.$queryRaw<SearchRow[]>`
        SELECT
          CASE WHEN ${locale} = 'fr' THEN "questionFr" ELSE "questionEn" END AS label,
          ('/' || ${locale} || '#agence') AS href,
          'faq' AS "groupKey",
          ts_rank(
            to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "questionFr" || ' ' || "answerFr" ELSE "questionEn" || ' ' || "answerEn" END),
            to_tsquery(${config}::regconfig, ${tsquery})
          ) AS rank
        FROM "FaqItem"
        WHERE to_tsvector(${config}::regconfig, CASE WHEN ${locale} = 'fr' THEN "questionFr" || ' ' || "answerFr" ELSE "questionEn" || ' ' || "answerEn" END)
              @@ to_tsquery(${config}::regconfig, ${tsquery})
        ORDER BY rank DESC
        LIMIT 6
      `,
    ]);

    const groupLabels: Record<string, string> = {
      trainings: dict.trainings.titleBold,
      resources: dict.resources.titleBold,
      projects: dict.portfolio.titleBold,
      faq: dict.about.faqTitle,
    };

    const results = [...trainings, ...resources, ...projects, ...faqs]
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 8)
      .map((r) => ({ label: r.label, href: r.href, group: groupLabels[r.groupKey] ?? r.groupKey }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[search]", err);
    return NextResponse.json({ results: [] });
  }
}

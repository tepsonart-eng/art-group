import { prisma } from "@/lib/prisma";

export const defaultSiteSettings = {
  id: "singleton",
  palette: "RED_BLACK" as "RED_BLACK" | "COBALT_GOLD",
  reviewModeration: true,
  heroTaglinesFr: "Vous imaginez, nous réalisons.\nVotre histoire, notre caméra.\nL'audiovisuel au service de votre image.",
  heroTaglinesEn: "You imagine it, we make it.\nYour story, our camera.\nAudiovisual production serving your image.",
  agencyIntroFr:
    "Depuis 2017, TEPSON ART GROUP accompagne marques, institutions et artistes dans la réalisation de contenus audiovisuels d'exception : clips musicaux, films corporate, motion design, publicités, documentaires, captation live et contenus digitaux. Basée à Yaoundé, l'agence collabore avec des créateurs et des marques à travers le Cameroun et l'Afrique.",
  agencyIntroEn:
    "Since 2017, TEPSON ART GROUP has supported brands, institutions and artists in producing exceptional audiovisual content: music videos, corporate films, motion design, advertising, documentaries, live coverage and digital content. Based in Yaoundé, the agency collaborates with creators and brands across Cameroon and Africa.",
  aboutTextFr:
    "TEPSON ART GROUP est une agence de production audiovisuelle basée à Yaoundé, au Cameroun. Nous concevons des films et contenus qui racontent votre histoire avec exigence et créativité, du concept à la diffusion.",
  aboutTextEn:
    "TEPSON ART GROUP is an audiovisual production agency based in Yaoundé, Cameroon. We craft films and content that tell your story with rigor and creativity, from concept to broadcast.",
  teamTextFr:
    "Réalisateurs, chefs opérateurs, monteurs, motion designers et producteurs : notre équipe créative réunit les compétences nécessaires pour donner vie à chaque projet, quelle que soit son ampleur.",
  teamTextEn:
    "Directors, cinematographers, editors, motion designers and producers: our creative team brings together the skills needed to bring every project to life, whatever its scale.",
  planetTextFr:
    "Nous réduisons l'impact environnemental de nos tournages : sélection de prestataires locaux, optimisation des déplacements et gestion responsable du matériel.",
  planetTextEn:
    "We reduce the environmental impact of our shoots by selecting local partners, optimizing travel and managing equipment responsibly.",
  adSpaceTitleFr: "Un espace pour vos partenaires",
  adSpaceTitleEn: "A space for your partners",
  adSpaceTextFr: "Cet emplacement met en avant un partenaire, une offre spéciale ou un événement à venir.",
  adSpaceTextEn: "This space highlights a partner, a special offer or an upcoming event.",
  ctaTitleFr: "",
  ctaTitleEn: "",
  contactQuoteFr: "Nous restons à votre écoute.",
  contactQuoteEn: "We remain at your service.",
  trustTitleFr: "",
  trustTitleEn: "",
  phone1: "+237 694 08 75 99",
  phone2: "",
  contactEmail: "tepsonart@gmail.com",
  addressFr: "Yaoundé, Cameroun",
  addressEn: "Yaoundé, Cameroon",
  whatsappNumber: "237694087599",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127482.5!2d11.5021!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sYaound%C3%A9!5e0!3m2!1sfr!2scm",
  rccm: "",
  legalAddress: "",
  brochurePdfPath: null as string | null,
  logoLightPath: null as string | null,
  logoDarkPath: null as string | null,
  heroVideoPath: null as string | null,
  updatedAt: new Date(),
};

export type SiteSettings = typeof defaultSiteSettings;

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) return defaultSiteSettings;
  return settings;
}

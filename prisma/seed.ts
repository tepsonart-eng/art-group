import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL n'est pas défini. Voir le README pour la configuration.");
}
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "tepsonart@gmail.com";
const ADMIN_PASSWORD = "TepsonArt2026!";

async function main() {
  console.log("Seeding database...");

  // --- Admin super user ---
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "TEPSON ART GROUP",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // --- Site settings ---
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      palette: "RED_BLACK",
      reviewModeration: true,
      heroTaglinesFr:
        "Vous imaginez, nous réalisons.\nVotre histoire, notre caméra.\nL'audiovisuel au service de votre image.",
      heroTaglinesEn:
        "You imagine it, we make it.\nYour story, our camera.\nAudiovisual production serving your image.",
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
      contactQuoteFr: "Nous restons à votre écoute.",
      contactQuoteEn: "We remain at your service.",
      phone1: "+237 694 08 75 99",
      contactEmail: "tepsonart@gmail.com",
      addressFr: "Yaoundé, Cameroun",
      addressEn: "Yaoundé, Cameroon",
      whatsappNumber: "237694087599",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127482.5!2d11.5021!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sYaound%C3%A9!5e0!3m2!1sfr!2scm",
    },
  });

  // --- Categories (compétences) ---
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: [
      {
        slug: "musique-art",
        order: 0,
        visualOnly: true,
        titleFr: "Vidéos musicales & d'art",
        titleEn: "Music & art videos",
        itemsFr: "",
        itemsEn: "",
        colorFrom: "#e11d2e",
        colorTo: "#1a0505",
      },
      {
        slug: "entreprise",
        order: 1,
        titleFr: "Vidéo d'entreprise",
        titleEn: "Corporate video",
        itemsFr:
          "Films d'entreprise\nDrone\nInterview\nReportage\nProduction vidéo\nVidéo promotionnelle\nE-learning\nTutoriels",
        itemsEn:
          "Corporate films\nDrone\nInterview\nReport\nVideo production\nPromotional video\nE-learning\nTutorials",
        colorFrom: "#e11d2e",
        colorTo: "#111111",
      },
      {
        slug: "graphisme",
        order: 2,
        titleFr: "Conception graphique et animée",
        titleEn: "Graphic & motion design",
        itemsFr:
          "Habillage graphique\nContenu créatif\nAnimation 2D/3D\nAnimation de logo\nAnimation de personnages\nImage par image",
        itemsEn:
          "Graphic packaging\nCreative content\n2D/3D animation\nLogo animation\nCharacter animation\nStop motion",
        colorFrom: "#a1131f",
        colorTo: "#111111",
      },
      {
        slug: "captation-live",
        order: 3,
        titleFr: "Captation et diffusion en direct",
        titleEn: "Live coverage & broadcast",
        itemsFr:
          "Captation événementielle\nTournage multicaméra\nBest of\nAfter movie\nStudio TV\nDiffusion live\nHabillage émission",
        itemsEn:
          "Event coverage\nMulti-camera shoot\nBest of\nAfter movie\nTV studio\nLive broadcast\nShow packaging",
        colorFrom: "#e11d2e",
        colorTo: "#1a0505",
      },
      {
        slug: "studio-tournage",
        order: 4,
        titleFr: "Studio de tournage",
        titleEn: "Shooting studio",
        itemsFr: "Tournage vidéo\nShooting photo\nInterviews\nFond vert / chroma key\nPodcast\nPackshot",
        itemsEn: "Video shoot\nPhoto shoot\nInterviews\nGreen screen / chroma key\nPodcast\nPackshot",
        colorFrom: "#a1131f",
        colorTo: "#111111",
      },
    ],
  });

  // --- Portfolio filter tabs ---
  await prisma.portfolioTab.deleteMany();
  await prisma.portfolioTab.createMany({
    data: [
      { slug: "corporate", labelFr: "Corporate", labelEn: "Corporate", order: 0 },
      { slug: "evenementiel", labelFr: "Événementiel", labelEn: "Events", order: 1 },
      { slug: "motion-design", labelFr: "Motion Design", labelEn: "Motion Design", order: 2 },
      { slug: "portrait-interview", labelFr: "Portrait & Interview", labelEn: "Portrait & Interview", order: 3 },
      { slug: "publicite", labelFr: "Publicité", labelEn: "Advertising", order: 4 },
    ],
  });

  // --- Demo projects ---
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        slug: "campagne-institutionnelle",
        titleFr: "Campagne institutionnelle",
        titleEn: "Institutional campaign",
        category: "corporate",
        colorFrom: "#e11d2e",
        colorTo: "#111111",
        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        contextFr: "Réalisation d'un film institutionnel pour présenter les valeurs et les équipes d'une entreprise.",
        contextEn: "Production of an institutional film to present a company's values and teams.",
        objectivesFr: "Renforcer l'image de marque et fédérer les collaborateurs autour d'un récit commun.",
        objectivesEn: "Strengthen brand image and unite employees around a shared narrative.",
        location: "Yaoundé",
        projectDate: "2025",
        order: 0,
      },
      {
        slug: "conference-annuelle",
        titleFr: "Conférence annuelle",
        titleEn: "Annual conference",
        category: "evenementiel",
        colorFrom: "#a1131f",
        colorTo: "#1a0505",
        youtubeUrl: null,
        contextFr: "Captation multicaméra d'une conférence rassemblant plus de 500 participants.",
        contextEn: "Multi-camera coverage of a conference gathering more than 500 attendees.",
        objectivesFr: "Produire un after movie et des extraits diffusables sur les réseaux sociaux.",
        objectivesEn: "Deliver an after movie and highlight clips for social media.",
        location: "Douala",
        projectDate: "2025",
        order: 1,
      },
      {
        slug: "habillage-emission-tv",
        titleFr: "Habillage d'émission TV",
        titleEn: "TV show packaging",
        category: "motion-design",
        colorFrom: "#e11d2e",
        colorTo: "#111111",
        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        contextFr: "Création d'un habillage graphique animé pour une émission télévisée hebdomadaire.",
        contextEn: "Creation of animated graphic packaging for a weekly TV show.",
        objectivesFr: "Moderniser l'identité visuelle de l'émission et renforcer sa reconnaissance.",
        objectivesEn: "Modernize the show's visual identity and strengthen brand recognition.",
        location: "Yaoundé",
        projectDate: "2024",
        order: 2,
      },
      {
        slug: "portrait-entrepreneur",
        titleFr: "Portrait d'entrepreneur",
        titleEn: "Entrepreneur portrait",
        category: "portrait-interview",
        colorFrom: "#a1131f",
        colorTo: "#111111",
        youtubeUrl: null,
        contextFr: "Série de portraits filmés mettant en avant des entrepreneurs camerounais.",
        contextEn: "Series of filmed portraits highlighting Cameroonian entrepreneurs.",
        objectivesFr: "Valoriser des parcours inspirants et créer du contenu éditorial pour le web.",
        objectivesEn: "Showcase inspiring journeys and create editorial content for the web.",
        location: "Yaoundé",
        projectDate: "2024",
        order: 3,
      },
      {
        slug: "spot-publicitaire-produit",
        titleFr: "Spot publicitaire produit",
        titleEn: "Product advertising spot",
        category: "publicite",
        colorFrom: "#e11d2e",
        colorTo: "#1a0505",
        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        contextFr: "Conception et tournage d'un spot publicitaire de 30 secondes pour le lancement d'un produit.",
        contextEn: "Design and shoot of a 30-second advertising spot for a product launch.",
        objectivesFr: "Générer de la notoriété et accompagner la stratégie de lancement.",
        objectivesEn: "Generate awareness and support the launch strategy.",
        location: "Douala",
        projectDate: "2025",
        order: 4,
      },
    ],
  });

  // --- Testimonials ---
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Aïcha Mballa",
        clientRole: "Directrice marketing",
        companyName: "Groupe Nova",
        colorHex: "#e11d2e",
        quoteFr:
          "TEPSON ART GROUP a su traduire notre vision en images avec une exigence remarquable, du brief jusqu'à la diffusion.",
        quoteEn:
          "TEPSON ART GROUP translated our vision into images with remarkable rigor, from the brief to broadcast.",
        rating: 5,
        verified: true,
        order: 0,
      },
      {
        clientName: "Serge Fotso",
        clientRole: "Fondateur",
        companyName: "Fotso Studio",
        colorHex: "#a1131f",
        quoteFr: "Une équipe réactive, créative et professionnelle. Le rendu final a dépassé nos attentes.",
        quoteEn: "A responsive, creative and professional team. The final result exceeded our expectations.",
        rating: 5,
        verified: true,
        order: 1,
      },
      {
        clientName: "Elise Njoya",
        clientRole: "Chargée de communication",
        companyName: "Institution publique",
        colorHex: "#e11d2e",
        quoteFr: "Un accompagnement de bout en bout, avec un vrai sens du récit et une grande rigueur technique.",
        quoteEn: "End-to-end support, with a real sense of storytelling and strong technical rigor.",
        rating: 5,
        verified: true,
        order: 2,
      },
    ],
  });

  // --- Reviews (demo) ---
  await prisma.review.deleteMany();
  await prisma.review.createMany({
    data: [
      {
        authorName: "Junior K.",
        authorEmail: "junior.k@example.com",
        rating: 5,
        comment: "Super prestation pour notre clip, équipe très professionnelle !",
        status: "APPROVED",
        ipAddress: "127.0.0.1",
      },
      {
        authorName: "Carine T.",
        authorEmail: "carine.t@example.com",
        rating: 4,
        comment: "Bon accompagnement, quelques délais serrés mais un résultat de qualité.",
        status: "PENDING",
        ipAddress: "127.0.0.1",
      },
    ],
  });

  // --- FAQ ---
  await prisma.faqItem.deleteMany();
  await prisma.faqItem.createMany({
    data: [
      {
        questionFr: "Pourquoi choisir TEPSON ART GROUP ?",
        questionEn: "Why choose TEPSON ART GROUP?",
        answerFr:
          "Parce que nous combinons créativité, rigueur technique et connaissance du marché camerounais et africain pour livrer des contenus audiovisuels à la hauteur des standards internationaux.",
        answerEn:
          "Because we combine creativity, technical rigor and knowledge of the Cameroonian and African market to deliver audiovisual content that meets international standards.",
        order: 0,
      },
      {
        questionFr: "Comment démarre un projet ?",
        questionEn: "How does a project start?",
        answerFr:
          "Tout commence par un brief détaillé de vos besoins via notre formulaire de contact ou par téléphone. Nous revenons ensuite vers vous avec une proposition adaptée à votre budget et à vos délais.",
        answerEn:
          "Everything starts with a detailed brief of your needs via our contact form or by phone. We then get back to you with a proposal tailored to your budget and timeline.",
        order: 1,
      },
      {
        questionFr: "Comment se déroule l'accompagnement ?",
        questionEn: "How does the support process work?",
        answerFr:
          "De la préproduction à la diffusion, notre équipe vous accompagne à chaque étape. Découvrez le détail de notre savoir-faire dans la section Compétences de la page d'accueil.",
        answerEn:
          "From pre-production to broadcast, our team supports you at every step. Discover our full expertise in the Skills section of the homepage.",
        order: 2,
      },
    ],
  });

  // --- Partner logos / artists (bandeau défilant) ---
  await prisma.partnerLogo.deleteMany();
  await prisma.partnerLogo.createMany({
    data: [
      { name: "Groupe Nova", type: "PARTNER", colorHex: "#e11d2e", order: 0 },
      { name: "Fotso Studio", type: "PARTNER", colorHex: "#a1131f", order: 1 },
      { name: "Wizdom", type: "ARTIST", colorHex: "#111111", order: 2 },
      { name: "ZASTA", type: "ARTIST", colorHex: "#e11d2e", order: 3 },
      { name: "Cameroon Digital", type: "PARTNER", colorHex: "#a1131f", order: 4 },
    ],
  });

  // --- Why choose us ---
  await prisma.whyChooseUsItem.deleteMany();
  await prisma.whyChooseUsItem.createMany({
    data: [
      {
        iconKey: "sparkles",
        titleFr: "Accompagnement global",
        titleEn: "End-to-end support",
        textFr: "De la préproduction à la diffusion, une équipe dédiée pilote votre projet à chaque étape.",
        textEn: "From pre-production to broadcast, a dedicated team steers your project every step of the way.",
        order: 0,
      },
      {
        iconKey: "shield",
        titleFr: "Qualité professionnelle",
        titleEn: "Professional quality",
        textFr: "Un matériel et des équipes à la hauteur des standards internationaux de production.",
        textEn: "Equipment and teams that meet international production standards.",
        order: 1,
      },
      {
        iconKey: "gauge",
        titleFr: "Budget et délais maîtrisés",
        titleEn: "Controlled budget and timeline",
        textFr: "Une gestion de projet rigoureuse pour respecter vos contraintes de temps et de coût.",
        textEn: "Rigorous project management to meet your time and cost constraints.",
        order: 2,
      },
    ],
  });

  // --- Commitments (Nos engagements clients) ---
  await prisma.commitmentItem.deleteMany();
  await prisma.commitmentItem.createMany({
    data: [
      {
        iconKey: "sparkles",
        titleFr: "Agilité",
        titleEn: "Agility",
        textFr: "Nous nous adaptons à vos contraintes et à l'évolution de vos besoins tout au long du projet.",
        textEn: "We adapt to your constraints and evolving needs throughout the project.",
        order: 0,
      },
      {
        iconKey: "shield",
        titleFr: "Exigence",
        titleEn: "Rigor",
        textFr: "Chaque livrable est soumis à un contrôle qualité strict avant diffusion.",
        textEn: "Every deliverable goes through strict quality control before release.",
        order: 1,
      },
      {
        iconKey: "gauge",
        titleFr: "Flexibilité",
        titleEn: "Flexibility",
        textFr: "Des formules adaptées à tous les budgets, du petit format digital à la grande production.",
        textEn: "Solutions adapted to every budget, from small digital formats to major productions.",
        order: 2,
      },
    ],
  });

  // --- Social links ---
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      {
        platform: "FACEBOOK",
        url: "https://www.facebook.com/share/1GFdafTeb4/?mibextid=wwXIfr",
        visible: true,
      },
      { platform: "INSTAGRAM", url: "https://www.instagram.com/tepsonart", visible: true },
      {
        platform: "TIKTOK",
        url: "https://www.tiktok.com/@tepsonart?_r=1&_t=ZS-97kSBKZWtS1",
        visible: true,
      },
      { platform: "YOUTUBE", url: "https://www.youtube.com/@Artgroup237", visible: true },
      { platform: "LINKEDIN", url: "", visible: false },
      { platform: "WHATSAPP", url: "https://wa.me/237694087599", visible: true },
    ],
  });

  console.log("Seed terminé.");
  console.log(`Compte admin : ${ADMIN_EMAIL} / mot de passe : ${ADMIN_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

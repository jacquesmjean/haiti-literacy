/**
 * Single source of truth for organization facts.
 * A backend manager can change any value here without touching a component.
 */

export const site = {
  name: "Partners in Literacy Haiti",
  shortName: "PILH",
  ein: "87-0904773",
  taxStatus: "501(c)(3)",
  founded: 2011,
  incorporated: 2021,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.haiti-literacy.org",

  email: "administrator@haiti-literacy.org",
  strategyEmail: "leedashton@gmail.com",

  addresses: {
    office: {
      line1: "202 Hope Street",
      city: "Greenville",
      region: "SC",
      postal: "29601",
      country: "USA",
    },
    mail: {
      line1: "P.O. Box 90057",
      city: "Indianapolis",
      region: "IN",
      postal: "46290-0057",
      country: "USA",
    },
  },

  social: {
    facebook: "https://www.facebook.com/haitiliteracy",
    instagram: "https://www.instagram.com/haitiliteracy/",
    youtube: "https://www.youtube.com/@PartnersInLiteracyHaiti",
    linkedin:
      "https://www.linkedin.com/company/partners-in-literacy-haitihttps-haiti-literacy-org",
    x: "https://twitter.com/haiti_literacy",
  },

  candid:
    "https://app.candid.org/profile/9982325/partners-in-literacy-haiti-87-0904773",

  /**
   * Giving rails.
   * Zeffy passes one hundred percent of every gift to PILH, so it is the
   * default checkout. Givebutter stays available for campaigns and for donors
   * who prefer it.
   */
  giving: {
    zeffyForm:
      "https://www.zeffy.com/en-US/donation-form/d4139250-67f3-4545-86ad-85f830b28d93",
    zeffyEmbed:
      "https://www.zeffy.com/embed/donation-form/d4139250-67f3-4545-86ad-85f830b28d93",
    givebutter: "https://givebutter.com/WSWj3X",
  },
} as const;

/** Headline numbers. Update these once and the whole site follows. */
export const impact = [
  { value: 3000, suffix: "+", key: "books" },
  { value: 5, suffix: "", key: "libraries" },
  { value: 98, suffix: "", key: "schools" },
  { value: 3800, suffix: "+", key: "students" },
] as const;

/** Giving tiers. Amounts in whole US dollars. */
export const tiers = [
  { id: "books", amount: 15, recurring: true, image: "/img/books-double.webp" },
  { id: "circle", amount: 50, recurring: true, image: "/img/young-readers.webp" },
  { id: "training", amount: 100, recurring: false, image: "/img/teacher-training.webp" },
  { id: "librarian", amount: 250, recurring: true, image: "/img/beverly-stephen.webp" },
] as const;

/** Libraries PILH has mentored. AS is all services, PS is partial services. */
export const libraries = [
  {
    id: "duplan",
    name: "Duplan Methodist Community Library",
    department: "Ouest",
    service: "AS",
    year: 2022,
    image: "/img/duplan-1.webp",
  },
  {
    id: "cange",
    name: "Cange Community Library",
    department: "Centre",
    service: "AS",
    year: 2011,
    image: "/img/cange-library.webp",
  },
  {
    id: "lachapelle",
    name: "La Chapelle Community Library",
    department: "Artibonite",
    service: "PS",
    year: 2016,
    image: "/img/lachapelle-library.webp",
  },
  {
    id: "ravine",
    name: "Ravine Sèche Library Center",
    department: "Artibonite",
    service: "PS",
    year: 2020,
    image: "/img/ravine-seche.webp",
  },
  {
    id: "summits",
    name: "Summits Education Library System",
    department: "Centre",
    service: "PS",
    year: 2018,
    image: "/img/cange-plateau.webp",
  },
] as const;

/** Board and leadership. */
export const board = [
  {
    id: "fatima",
    name: "Fatima-Iram Din",
    role: "executive",
    image: "/img/board-fatima.webp",
  },
  { id: "lisa", name: "Lisa Bodenheimer", role: "secretary", image: "/img/board-lisa.webp" },
  { id: "dan", name: "Dan Linginfelter", role: "treasurer", image: "/img/board-dan.webp" },
  { id: "yvan", name: "Dr. Yvan Demosthenes", role: "member", image: "/img/board-yvan.webp" },
  { id: "lee", name: "Rev. Mr. Lee Ashton DMG", role: "member", image: "/img/board-lee.webp" },
  { id: "sara", name: "Dr. Sara Currie Mansbach", role: "founder", image: "/img/board-sara.webp" },
] as const;

/** Annual reports hosted on the current site until they are re-uploaded. */
export const reports = [
  { year: 2024, href: "https://www.haiti-literacy.org/wp-content/uploads/2025/05/2024Annual-Report.pdf" },
  { year: 2022, href: "https://www.haiti-literacy.org/wp-content/uploads/2023/04/PILH2022AnnualReport.pdf" },
] as const;

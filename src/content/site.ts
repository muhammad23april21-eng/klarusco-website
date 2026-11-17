/**
 * Single source of truth for all business copy, pricing and configuration.
 * Copy is taken from "Web Site Content.docx". Edit here — components only render it.
 */

/* ------------------------------------------------------------------ */
/* Brand & configuration placeholders                                  */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'Klarus & Co',
  /** Typographic wordmark parts — swap the Logo component for final artwork when available. */
  wordmark: { primary: 'Klarus', ampersand: '&', secondary: 'Co' },
  /** Tagline shown beneath the name, one entry per line. */
  slogan: ['Next Is Now'],
  descriptor: 'Accounting & Financial Services',
  /** Used for the page title and meta description. */
  metaDescription:
    'Klarus & Co provides professional bookkeeping, accounting and financial support — financial reporting, management consultancy, budgeting & forecasting, cost control and actuarial valuation, with flexible hourly or dedicated monthly plans.',
}

const env = import.meta.env

export const config = {
  /** International format, digits only. Set VITE_WHATSAPP_NUMBER in .env.local */
  whatsappNumber: (env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '') || '',
  /** Set VITE_CONTACT_EMAIL in .env.local */
  email: (env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || '',
  /** Public scheduling page (Calendly, Cal.com, Microsoft Bookings…). Set VITE_BOOKING_URL */
  bookingUrl: (env.VITE_BOOKING_URL as string | undefined)?.trim() || '',
  /** Optional form backend (e.g. a Formspree endpoint) that accepts JSON POSTs. Set VITE_FORM_ENDPOINT */
  formEndpoint: (env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || '',
  /** Meeting-request / WhatsApp-notification backend used by the contact-options popup. Set VITE_BOOKING_ENDPOINT */
  bookingEndpoint: (env.VITE_BOOKING_ENDPOINT as string | undefined)?.trim() || '',
}

/**
 * Contact details for the contact-options popup shown after the Contact Us form is submitted.
 * Replace these values (or set VITE_WHATSAPP_NUMBER / VITE_CONTACT_EMAIL / VITE_BOOKING_URL,
 * which take priority). Meeting requests are made inside the popup (see BookingForm), not via meetingUrl.
 */
export const placeholderContact = {
  whatsappNumber: '923228504060', // +92 322 8504060
  email: 'info@klarusco.com',
  meetingUrl: 'https://example.com/book-a-meeting', // dummy
}

/** Contact details used by the post-submission popup: env values when configured, otherwise the defaults above. */
export const popupContact = {
  whatsappNumber: config.whatsappNumber || placeholderContact.whatsappNumber,
  email: config.email || placeholderContact.email,
  meetingUrl: config.bookingUrl || placeholderContact.meetingUrl,
}

/* ------------------------------------------------------------------ */
/* Imagery (local, optimized WebP from Unsplash — see public/images)   */
/* ------------------------------------------------------------------ */

export const images = {
  heroReports: '/images/hero-reports.webp',
  aboutOffice: '/images/about-office.webp',
  aboutExecutive: '/images/about-executive.webp',
  aboutTeam: '/images/about-team.webp',
  introWorkspace: '/images/intro-workspace.webp',
  homeAnalysis: '/images/home-analysis.webp',
  whyCollaboration: '/images/why-collaboration.webp',
  systemsInfrastructure: '/images/systems-infrastructure.webp',
  systemsWorkspace: '/images/systems-workspace.webp',
  processDiscussion: '/images/process-discussion.webp',
  hiwDashboard: '/images/hiw-dashboard.webp',
  meetingHandshake: '/images/meeting-handshake.webp',
  contactOffice: '/images/contact-office.webp',
  ctaSkyline: '/images/cta-skyline.webp',
  aboutReporting: '/images/about-reporting.webp',
  svcBookkeeping: '/images/svc-bookkeeping.webp',
  svcReporting: '/images/svc-reporting.webp',
  svcConsultancy: '/images/svc-consultancy.webp',
  svcBudgeting: '/images/svc-budgeting.webp',
  svcCost: '/images/svc-cost.webp',
  svcActuarial: '/images/svc-actuarial.webp',
  /** Services page only: actual vs budgeted performance chart (Budgeting & Forecasting) */
  svcBudgetingChart: '/images/svc-budgeting-chart.webp',
  /** Services page only: actuarial valuation report with benefit-obligation tables (Actuarial Valuation) */
  svcActuarialReport: '/images/svc-actuarial-report.webp',
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const routes = {
  home: '/',
  about: '/about',
  services: '/services',
  systems: '/systems',
  howItWorks: '/how-it-works',
  pricing: '/pricing',
  meeting: '/book-a-meeting',
  contact: '/contact',
} as const

export const nav = [
  { label: 'Home', to: routes.home },
  { label: 'About Us', to: routes.about },
  { label: 'Services', to: routes.services },
  { label: 'Systems We Work With', to: routes.systems },
  { label: 'How It Works', to: routes.pricing },
  { label: 'Contact Us', to: routes.contact },
]

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  headline: 'Professional Bookkeeping, Accounting & Financial Support',
  tagline: ['Accurate numbers.', 'Clear insights.', 'Smarter business decisions.'],
  experience: '20+ years of professional experience',
  intro:
    'With 20+ years of professional experience, Klarus & Co provides reliable, practical, and cost-effective bookkeeping and accounting solutions tailored to your business.',
  body:
    'From maintaining accurate financial records and delivering timely reports to providing flexible ongoing support, we help you stay financially organized, gain better visibility, and focus on running and growing your business.',
  primaryCta: { label: 'Get a Quote', to: '/contact' },
  secondaryCta: { label: 'Book a Meeting', to: '/book-a-meeting' },
}

/** Homepage hero — Webs Site Content V2.docx, "Home Page" › Top Line & Section 1. */
export const homeHero = {
  headline: 'Bookkeeping & Financial Consulting',
  description: [
    'Klarus & Co. is a professional bookkeeping and financial consulting firm delivering tailored solutions designed around each client’s unique needs.',
    'We help businesses maintain accurate bookkeeping and financial reporting, control costs, improve efficiency, and gain financial insights to strengthen profitability and long-term sustainability.',
  ],
}

/* ------------------------------------------------------------------ */
/* Why Businesses Choose Us                                            */
/* ------------------------------------------------------------------ */

export type IconKey =
  | 'quality'
  | 'timely'
  | 'expertise'
  | 'attention'
  | 'cost'
  | 'technology'
  | 'bookkeeping'
  | 'reporting'
  | 'consultancy'
  | 'budgeting'
  | 'costControl'
  | 'actuarial'

export const whyUs = {
  eyebrow: 'Why Businesses Choose Us',
  heading: 'Why Businesses Choose Us',
  items: [
    {
      icon: 'quality' as IconKey,
      title: 'Commitment to Quality',
      body: 'We maintain high standards in bookkeeping and accounting, with careful attention to accuracy, completeness, and consistency. Our focus is on keeping your financial records reliable and well organized.',
    },
    {
      icon: 'timely' as IconKey,
      title: 'Timely & Reliable Service',
      body: 'We understand the importance of having financial information available when you need it. We work to keep your bookkeeping and reporting current, ensuring you can rely on timely and dependable support.',
    },
    {
      icon: 'expertise' as IconKey,
      title: 'Professional Expertise',
      body: 'Our team combines practical accounting knowledge with professional experience to handle a wide range of bookkeeping and financial requirements. We provide support that is appropriate to the complexity and needs of your business.',
    },
    {
      icon: 'attention' as IconKey,
      title: 'Dedicated Attention',
      body: 'We give your accounting requirements the attention they deserve, whether you need support for specific tasks or ongoing assistance. Our approach ensures continuity and familiarity with your business and its financial processes.',
    },
    {
      icon: 'cost' as IconKey,
      title: 'Cost-Effective Support',
      body: 'Our efficient approach helps reduce the cost of maintaining your accounting function while providing access to professional expertise. This allows businesses to manage their financial records effectively without unnecessary overhead.',
    },
    {
      icon: 'technology' as IconKey,
      title: 'Technology-Driven Approach',
      body: 'We work with leading accounting and ERP systems and use modern tools and techniques to improve efficiency, organization, and accessibility of financial information. We can also adapt to the systems and processes already used by your business.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* About Us                                                            */
/* ------------------------------------------------------------------ */

export const about = {
  eyebrow: 'About Us',
  /** About page "Who we are" — second introductory paragraph. */
  approach:
    'Our approach combines practical accounting expertise with a clear understanding of business needs. We focus on accurate financial information, dependable support, and efficient processes that help businesses maintain control of their finances and make informed decisions.',
  /** Homepage "About Klarus & Co." section — Webs Site Content V2.docx, Section 4 of page 1. */
  intro:
    'Klarus & Co. is built on a professional identity shaped by four key strengths: the experience we bring, the value we deliver, the solutions we offer, and the approach we take. Together, these define our commitment to providing professional, reliable, and cost-effective financial services to our clients.',
  themes: [
    {
      label: 'Experience',
      title: '20+ Years of Professional Experience',
      body: 'With over two decades of professional experience in bookkeeping, accounting, and financial management, we bring practical knowledge, professional expertise, and sound financial judgment to help businesses manage their financial operations effectively.',
    },
    {
      label: 'Value',
      title: 'Professional Services at a Lower Cost',
      body: 'We deliver professional accounting and financial support without the overhead of maintaining an in-house team. Our flexible service model gives businesses access to experienced professionals while reducing operating expenses and making better use of their resources.',
    },
    {
      label: 'Solutions',
      title: 'Bookkeeping & Comprehensive Financial Services',
      body: 'From day-to-day bookkeeping to financial reporting, budgeting, cost management, and consultancy, we offer a range of services designed to address your business’s financial and operational needs.',
    },
    {
      label: 'Approach',
      title: 'Professional, Flexible & Technology-Driven',
      body: 'We adapt to your business requirements, systems, and processes, leveraging modern accounting technologies to ensure accurate records, efficient workflows, and timely access to reliable financial information.',
    },
  ],
}

/** About page — "Why Businesses Choose Us" tabs (Webs Site Content V2.docx, Section 2 of page 2). */
export const aboutWhy = {
  heading: 'Why Businesses Choose Us',
  intro:
    'Choosing the right financial services partner means finding a team that understands your business needs and delivers consistent value. At Klarus & Co., we focus on the qualities that matter most to our clients: quality, reliability, cost efficiency, and the effective use of technology.',
  items: [
    {
      icon: 'quality' as IconKey,
      title: 'Commitment to Quality',
      body: 'We are committed to maintaining high professional standards in every assignment, with close attention to accuracy, completeness, and consistency. Our emphasis on quality helps ensure dependable financial records and reporting that businesses can confidently rely on.',
    },
    {
      icon: 'timely' as IconKey,
      title: 'Timely & Reliable Service',
      body: 'We recognize that timely financial information is essential for effective business management. We prioritize meeting agreed timelines, maintaining clear communication, and providing consistent support so that clients can depend on us for their ongoing financial requirements.',
    },
    {
      icon: 'cost' as IconKey,
      title: 'Cost-Effective Support',
      body: 'We help businesses access professional bookkeeping and financial services without the expense of building and maintaining a full in-house team. Our flexible service arrangements provide access to the right level of expertise while helping businesses control operating costs and allocate resources more efficiently.',
    },
    {
      icon: 'technology' as IconKey,
      title: 'Technology-Driven Approach',
      body: 'We make effective use of modern accounting software, ERP platforms, and digital tools to improve the efficiency and organization of financial processes. Our ability to work across different systems and adapt to existing business environments allows us to deliver practical solutions that fit each client’s requirements.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export interface Service {
  icon: IconKey
  title: string
  slug: string
  badge?: string
  body: string[]
  image: string
}

export const services = {
  eyebrow: 'Our Services',
  heading: 'Our Bookkeeping & Financial Consulting Services',
  intro:
    'At Klarus & Co., we offer a range of professional bookkeeping, accounting, and financial consulting services designed to support businesses at every stage of business growth. Our solutions are tailored to individual client needs, helping businesses maintain financial control, improve operational efficiency, and make informed decisions.',
  items: [
    {
      icon: 'bookkeeping' as IconKey,
      title: 'Bookkeeping',
      body: [
        'Professional day-to-day bookkeeping support to keep your financial records accurate, organized, and up to date. We handle routine financial transactions, maintain ledgers, reconcile accounts, and help ensure your books are properly maintained.',
        'Whether you need occasional assistance or ongoing bookkeeping support, we provide flexible solutions tailored to your business requirements.',
      ],
      image: images.svcBookkeeping,
    },
    {
      icon: 'reporting' as IconKey,
      title: 'Financial Reporting',
      body: [
        'Clear, accurate, and timely financial reporting that provides management with reliable information about business performance and financial position. We prepare meaningful financial statements and management reports to help businesses understand their results and monitor financial health.',
        'Our reporting solutions help management identify trends, assess performance, and make better-informed business decisions.',
      ],
      image: images.svcReporting,
    },
    {
      icon: 'consultancy' as IconKey,
      title: 'Management Consultancy',
      body: [
        'Practical financial and management consultancy to help businesses analyze financial information, evaluate operational performance, and identify opportunities for improvement. We provide insights and recommendations to support better resource allocation, stronger financial management, and improved business performance.',
        'Our approach focuses on practical solutions that address business challenges and support sustainable growth.',
      ],
      image: images.svcConsultancy,
    },
    {
      icon: 'budgeting' as IconKey,
      title: 'Budgeting & Forecasting',
      body: [
        'Professional support with financial planning, budgeting, forecasting, and monitoring actual performance against expectations. We help businesses develop realistic budgets, anticipate financial requirements, and establish effective financial targets.',
        'Regular budget monitoring and variance analysis enable management to identify deviations, take corrective action, and maintain better financial control.',
      ],
      image: images.svcBudgetingChart,
    },
    {
      icon: 'costControl' as IconKey,
      title: 'Cost Control',
      body: [
        'Systematic analysis and monitoring of business costs to improve visibility over expenditure and support effective cost management. We help identify cost drivers, evaluate spending patterns, and highlight opportunities to reduce unnecessary expenses without compromising operational efficiency.',
        'Our cost management support helps businesses improve resource utilization, protect margins, and strengthen overall profitability.',
      ],
      image: images.svcCost,
    },
    {
      icon: 'actuarial' as IconKey,
      title: 'Actuarial Valuation',
      body: [
        'Professional actuarial valuation services to support businesses in meeting applicable financial reporting and accounting requirements. We provide actuarial assessment and valuation support for employee benefit obligations and other relevant long-term financial commitments.',
        'Our services help businesses obtain reliable valuation information for financial statements, reporting purposes, and informed financial planning.',
      ],
      image: images.svcActuarialReport,
    },
  ].map((s) => ({ ...s, slug: s.title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z]+/g, '-') })) as Service[],
}

/* ------------------------------------------------------------------ */
/* Systems                                                             */
/* ------------------------------------------------------------------ */

export const systems = {
  eyebrow: 'Systems We Work With',
  heading: 'Systems We Work With',
  items: ['Oracle', 'SAP', 'Microsoft Dynamics', 'QuickBooks', 'Odoo', 'Xero', 'Zoho Books', 'Sage'],
  /** Webs Site Content V2.docx, Page 3. */
  intro:
    'We work with leading accounting software and ERP systems, leveraging modern tools and technologies to improve efficiency, streamline financial processes, and ensure organized and accessible financial information. We adapt to the systems and processes already used by your business, providing solutions that fit your operational requirements.',
  custom: {
    title: 'Customized Solutions',
    body: 'Where standard accounting software or existing ERP solutions do not fully address your business requirements, we can develop customized systems and solutions designed around your specific business processes, operational needs, and reporting requirements.',
  },
  disclaimer:
    'Product names are trademarks of their respective owners and are listed to indicate the systems we work with. No partnership or endorsement is implied.',
}

/* ------------------------------------------------------------------ */
/* How It Works                                                        */
/* ------------------------------------------------------------------ */

export const howItWorks = {
  eyebrow: 'How It Works',
  heading: 'Getting Started Is Simple',
  steps: [
    {
      title: 'Tell Us About Your Business',
      body: 'Share your bookkeeping and accounting requirements with us.',
    },
    {
      title: 'Choose Your Support Model',
      body: 'Select flexible hourly support or a dedicated monthly accounting professional.',
    },
    {
      title: 'Choose Your Expertise Level',
      body: 'Select a Bookkeeper, Accounting Supervisor, or Accounting Manager based on your requirements.',
    },
    {
      title: 'Get Started',
      body: 'We agree on the scope of work, assign the appropriate professional, and begin supporting your business.',
    },
  ],
}

/** How It Works page (route /pricing) — Webs Site Content V2.docx, Page 4. */
export const howItWorksPage = {
  heading: 'How It Works',
  subheading: 'Plans That Fits Your Business Needs',
  intro: [
    'Every business has different accounting and financial management requirements. To provide flexibility and ensure you only pay for the level of support you need, we offer two simple engagement options.',
    'Whether you need occasional accounting support or a dedicated professional managing your financial activities on an ongoing basis, you can choose the plan that best suits your business.',
  ],
  step1: {
    label: 'Step 1',
    title: 'Tell Us About Your Business',
    body: 'Share some basic information about your business, industry, existing accounting systems, and financial support requirements. This helps us understand your operations and identify where our services can add value.',
  },
  step2: {
    label: 'Step 2',
    title: 'Select Your Support Model',
    body: 'Choose the support model that best suits your business.',
    plans: [
      {
        id: 'monthly' as PlanId,
        name: 'Monthly Fixed Plan',
        body: 'Our Monthly Fixed Plan provides an assigned professional working 5 days a week, 8 hours a day, delivering ongoing accounting and financial support at a predictable monthly cost.',
      },
      {
        id: 'hourly' as PlanId,
        name: 'Hourly Based Plan',
        body: 'Our Hourly Based Plan provides flexible access to professional accounting and financial support based on the actual hours required. You pay only for the time utilized, making it an ideal option for businesses requiring occasional assistance, specific assignments, or support for varying workloads.',
      },
    ],
  },
  step3: {
    label: 'Step 3',
    title: 'Select Your Accounting Professional',
    body: 'Select the accounting professional whose level of expertise and experience best matches your accounting and financial management requirements.',
  },
}

/* ------------------------------------------------------------------ */
/* Get a Quote & Pricing                                               */
/* ------------------------------------------------------------------ */

export type PlanId = 'hourly' | 'monthly'
export type TierId = 'bookkeeper' | 'supervisor' | 'manager'

export const quote = {
  eyebrow: 'Get a Quote',
  heading: 'Choose the Plan That Fits Your Business',
  intro: [
    'Every business has different accounting and financial management requirements. To provide flexibility and ensure you only pay for the level of support you need, we offer two simple engagement options.',
    'Whether you need occasional accounting support or a dedicated professional managing your financial activities on an ongoing basis, you can choose the plan that best suits your business.',
  ],
  nextLabel: 'Next',
}

export interface Tier {
  id: TierId
  title: string
  price: string
  unit: string
  body: string
}

export interface Plan {
  id: PlanId
  name: string
  shortName: string
  subtitle?: string
  description: string[]
  highlight?: string
  pricing: {
    heading: string
    intro: string[]
    tiers: Tier[]
  }
}

export const plans: Plan[] = [
  {
    id: 'hourly',
    name: 'Hourly-Based Plan',
    shortName: 'Hourly',
    subtitle: 'Flexible Support When You Need It',
    description: [
      'Our hourly-based plan is designed for businesses that require accounting and financial support on a flexible or as-needed basis.',
      'Under this model, you are billed based on the actual hours worked by our team.',
      'This plan is particularly suitable for businesses with minimal, occasional, or fluctuating accounting workloads.',
    ],
    pricing: {
      heading: 'Choose Your Level of Expertise',
      intro: [
        'Select the level of professional support that best matches your accounting and financial management requirements.',
      ],
      tiers: [
        {
          id: 'bookkeeper',
          title: 'Bookkeeper',
          price: '$10',
          unit: 'Hour',
          body: 'Suitable for businesses requiring day-to-day bookkeeping and accounting support. Our Bookkeepers help maintain accurate, organized, and up-to-date financial records.',
        },
        {
          id: 'supervisor',
          title: 'Supervisor',
          price: '$15',
          unit: 'Hour',
          body: 'Suitable for businesses requiring accounting supervision, review, and oversight. Our Supervisors provide an additional level of expertise to help ensure the quality and accuracy of bookkeeping and accounting activities.',
        },
        {
          id: 'manager',
          title: 'Manager',
          price: '$20',
          unit: 'Hour',
          body: 'Suitable for businesses requiring financial analysis, business insights, and financial advisory support. Our Managers provide management-level expertise to help businesses understand their financial position and support informed decision-making.',
        },
      ],
    },
  },
  {
    id: 'monthly',
    name: 'Monthly Fixed Plan',
    shortName: 'Monthly',
    description: [
      'Our monthly fixed plan is designed for businesses that require ongoing and dedicated accounting and financial support.',
      'Under this model, a dedicated professional or team is assigned to your business and fully deployed to manage the agreed scope of work.',
      'This provides a cost-effective solution with a dedicated professional working 5 days a week, 8 hours a day.',
    ],
    highlight: '5 days a week · 8 hours a day',
    pricing: {
      heading: 'Choose Your Dedicated Accounting Professional',
      intro: [
        'Our Monthly Fixed Plan provides a dedicated professional working 5 days a week, 8 hours a day, providing ongoing accounting and financial support at a predictable monthly cost.',
        'Select the level of expertise that best matches your business requirements.',
      ],
      tiers: [
        {
          id: 'bookkeeper',
          title: 'Bookkeeper',
          price: '$1,000',
          unit: 'Month',
          body: 'Suitable for businesses requiring dedicated day-to-day bookkeeping and accounting support. Your dedicated Bookkeeper will focus on maintaining accurate, organized, and up-to-date financial records.',
        },
        {
          id: 'supervisor',
          title: 'Supervisor',
          price: '$1,500',
          unit: 'Month',
          body: 'Suitable for businesses requiring dedicated accounting supervision, review, and oversight. Your dedicated Supervisor provides experienced support to help ensure the quality and accuracy of your accounting activities.',
        },
        {
          id: 'manager',
          title: 'Manager',
          price: '$2,000',
          unit: 'Month',
          body: 'Suitable for businesses requiring dedicated financial analysis, business insights, and financial advisory support. Your dedicated Manager provides management-level expertise to support financial planning and business decision-making.',
        },
      ],
    },
  },
]

/* ------------------------------------------------------------------ */
/* Book a Meeting & Contact                                            */
/* ------------------------------------------------------------------ */

export const meeting = {
  eyebrow: 'Book a Meeting',
  heading: 'Schedule a Meeting',
  // Short supporting line reuses the document's contact wording.
  body: 'Get in touch with us to discuss your bookkeeping and accounting requirements.',
  cta: 'Schedule a Meeting',
}

export const contact = {
  eyebrow: 'Contact Us',
  heading: 'Not Sure Which Option Is Right for You?',
  body: 'No problem. Tell us about your business and your accounting requirements, and we can discuss the appropriate level of support with you.',
  secondary: 'Get in touch with us to discuss your bookkeeping and accounting requirements.',
}

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
  /** Slogan lockup shown beneath the name, one entry per line. */
  slogan: ['Consulting & Business Solutions', 'Next Is Now'],
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
}

/* ------------------------------------------------------------------ */
/* Imagery (local, optimized WebP from Unsplash — see public/images)   */
/* ------------------------------------------------------------------ */

export const images = {
  heroReports: '/images/hero-reports.webp',
  aboutOffice: '/images/about-office.webp',
  aboutExecutive: '/images/about-executive.webp',
  aboutTeam: '/images/about-team.webp',
  introMeeting: '/images/intro-meeting.webp',
  homeAnalysis: '/images/home-analysis.webp',
  whyCollaboration: '/images/why-collaboration.webp',
  systemsTech: '/images/systems-tech.webp',
  systemsWorkspace: '/images/systems-workspace.webp',
  processDiscussion: '/images/process-discussion.webp',
  pricingDesk: '/images/pricing-desk.webp',
  meetingHandshake: '/images/meeting-handshake.webp',
  contactOffice: '/images/contact-office.webp',
  ctaSkyline: '/images/cta-skyline.webp',
  svcBookkeeping: '/images/svc-bookkeeping.webp',
  svcReporting: '/images/svc-reporting.webp',
  svcConsultancy: '/images/svc-consultancy.webp',
  svcBudgeting: '/images/svc-budgeting.webp',
  svcCost: '/images/svc-cost.webp',
  svcActuarial: '/images/svc-actuarial.webp',
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
  { label: 'About', to: routes.about },
  { label: 'Services', to: routes.services },
  { label: 'Systems', to: routes.systems },
  { label: 'How It Works', to: routes.howItWorks },
  { label: 'Pricing', to: routes.pricing },
  { label: 'Contact', to: routes.contact },
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
  primaryCta: { label: 'Get a Quote', to: '/pricing' },
  secondaryCta: { label: 'Book a Meeting', to: '/book-a-meeting' },
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
  themes: [
    {
      label: 'Experience',
      title: '20+ Years of Professional Experience',
      body: 'With over 20 years of experience, we bring extensive knowledge and practical expertise in bookkeeping, accounting, and financial management. We provide accurate, reliable solutions tailored to each client’s needs.',
    },
    {
      label: 'Value',
      title: 'Reliable Bookkeeping at a Lower Cost',
      body: 'Our efficient approach helps businesses reduce bookkeeping costs while maintaining accuracy and quality. We handle essential accounting tasks so you can focus on your core business and growth.',
    },
    {
      label: 'Solutions',
      title: 'Bookkeeping & Accounting Solutions That Fit Your Business',
      body: 'We provide bookkeeping, financial reporting, management accounts, budgeting, forecasting, and cost control. Our services can be tailored to your needs and scaled as your business grows.',
    },
    {
      label: 'Approach',
      title: 'Professional, Flexible & Technology-Driven',
      body: 'We combine professional expertise with modern accounting systems and technology to keep financial records accurate and up to date. Our approach adapts to your processes, systems, and business requirements.',
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
  heading: 'Our Accounting & Financial Services',
  intro:
    'We provide practical accounting and financial solutions designed to meet the day-to-day and ongoing requirements of your business.',
  items: [
    {
      icon: 'bookkeeping' as IconKey,
      title: 'Bookkeeping',
      badge: 'Our Core Service',
      body: [
        'Professional day-to-day bookkeeping support to keep your financial records accurate, organized, and up to date.',
        'Whether you need occasional assistance or ongoing bookkeeping support, we provide flexible solutions based on your business requirements.',
      ],
      image: images.svcBookkeeping,
    },
    {
      icon: 'reporting' as IconKey,
      title: 'Financial Reporting',
      body: [
        'Clear and timely financial reporting that provides management with reliable information about business performance and financial position.',
      ],
      image: images.svcReporting,
    },
    {
      icon: 'consultancy' as IconKey,
      title: 'Management Consultancy',
      body: [
        'Practical financial and management support to help businesses analyze financial information, understand performance, and make informed decisions.',
      ],
      image: images.svcConsultancy,
    },
    {
      icon: 'budgeting' as IconKey,
      title: 'Budgeting & Forecasting',
      body: [
        'Support with financial planning, budgeting, forecasting, and monitoring actual performance against expectations.',
      ],
      image: images.svcBudgeting,
    },
    {
      icon: 'costControl' as IconKey,
      title: 'Cost Control',
      body: [
        'Analysis and monitoring of business costs to improve visibility over expenditure and support effective cost management.',
      ],
      image: images.svcCost,
    },
    {
      icon: 'actuarial' as IconKey,
      title: 'Actuarial Valuation',
      body: [
        'Professional actuarial valuation support for applicable financial, accounting, and business requirements.',
      ],
      image: images.svcActuarial,
    },
  ].map((s) => ({ ...s, slug: s.title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z]+/g, '-') })) as Service[],
}

/* ------------------------------------------------------------------ */
/* Systems                                                             */
/* ------------------------------------------------------------------ */

export const systems = {
  eyebrow: 'Systems We Work With',
  heading: 'Systems We Work With',
  items: ['Oracle', 'SAP', 'QuickBooks', 'Odoo', 'Xero', 'Sage', 'Zoho Books', 'Microsoft Dynamics'],
  /** Supporting line taken from the "Technology-Driven Approach" benefit. */
  intro:
    'We work with leading accounting and ERP systems and use modern tools and techniques to improve efficiency, organization, and accessibility of financial information. We can also adapt to the systems and processes already used by your business.',
  custom: {
    title: 'Customized Solutions',
    body: 'Where your requirements extend beyond standard accounting systems, we can also support customized development and solutions designed around your specific business processes.',
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

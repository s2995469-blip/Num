export const serviceSlugs = [
  "numerology",
  "reiki-healing",
  "career-counselling",
  "relationship-counselling",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export type FAQ = { q: string; a: string };

export type Service = {
  slug: ServiceSlug;
  index: string;
  title: string;
  /** Short label used in forms and admin. */
  label: string;
  summary: string;
  cta: string;
  metaDescription: string;
  faqs: FAQ[];
};

export const services: Service[] = [
  {
    slug: "numerology",
    index: "01",
    title: "Numerology",
    label: "Numerology",
    summary:
      "Explore the meaning of your numbers and reflect on your personal strengths, patterns, and direction.",
    cta: "Explore Numerology",
    metaDescription:
      "Personal numerology consultations with Saamruddhi Varkhede — an interpretive, reflective look at the numbers in your name and birth date.",
    faqs: [
      {
        q: "Can numerology predict my future?",
        a: "No. Numerology is a traditional, interpretive framework rather than a scientifically established method of prediction. In a session it is used as a structured prompt for reflection — a way to think about your strengths, tendencies and choices. What you decide to do with those reflections is always yours.",
      },
      {
        q: "What information will I need to share?",
        a: "A numerology reading usually works from your full birth name and date of birth. You don't need to provide these when you first enquire. Once your session is confirmed, you'll be told exactly what is needed and why, and asked to share it separately.",
      },
      {
        q: "Do I need to believe in numerology for the session to be useful?",
        a: "Not at all. Many people approach numerology with curiosity rather than belief. The session is a conversation, and the numbers are a starting point for questions about how you work, what matters to you and where you'd like to go.",
      },
      {
        q: "Can I use a numerology session to make an important decision?",
        a: "A session can help you reflect, but it should not be the sole basis for financial, medical, legal or other significant decisions. For those, please seek appropriately qualified professional advice.",
      },
    ],
  },
  {
    slug: "reiki-healing",
    index: "02",
    title: "Reiki Healing",
    label: "Reiki Healing",
    summary:
      "Discover a calm, intentional space for relaxation, reflection, and personal wellbeing.",
    cta: "Explore Reiki",
    metaDescription:
      "Reiki sessions at Powerhouse Numerology — a calm, unhurried space for relaxation and reflection. A complementary practice, not a medical treatment.",
    faqs: [
      {
        q: "Is Reiki a medical treatment?",
        a: "No. Reiki is a complementary practice focused on relaxation and wellbeing. It does not diagnose, treat or cure any medical or psychological condition and is not a substitute for care from a doctor or other licensed health professional. Please continue any treatment you are receiving.",
      },
      {
        q: "Do I need to undress?",
        a: "No. Reiki is traditionally received fully clothed. Comfortable, loose clothing is recommended.",
      },
      {
        q: "Will I be touched during the session?",
        a: "Practices vary — some practitioners use light touch, others hold their hands slightly away from the body. What will happen is explained before the session begins, and you can ask for a no-touch session or pause at any time.",
      },
      {
        q: "What will I feel?",
        a: "Experiences differ from person to person. Some people describe deep relaxation, warmth or a quiet mind; others notice very little. There is no 'right' experience, and no particular outcome is promised.",
      },
    ],
  },
  {
    slug: "career-counselling",
    index: "03",
    title: "Career Counselling",
    label: "Career Counselling",
    summary:
      "Explore your interests, consider new possibilities, and approach career decisions with greater clarity.",
    cta: "Explore Career Guidance",
    metaDescription:
      "Career guidance sessions to explore your interests, weigh options and approach career decisions with greater clarity — with an optional numerology perspective.",
    faqs: [
      {
        q: "Is this numerology-based or conventional career guidance?",
        a: "It can be either — and the difference is made clear. The core of the session is a practical conversation about your interests, experience, values and options. If you would also like a numerology perspective, it can be added as a separate, clearly labelled reflective lens. It is never presented as a prediction of career success.",
      },
      {
        q: "Will I be told which career to choose?",
        a: "No. The aim is to help you think more clearly — surfacing what you care about, testing assumptions and identifying sensible next steps. The decision remains yours.",
      },
      {
        q: "Is the practitioner a licensed career counsellor?",
        a: "Professional qualifications will be listed on this site once they have been confirmed. Until then, please treat sessions as reflective guidance conversations. For regulated advice (legal, financial or immigration, for example) please consult an appropriately qualified professional.",
      },
      {
        q: "Who are sessions suited to?",
        a: "Students choosing a direction, people considering a change, professionals returning to work, and anyone feeling stuck who would value a structured conversation.",
      },
    ],
  },
  {
    slug: "relationship-counselling",
    index: "04",
    title: "Relationship Counselling",
    label: "Relationship Counselling",
    summary:
      "Explore communication, personal boundaries, and ways to develop healthier relationship patterns.",
    cta: "Explore Relationship Guidance",
    metaDescription:
      "Reflective relationship guidance on communication, boundaries and patterns. Not therapy or crisis support.",
    faqs: [
      {
        q: "Is this therapy?",
        a: "No. Sessions are reflective guidance conversations, not psychotherapy or clinical counselling, and the practitioner is not presented as a licensed therapist. If you are dealing with mental-health difficulties, trauma or abuse, please contact a licensed mental-health professional.",
      },
      {
        q: "Can I attend with my partner?",
        a: "Sessions are currently described as one-to-one guidance. If you would like to attend with a partner or family member, mention this in your enquiry and you'll be told whether a joint session is available.",
      },
      {
        q: "Is what I share kept confidential?",
        a: "What you discuss is treated with discretion and is not shared without your permission, except where there is a serious risk of harm. The privacy policy explains how enquiry information is stored.",
      },
      {
        q: "What if I'm in immediate danger?",
        a: "These sessions are not an emergency or crisis service. If you or someone else is in danger, please contact your local emergency services immediately.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function isServiceSlug(value: unknown): value is ServiceSlug {
  return typeof value === "string" && (serviceSlugs as readonly string[]).includes(value);
}

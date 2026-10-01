import type { ServiceSlug } from "./services";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "note"; text: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  /** ISO date the article was first published on this site. */
  published: string;
  /** Cover motif used by <ArticleCover />; swap for a real image via coverImage. */
  motif: "sphere" | "path" | "rings" | "arch" | "pair";
  coverImage?: string;
  relatedService: ServiceSlug;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "what-is-numerology",
    title: "What Is Numerology? An Introduction to Its Core Ideas",
    excerpt:
      "A clear, grounded introduction to numerology — where it comes from, how its core numbers are calculated, and how it can be used as a tool for reflection.",
    category: "Numerology",
    readingMinutes: 6,
    published: "2026-10-01",
    motif: "sphere",
    relatedService: "numerology",
    body: [
      {
        type: "p",
        text: "Numerology is the practice of assigning meaning to numbers and using those meanings to reflect on character, tendencies and life themes. It has roots in several traditions — Pythagorean ideas in ancient Greece, the Hebrew practice of gematria, and Indian and Chaldean systems among them — and has been reinterpreted many times since.",
      },
      {
        type: "p",
        text: "It is worth being clear from the start: numerology is an interpretive framework, not a science. It does not predict events, and it isn't supported by scientific evidence as a way of forecasting what will happen to you. What it can offer is a structured, symbolic language for thinking about yourself — a set of prompts that invite reflection.",
      },
      { type: "h2", text: "The basic idea" },
      {
        type: "p",
        text: "Most modern numerology works by reducing names and dates to single digits (1 to 9), sometimes keeping the so-called master numbers 11, 22 and 33. Each digit is associated with a set of qualities. The number 1, for instance, is commonly linked with independence and initiative; 2 with cooperation and sensitivity; 7 with reflection, analysis and the search for meaning.",
      },
      {
        type: "p",
        text: "These associations are traditional rather than fixed, and different systems describe them a little differently. A thoughtful reading treats them as starting points for conversation rather than labels.",
      },
      { type: "h2", text: "The core numbers" },
      {
        type: "p",
        text: "A full reading usually looks at a handful of numbers, each drawn from a different source:",
      },
      {
        type: "ul",
        items: [
          "Life Path number — calculated from your full date of birth and often treated as the central theme of a reading.",
          "Expression (or Destiny) number — calculated from the letters of your full birth name, associated with natural abilities and ways of working.",
          "Soul Urge number — drawn from the vowels of your name, linked with inner motivations.",
          "Personality number — drawn from the consonants, associated with how others may first perceive you.",
          "Personal Year number — combining your birth date with the current year, used to reflect on the themes of a particular year.",
        ],
      },
      { type: "h2", text: "How to use numerology well" },
      {
        type: "p",
        text: "The most useful way to approach numerology is with curiosity. When a description resonates, ask why. When it doesn't, that's useful too — it tells you something about how you see yourself. A good session encourages you to notice patterns in your own experience rather than handing you a script to follow.",
      },
      {
        type: "quote",
        text: "The numbers don't decide anything. They give you a different angle from which to look at the decisions you're already facing.",
      },
      {
        type: "p",
        text: "Numerology should never replace professional advice for medical, legal, financial or psychological matters. Used alongside practical thinking, though, it can be a gentle and surprisingly engaging way to step back and consider where you are.",
      },
      {
        type: "note",
        text: "Curious about your own numbers? A personal numerology session explores them in conversation, at your pace.",
      },
    ],
  },
  {
    slug: "understanding-life-path-numbers",
    title: "Understanding Life Path Numbers",
    excerpt:
      "How the Life Path number is calculated, what each number is traditionally associated with, and how to read it as a reflective prompt rather than a prediction.",
    category: "Numerology",
    readingMinutes: 7,
    published: "2026-10-01",
    motif: "rings",
    relatedService: "numerology",
    body: [
      {
        type: "p",
        text: "If you have come across numerology before, the Life Path number is probably the one you've heard of. It is calculated from your full date of birth and is often described as the central theme of a reading — the thread that ties the other numbers together.",
      },
      { type: "h2", text: "How it is calculated" },
      {
        type: "p",
        text: "The most common method reduces the day, month and year separately, then adds the results together and reduces again. Take a birth date of 14 March 1992:",
      },
      {
        type: "ul",
        items: [
          "Day: 14 → 1 + 4 = 5",
          "Month: March is 3 → 3",
          "Year: 1992 → 1 + 9 + 9 + 2 = 21 → 2 + 1 = 3",
          "Total: 5 + 3 + 3 = 11",
        ],
      },
      {
        type: "p",
        text: "Because 11 is traditionally treated as a master number, many practitioners would leave it unreduced. Others would reduce it to 2. Small differences in method like this are one reason to treat any single number lightly.",
      },
      { type: "h2", text: "Traditional associations" },
      {
        type: "p",
        text: "The descriptions below summarise common associations. Read them as themes to consider, not as statements of fact about anyone.",
      },
      {
        type: "ul",
        items: [
          "1 — initiative, independence, self-direction.",
          "2 — partnership, diplomacy, attentiveness to others.",
          "3 — expression, creativity, communication.",
          "4 — structure, patience, practical building.",
          "5 — change, curiosity, freedom.",
          "6 — care, responsibility, community.",
          "7 — reflection, study, the search for meaning.",
          "8 — ambition, organisation, material focus.",
          "9 — compassion, completion, a wider perspective.",
          "11, 22, 33 — master numbers, often read as amplified versions of 2, 4 and 6.",
        ],
      },
      { type: "h2", text: "Reading it as a question" },
      {
        type: "p",
        text: "A helpful way to work with a Life Path description is to turn it into questions. If your number is associated with structure, you might ask: where in my life do I value order, and where does it hold me back? If it's associated with change: what kinds of change energise me, and which do I avoid?",
      },
      {
        type: "p",
        text: "These questions are useful whether or not you think the number 'fits'. The value lies in the reflection, not in the label.",
      },
      {
        type: "note",
        text: "In a numerology session, your Life Path number is explored alongside your other core numbers and — more importantly — your own experience.",
      },
    ],
  },
  {
    slug: "what-to-expect-during-a-reiki-session",
    title: "What to Expect During a Reiki Session",
    excerpt:
      "A calm, practical guide to a first Reiki session: how it usually unfolds, how to prepare, and what Reiki is — and is not.",
    category: "Reiki",
    readingMinutes: 5,
    published: "2026-10-01",
    motif: "arch",
    relatedService: "reiki-healing",
    body: [
      {
        type: "p",
        text: "Reiki is a Japanese practice developed in the early twentieth century. A practitioner places their hands lightly on, or just above, different areas of the body while the recipient rests. People most often describe it as deeply relaxing.",
      },
      {
        type: "p",
        text: "Reiki is a complementary practice. It is not a medical treatment, it does not diagnose or cure illness, and it should never replace care from a doctor or other licensed professional.",
      },
      { type: "h2", text: "Before the session" },
      {
        type: "ul",
        items: [
          "Wear comfortable, loose clothing — you remain fully clothed throughout.",
          "Eat lightly beforehand and arrive (or log on) with a few minutes to settle.",
          "Let the practitioner know about anything that affects your comfort, such as difficulty lying flat, or a preference for no physical touch.",
        ],
      },
      { type: "h2", text: "During the session" },
      {
        type: "p",
        text: "A session usually begins with a short conversation about how you're feeling and what you'd like from the time. You'll then lie down or sit comfortably. The practitioner works slowly through a sequence of hand positions, often in silence or with soft background sound.",
      },
      {
        type: "p",
        text: "You are always in control. You can ask questions, change position, ask for a pause or end the session at any point.",
      },
      { type: "h2", text: "Afterwards" },
      {
        type: "p",
        text: "Many people feel calm or a little sleepy afterwards; some notice very little. Take a few minutes before driving, drink some water, and give yourself a gentle rest of the day if you can.",
      },
      {
        type: "quote",
        text: "There is no right way to experience a session. Arriving as you are is enough.",
      },
      {
        type: "note",
        text: "If you'd like to try Reiki, you can read more about how sessions work at Powerhouse Numerology and send an enquiry when you're ready.",
      },
    ],
  },
  {
    slug: "reflective-questions-for-career-decisions",
    title: "Reflective Questions for Career Decisions",
    excerpt:
      "Twelve questions to slow down a big career decision — about energy, values, constraints and next steps — and how to use them.",
    category: "Career",
    readingMinutes: 6,
    published: "2026-10-01",
    motif: "path",
    relatedService: "career-counselling",
    body: [
      {
        type: "p",
        text: "Career decisions rarely arrive neatly. They tend to come as a vague restlessness, a sudden opportunity or an ending you didn't choose. In each case it helps to slow down and ask better questions before reaching for an answer.",
      },
      {
        type: "p",
        text: "The questions below are grouped into four areas. You don't need to answer all of them; pick the ones that catch your attention and write your answers down — writing tends to be more honest than thinking.",
      },
      { type: "h2", text: "Energy" },
      {
        type: "ul",
        items: [
          "Which parts of my current or recent work leave me with more energy than they take?",
          "When did I last lose track of time while working? What was I doing?",
          "What do I find myself avoiding, and why?",
        ],
      },
      { type: "h2", text: "Values" },
      {
        type: "ul",
        items: [
          "What would I want a close friend to say about how I spend my working life?",
          "Which compromises feel acceptable to me — and which don't?",
          "Whose expectations am I carrying, and do I share them?",
        ],
      },
      { type: "h2", text: "Constraints" },
      {
        type: "ul",
        items: [
          "What are my real financial and practical limits for the next twelve months?",
          "Which constraints are fixed, and which are assumptions I haven't tested?",
          "What support do I have, and what would I need?",
        ],
      },
      { type: "h2", text: "Next steps" },
      {
        type: "ul",
        items: [
          "What is the smallest experiment I could run to learn more?",
          "Who could I speak to who is already doing what I'm considering?",
          "What would I regret not having tried in five years' time?",
        ],
      },
      {
        type: "p",
        text: "Good decisions usually combine reflection with information. Once you have a clearer sense of what matters, look for real-world evidence: conversations, job descriptions, short courses or volunteering. And for regulated questions — contracts, finances, visas — speak to a qualified adviser.",
      },
      {
        type: "note",
        text: "A career guidance session works through questions like these with you, in conversation.",
      },
    ],
  },
  {
    slug: "healthy-communication-and-personal-boundaries",
    title: "Healthy Communication and Personal Boundaries",
    excerpt:
      "What boundaries are (and aren't), how to express them clearly, and small communication habits that make relationships feel safer.",
    category: "Relationships",
    readingMinutes: 6,
    published: "2026-10-01",
    motif: "pair",
    relatedService: "relationship-counselling",
    body: [
      {
        type: "p",
        text: "Boundaries are often misunderstood as walls. In practice they are closer to descriptions: a clear statement of what you are and are not comfortable with, and what you will do to look after yourself. Healthy relationships need them — not to keep people out, but to make closeness feel safe.",
      },
      { type: "h2", text: "What a boundary sounds like" },
      {
        type: "p",
        text: "A boundary is about your own actions, not about controlling someone else. Compare these two statements:",
      },
      {
        type: "ul",
        items: [
          "\"You need to stop calling me so late.\" — an instruction to another person.",
          "\"I'm not able to take calls after ten. If you call later, I'll reply in the morning.\" — a boundary.",
        ],
      },
      {
        type: "p",
        text: "The second is calmer, clearer and doesn't depend on the other person agreeing. It simply tells them what to expect.",
      },
      { type: "h2", text: "Communication habits that help" },
      {
        type: "ul",
        items: [
          "Describe, don't diagnose — talk about what happened and how it affected you, rather than what it says about the other person.",
          "One topic at a time — difficult conversations go better when they stay focused.",
          "Check your understanding — \"What I'm hearing is… is that right?\" prevents a great deal of conflict.",
          "Pause when you need to — \"I want to continue this, but I need twenty minutes first\" is a healthy sentence.",
        ],
      },
      { type: "h2", text: "When patterns repeat" },
      {
        type: "p",
        text: "If the same argument keeps returning, it can help to look at the pattern rather than the topic: who usually pursues, who withdraws, what each person is hoping for. Naming a pattern together often takes some of the heat out of it.",
      },
      {
        type: "p",
        text: "If a relationship involves fear, coercion or harm, that is not a communication problem and is not something to work through alone. Please contact local support services or, in an emergency, emergency services.",
      },
      {
        type: "note",
        text: "Relationship guidance sessions offer a calm space to reflect on communication, boundaries and patterns. They are not therapy or crisis support.",
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

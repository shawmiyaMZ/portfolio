import type { PortableTextBlock } from "@portabletext/react";
import type {
  Post,
  PostSummary,
  PortableText,
  Profile,
  ProjectSummary,
  Project,
} from "./types";

/**
 * Seed content — the user's real portfolio.
 *
 * Two jobs. It is the copy that gets pushed into Sanity so the site looks
 * alive on day one, and it is what the site renders before Sanity is
 * configured — so every layout can be audited against the real portfolio
 * rather than placeholder boxes.
 *
 * This is real content, not scaffolding. The projects (Kandy Cycle, Fit Pat,
 * the portfolio itself), the journal posts and the profile were written by
 * the owner and mirror the live CMS, so a fresh setup and an empty dataset
 * receive the actual portfolio rather than fabricated stand-ins.
 *
 * One boundary worth stating: image assets are deliberately not carried in
 * the seed. Bodies transcribe the real prose but drop `image` members, and
 * projects carry no cover image or gallery — an uploaded asset has a binary
 * the seed cannot ship. The rendered fallback uses the designed clay cover
 * state; the Studio is where real images are uploaded.
 */

/* ---------- portable-text builders ----------
   These mirror exactly what the Studio emits. Keys are hand-written and must
   stay unique within their own array; Sanity generates them, but seed content
   has to supply its own. Exported so the renderer-cover fixtures in
   `proseRendererFixtures.ts` are built with identical shapes. */

type Span = { _type: "span"; _key: string; text: string; marks: string[] };

export const span = (
  text: string,
  key: string,
  marks: string[] = [],
): Span => ({ _type: "span", _key: key, text, marks });

/** A block built from pre-made spans, for mixed formatting within a paragraph. */
export const rich = (
  key: string,
  children: Span[],
  markDefs: Array<Record<string, unknown>> = [],
  style: string = "normal",
  extras: Partial<PortableTextBlock> = {},
): PortableTextBlock =>
  ({
    _type: "block",
    _key: key,
    style,
    markDefs,
    children,
    ...extras,
  }) as PortableTextBlock;

/** The common case: one unformatted run of text. */
export const block = (text: string, key: string, style = "normal") =>
  rich(key, [span(text, `${key}s`)], [], style);

export const h2 = (text: string, key: string) => block(text, key, "h2");
export const h3 = (text: string, key: string) => block(text, key, "h3");
export const quote = (text: string, key: string) => block(text, key, "blockquote");

/** A paragraph opening in bold, followed by an unmarked run. */
export const strongLead = (lead: string, rest: string, key: string) =>
  rich(key, [
    span(lead, `${key}a`, ["strong"]),
    span(rest, `${key}b`),
  ]);

/** List items are ordinary blocks carrying `listItem` and `level`. */
export const li = (
  text: string,
  key: string,
  listItem: "bullet" | "number" = "bullet",
): PortableTextBlock =>
  ({
    _type: "block",
    _key: key,
    style: "normal",
    listItem,
    level: 1,
    markDefs: [],
    children: [span(text, `${key}s`)],
  }) as PortableTextBlock;

export const bullets = (items: string[], keyBase: string) =>
  items.map((t, i) => li(t, `${keyBase}${i}`, "bullet"));

export const numbers = (items: string[], keyBase: string) =>
  items.map((t, i) => li(t, `${keyBase}${i}`, "number"));

export const codeBlock = (
  key: string,
  language: string,
  source: string,
  filename?: string,
) => ({ _type: "codeBlock", _key: key, language, filename, code: source });

export const callout = (
  key: string,
  tone: "note" | "insight" | "warning",
  body: string,
) => ({ _type: "callout", _key: key, tone, body });

/** A paragraph ending in a link — the shape most body copy actually needs. */
export const withLink = (
  key: string,
  before: string,
  linkText: string,
  href: string,
  after = ".",
): PortableTextBlock =>
  rich(
    key,
    [
      span(before, `${key}a`),
      span(linkText, `${key}b`, [`${key}link`]),
      span(after, `${key}c`),
    ],
    [{ _key: `${key}link`, _type: "link", href }],
  );

export const seedProfile: Profile = {
  name: "Shawmiya Zarook",
  headline: "Software Engineer growing into AI Engineering",
  thesis:
    "Great software begins with understanding the problem. I build practical applications now and I'm learning to build intelligent systems next.",
  linkedinUrl: "https://www.linkedin.com/in/shawmiya-zarook-5a61aa237/",
  bio: [
    block(
      "I graduated in Computing in 2025 and I'm now an engineering intern, building with AI engineering.",
      "b1",
    ),
    block(
      "My final-year project was a peer-to-peer bicycle rental platform for cycling tourism in Kandy. It taught me more through what I had to cut than through what I finished: I designed a graph-based route recommender and shipped curated routes instead, because a working simple feature beats a half-built clever one when there is a deadline.",
      "b3",
    ),
    block(
      "I write here mostly to think clearly. The write-ups I learned the most from were the ones that admitted what broke, so mine try to do the same.",
      "b5",
    ),
  ],
  education: [
    {
      qualification: "BSc (Hons) Computing",
      institution: "University of Gloucestershire",
      period: "2024 — 2025",
    },
    {
      qualification: "Higher Diploma in Software Engineering",
      institution: "Open University of Sri Lanka",
      period: "2022 — 2024",
    },
  ],
  skillGroups: [
    {
      category: "Languages",
      skills: [
        { name: "TypeScript", level: "daily" },
        { name: "JavaScript", level: "daily" },
        { name: "SQL", level: "comfortable" },
        { name: "Python", level: "comfortable" },
      ],
    },
    {
      category: "Web",
      skills: [
        { name: "React", level: "daily" },
        { name: "Next.js", level: "comfortable" },
        { name: "Tailwind CSS", level: "daily" },
        { name: "shadcn/ui", level: "comfortable" },
      ],
    },
    {
      category: "Data & services",
      skills: [
        { name: "PostgreSQL", level: "comfortable" },
        { name: "Supabase", level: "comfortable" },
        { name: "Sanity", level: "comfortable" },
        { name: "Stripe", level: "learning" },
      ],
    },
  ],
  milestones: [
    {
      year: "2026",
      event: "Software engineering intern",
      detail: "Building with AI engineering, and writing up what I learn as I go.",
    },
    {
      year: "2025",
      event: "Graduated BSc (Hons) Computing",
      detail:
        "My dissertation shipped Kandy Cycle: a peer-to-peer bicycle rental platform for cycling tourism in Kandy.",
    },
    {
      year: "2024",
      event: "Higher Diploma in Software Engineering",
      detail:
        "Completed at the Open University of Sri Lanka, then moved to the final year of the BSc.",
    },
    {
      year: "2023",
      event: "First full applications",
      detail:
        "Coursework projects in Python, Java, PHP and JavaScript: the first things I built that someone other than me had to use.",
    },
  ],
};

export const seedProjects: Project[] = [
  {
    title: "Software Engineering Portfolio CMS",
    slug: "software-engineering-portfolio-cms",
    summary:
      "A portfolio built to separate content from code, making projects and technical writing easier to maintain and publish through a CMS.",
    date: "2026-08-07",
    featured: true,
    role: "Software Engineering Intern (Sole Developer)",
    techTags: [
      "Next.js",
      "TypeScript",
      "React",
      "Sanity CMS",
      "GROQ",
      "Tailwind CSS",
      "Vercel",
    ],
    githubUrl: "https://github.com/shawmiyaMZ/portfolio",
    /* No liveUrl. The live demo of this project is the site the reader is
       already on, so the button pointed at the current page and appeared to
       do nothing. Blank means the case study renders without it. */
    problem: [
      block(
        "A portfolio that keeps its content in code makes every edit a deployment. Fixing one sentence in a case study means editing a file, committing it, and waiting for a build. I wanted to separate the content from the application so I could publish projects and journal entries without changing the code.",
        "pp1",
      ),
      block(
        "That mattered here because the portfolio itself is part of how I present my engineering work. It needs to be easy to maintain and keep accurate as the projects and writing change.",
        "pp2",
      ),
    ],
    approach: [
      block("Three decisions shaped everything else.", "pa1"),
      strongLead(
        "I kept all content reads behind one boundary.",
        " The GROQ queries live in a single module, with each query carrying the cache tag it depends on, so pages don't have to know how Sanity is queried or how its data should be invalidated. This made the publishing path easier to reason about: the query and the cache it depends on stay together instead of being maintained in separate places.",
        "pa2",
      ),
      strongLead(
        "I kept syntax highlighting on the server.",
        " Shiki highlights code while the page is rendered and sends the browser styled HTML, so there is no client-side highlighting code to download or execute. The alternative would add roughly 40–100 KB of JavaScript and introduce a flash of unstyled code for the same result.",
        "pa3",
      ),
      strongLead(
        "I made publishing invalidate content by document type.",
        " When Sanity publishes a change, the webhook tells the application which type changed, and only that cache tag is revalidated. A journal update doesn't need to invalidate project content, and a project update doesn't need to touch the journal.",
        "pa4",
      ),
    ],
    /* The published case study closes on an architecture diagram. It is not
       reproduced here for the reason given at the top of this file: an
       uploaded asset has no meaning outside the dataset that holds it. */
    outcome: [
      block(
        "The publishing workflow works: I can write or update content in Sanity and have the change reach the live site without a deployment.",
        "po1",
      ),
      rich("po2", [
        span(
          "But building the system also exposed a problem I hadn't expected. The sitemap had frozen at the previous deployment. Its ",
          "po2a",
        ),
        span("lastmod", "po2b", ["code"]),
        span(
          " still showed the build timestamp 62 hours later, which meant a project published during that period was missing from the sitemap even though it was already visible on ",
          "po2c",
        ),
        span("/work", "po2d", ["code"]),
        span(".", "po2e"),
      ]),
      rich("po3", [
        span("I found the issue by checking the sitemap's own ", "po3a"),
        span("lastmod", "po3b", ["code"]),
        span(
          " value rather than assuming the cache was behaving correctly. Two of my initial assumptions about where the stale response was coming from were wrong, so I traced the rendering path instead of trying another cache change.",
          "po3c",
        ),
      ]),
      block(
        "The fix was to make the sitemap render dynamically. I then published a real change through Sanity and checked the result without redeploying the site. The updated project reached the sitemap in 36 seconds, while the deployment build fingerprint remained unchanged. That gave me evidence that the publishing path, not a new deployment, was responsible for the update.",
        "po4",
      ),
      rich("po5", [
        span(
          "I also found a smaller correctness issue in the structured data. The ",
          "po5a",
        ),
        span("wordCount", "po5b", ["code"]),
        span(
          " was being estimated from rounded reading time, so a 229-word post was being reported as 400 words. I replaced that with a real word count and made the page and query use the same definition.",
          "po5c",
        ),
      ]),
      block(
        "Neither issue was visible in the UI. The sitemap still looked valid, and the incorrect word count didn't change what a reader saw. I found both by checking the parts of the system that aren't immediately visible.",
        "po6",
      ),
      block(
        "I measured the site with Lighthouse on a production build, taking the median of three runs after discarding a warm-up. A single run is not worth much here: one case study run came back at 87 when the other two were both 93.",
        "po7",
      ),
      block(
        "Performance came out at 88 on the home page, 92 on a journal post and 93 on a case study. Accessibility, best practices and SEO are 100 on all three, and cumulative layout shift is 0.000.",
        "po8",
      ),
      block(
        "The home page misses the 90 I wanted, and it is worth saying why rather than rounding it up. Its largest contentful paint is the hero paragraph rather than the avatar, and almost all of that time is render delay rather than network, so the text is waiting on fonts. The page loads 168 KB of them, and 118 KB of that is the display face on its own, because it carries the optical size and wonk axes the headings actually use. Stripping those axes measures at 91, but it gives me a flatter face and a font binary in the repository that nobody could regenerate from the source I installed. I decided the typography was worth more than the three points.",
        "po9",
      ),
    ],
  },
  {
    title: "Kandy Cycle",
    slug: "kandy-cycle",
    summary:
      "A peer-to-peer bicycle rental platform for cycling tourism in Kandy, Sri Lanka. Owners list their bikes, tourists book and pay, and curated routes are followed with live GPS tracking.",
    date: "2025-08-27",
    featured: true,
    role:
      "Final-year dissertation project, BSc (Hons) Computing, University of Gloucestershire. Sole developer: I designed the system, built the React and TypeScript front end, modelled the Postgres schema and its row-level security policies, wrote the Stripe checkout and webhook flow, and implemented the Leaflet map and GPS tracking module.",
    techTags: [
      "React 18",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
      "shadcn/ui",
      "React Leaflet",
      "Express",
      "GeoJSON",
    ],
    githubUrl: "https://github.com/shawmiyaMZ/kandy-cycle-journeys",
    problem: [
      block(
        "Cycling tourism is growing in Kandy, but there is no online way to rent a bicycle there. Tourists arrive and cannot find what is available, what it costs, or which roads are safe to ride. Local bike owners have no way to reach them at all. The bikes exist and the demand exists — nothing connects the two.",
        "kp1",
      ),
      block(
        "The wider problem is that much of Sri Lanka's tourism still runs on phone calls and manual booking. My dissertation asked whether a community-run platform could close that gap for one city, and what it would take to build one that people would trust with a payment.",
        "kp2",
      ),
    ],
    approach: [
      block("Three decisions shaped everything else.", "ka1"),
      strongLead(
        "Booking is a state machine, not a flag. ",
        "A rental moves pending → approved → paid → completed, and each transition has exactly one owner: the renter requests, the owner approves, Stripe confirms the payment, the handover completes it. Cancelling is only possible before payment. No screen ever has to guess what state a booking is in.",
        "ka2",
      ),
      strongLead(
        "The payment webhook is the source of truth. ",
        "Stripe Checkout handles the card, and an Express endpoint listens for Stripe's events and updates booking and payment status from those. I deliberately did not rely on the browser redirect after checkout. Someone closing the tab should not leave a paid booking looking unpaid.",
        "ka3",
      ),
      strongLead(
        "Authorisation lives in the database. ",
        "Supabase row-level security decides who can read and write what, so an owner can only edit their own listings and a renter only sees their own bookings. Those rules sit in Postgres rather than in React, so they hold no matter which screen calls them.",
        "ka4",
      ),
      block(
        "Then there is the part I cut. I specified dynamic route recommendation using Dijkstra and A*: a graph of Kandy's cycling network, junctions as nodes, roads as edges weighted by distance, elevation and scenic value, so a rider could ask for the fastest route or the prettiest one. I did not build it. With the deadline in view it came down to a half-working smart feature or a working simple one, and I shipped curated routes stored as GeoJSON and drawn with React Leaflet, with live GPS tracking over the top.",
        "ka5",
      ),
      block(
        "The graph design is written up in the dissertation. I would rather hand over something that works and say plainly what is missing.",
        "ka6",
      ),
    ],
    outcome: [
      block(
        "Ten functional test cases passed: registration, booking, payment, GPS recording, route following, route sharing, pickup verification, multi-step form validation, map rendering and real-time updates.",
        "ko1",
      ),
      block(
        "Measured: a 10.22-second build, a 1,045 kB bundle, 163 kB of CSS, and page loads of two to three seconds. GPS accuracy came in at ±5–10 metres against a ±5 metre target — recorded as missed rather than quietly rounded down.",
        "ko2",
      ),
      block(
        "The feature I am least sure about is pickup verification. It captures location, contact details and a timestamp when a bike changes hands, because that handover is where peer-to-peer rental actually breaks. It works, but it has never been tested by two strangers meeting on a street in Kandy, and that is the only test that counts.",
        "ko3",
      ),
    ],
  },
  {
    title: "Fit Pat",
    slug: "fit-pat",
    summary:
      "An Android fitness app that starts from your health condition rather than your workout. Pick high blood pressure, back pain, diabetes or obesity, and every exercise after that is filtered by the answer.",
    date: "2023-05-03",
    featured: true,
    role:
      "Individual coursework project for EEI4369, Mobile Application Development for Android, at the Open University of Sri Lanka. Sole developer: I designed the flow, built every screen in Java and Android XML, wired the motion sensor and location tracking, and stored accounts in SQLite.",
    techTags: [
      "Java",
      "Android Studio",
      "Android SDK",
      "SQLite",
      "Motion sensors",
      "Geolocation",
      "XML layouts",
    ],
    githubUrl: "https://github.com/shawmiyaMZ/Fit-Pat-MobileApp",
    problem: [
      block(
        "Fitness apps assume you are healthy. If you are managing high blood pressure, diabetes, back pain or obesity, the exercise you need is different from the exercise the app gives everyone, and none of the popular ones ask. The alternative is booking a doctor to be told which movements are safe, and then waiting.",
        "fp1",
      ),
      block(
        "That is the gap Fit Pat aims at. Not another workout tracker, but an answer to a narrower question: what can I safely do, given this condition?",
        "fp2",
      ),
    ],
    approach: [
      strongLead(
        "The condition comes first, not the workout. ",
        "The opening screen asks what you are managing, and everything downstream is filtered by that answer: condition, then activity type, then a planned set of exercises with repetitions, duration and a demonstration video.",
        "fa1",
      ),
      strongLead(
        "I mapped conditions to exercises explicitly. ",
        "Each condition is its own activity class (HighBloodPressure, BackPain, Diabetes), and each pairing of condition and activity is another, such as YogaDiabetes or StretchBackPain. That does not scale past a handful of conditions, and today I would hold the mapping as data rather than as classes. But it was explicit and easy to check, which mattered more than elegance for content where a wrong suggestion could hurt someone.",
        "fa2",
      ),
      strongLead(
        "Pictures instead of words. ",
        "I used illustrations and animation rather than text and buttons throughout, because the users I had in mind, older adults managing a condition, are not necessarily fluent with apps. That was the most deliberate design decision in the project.",
        "fa3",
      ),
      block(
        "Around that core flow sit a pedometer built on the device's motion sensor, a route tracker for walks and rides, and a BMI calculator, with accounts stored locally in SQLite.",
        "fa4",
      ),
    ],
    outcome: [
      block(
        "The app runs on device: sign-up and login with password reset, four conditions, activity dashboards, exercise plans with embedded video, step counting, route mapping and BMI.",
        "fo1",
      ),
      block(
        "I listed the weaknesses in my own proposal and they turned out to be the real ones: tracking errors, and a pedometer whose readings are not always accurate. A step counter built on raw motion-sensor events over-counts on rough ground and under-counts a slow walk, and I never solved that.",
        "fo2",
      ),
      block(
        "The honest limitation is larger than accuracy. The mapping from condition to exercise was mine, assembled from research rather than from a clinician. For an app whose entire premise is that the movements are safe for your condition, that is the part which would need professional sign-off before anyone should rely on it.",
        "fo3",
      ),
    ],
  },
];

const tag = (title: string, slug: string) => ({ title, slug });

export const seedPosts: Post[] = [
  {
    title: "What I learned from writing bad AI prompts",
    slug: "writing-bad-ai-prompts",
    excerpt:
      "The problem wasn't the model. It was how I was asking. For a long time, I assumed better models would produce better answers. Eventually I realized the model wasn't confused. My prompt was.",
    publishedAt: "2026-08-04T09:33:24.617Z",
    /* Matches what READING_TIME in queries.ts computes for this body —
       round(words / 200) + 1, counting prose only. Seed and CMS must agree
       or every reading time shifts the day the content is migrated. */
    readingTime: 2,
    tags: [tag("Prompting", "prompting")],
    body: [
      block(
        "For a long time, I assumed better models would produce better answers. Whenever an AI gave me something vague, repetitive, or completely off-topic, I blamed the model.",
        "w1",
      ),
      block("Eventually I realized the model wasn't confused.", "w3"),
      block("My prompt was.", "w5"),
      block(
        "A prompt isn't just a question. It's the specification for the task. If the instructions are unclear, incomplete, or contradictory, the output will reflect that.",
        "w7",
      ),
      block(
        "The biggest mistake I made was asking for the destination without explaining the journey.",
        "w9",
      ),
      block(
        "Instead of giving context, constraints, examples, and a clear goal, I would write something like:",
        "w11",
      ),
      quote("Build me a portfolio.", "w13"),
      block("The AI had to guess everything.", "w15"),
      block(
        "Once I started writing prompts like a software specification, explaining the audience, design goals, limitations, expected behavior, and success criteria, the quality changed dramatically.",
        "w17",
      ),
      block(
        "Another lesson was that longer doesn't always mean better. I often wrote prompts packed with unnecessary details while forgetting the one thing that mattered most: what problem I was actually trying to solve.",
        "w19",
      ),
      block("Good prompts reduce ambiguity.", "w21"),
      block("Bad prompts create it.", "w23"),
      block(
        "Working with AI has taught me that prompt engineering isn't about finding magical words. It's about communicating clearly enough that another system, or another person, can understand exactly what success looks like.",
        "w25",
      ),
      block(
        "The surprising part is that this lesson applies beyond AI. Better prompts have made me better at writing requirements, documenting ideas, and even explaining problems to other developers.",
        "w27",
      ),
      block("The model wasn't the bottleneck. My communication was.", "w29"),
    ],
  },
  {
    title: "It sounded right, so I stopped checking",
    slug: "it-sounded-right-so-i-stopped-checking",
    excerpt:
      "I built this site over four days with Claude. The work was good and it explained itself well, so I stopped checking it against my original brief. When I finally asked whether Claude had read that brief, the answer was no, and an hour earlier it had deleted content the brief required.",
    publishedAt: "2026-08-04T09:06:27.036Z",
    readingTime: 4,
    tags: [tag("Tooling", "tooling")],
    body: [
      block(
        "I built this site over four days, in conversation with Claude. I described what I wanted, Claude wrote the code, I reacted to it, and we went round again. It worked. The site got good.",
        "k1",
      ),
      block(
        "Then something felt off. I couldn't say what. Nothing was broken, nothing looked wrong. So I asked a question I hadn't thought to ask before: had it actually read my project brief?",
        "k3",
      ),
      rich(
        "k5",
        [
          span(
            "It hadn't. Not that day, and not for a while. It had been working from its own notes ",
            "k5a",
          ),
          span("about", "k5b", ["em"]),
          span(
            " my brief (a summary, mostly accurate) and it had been building against the summary.",
            "k5c",
          ),
        ],
      ),
      h2("What I couldn't put my finger on", "k9"),
      rich(
        "k11",
        [
          span(
            "The advice I was getting was good advice. That's what made this hard to see. It just wasn't always advice about ",
            "k11a",
          ),
          span("my", "k11b", ["em"]),
          span(
            " project. It was advice about a project like mine, and that's a difference you can only catch if you're holding the original document.",
            "k11c",
          ),
        ],
      ),
      block("I wasn't holding it. It was in a chat window from day one.", "k15"),
      h2("What had already gone wrong", "k17"),
      block(
        "An hour before I asked the question, I'd had three sample journal posts deleted. I wanted to start my journal from scratch with my own writing, which felt reasonable.",
        "k19",
      ),
      block(
        "My brief required exactly those three posts as a deliverable. Neither of us knew. I asked for the deletion, Claude carried it out efficiently, and the requirement it broke was sitting in a document nobody in the room had open.",
        "k21",
      ),
      block(
        "Being right about my hunch felt good for about four seconds. Then it stopped, because if this had slipped past me in an hour, I had no idea what else had slipped past me over four days.",
        "k23",
      ),
      h2("Why I didn't notice", "k25"),
      block(
        "Everything I was handed explained itself. It cited the files it had changed, gave reasons for its decisions, admitted trade-offs, and flagged its own uncertainty. It read like competence.",
        "k27",
      ),
      block("And I treated reading like competence as being correct.", "k29"),
      block(
        "That's the actual mistake, and it isn't really about AI. Good work and work that matches your requirements are two different things, and only one of them can be judged by reading it. The other one means going and opening the document.",
        "k31",
      ),
      block(
        "Four days isn't long enough to get complacent. I managed it anyway.",
        "k33",
      ),
      callout(
        "k35",
        "insight",
        "Fluency is not accuracy. A confident, well-reasoned explanation is evidence that something can explain itself. It is not evidence that it's building what you asked for.",
      ),
      h2("What I changed", "k36"),
      rich(
        "k38",
        [
          span("The brief is a file in the repository now. ", "k38a"),
          span("docs/brief.md", "k38b", ["code"]),
          span(
            ", committed. Any session, any tool, any future me can open the real requirements instead of a memory of them.",
            "k38c",
          ),
        ],
      ),
      block(
        "I ran a clause-by-clause audit. Every requirement marked done, partial, or missing. It found three things I'd have shipped without noticing, including a page-transition feature whose CSS was written but never actually switched on.",
        "k39",
      ),
      block(
        "I re-anchor at the start of each session. Every new conversation begins with a summary of the last one, and summaries drop things quietly.",
        "k40",
      ),
      h2("What I'd tell someone starting out", "k50"),
      block(
        "I'm early in this. I don't have a general theory about working with AI, and I'd be suspicious of anyone claiming one this year.",
        "k52",
      ),
      block(
        "But I have one specific thing. The risk isn't bad code. Most of what I got was better than what I'd have written alone. The risk is quieter: work that's good in general and wrong for you in particular, delivered in a tone that gives you no reason to look closer.",
        "k54",
      ),
      block(
        "So keep the thing you're being measured against somewhere it can be checked, and check against it on a schedule rather than when you happen to feel uneasy.",
        "k56",
      ),
      block("I got lucky. My unease arrived before my deadline did.", "k58"),
    ],
  },
];

export const seedProjectSummaries: ProjectSummary[] = seedProjects.map(
  ({ title, slug, summary, techTags, featured, date }) => ({
    title,
    slug,
    summary,
    techTags,
    featured,
    date,
  }),
);

export const seedPostSummaries: PostSummary[] = seedPosts.map((post) => {
  // Summaries deliberately exclude the body — the index must never carry
  // full post content, which is the whole point of computing reading time
  // in GROQ rather than in the component.
  const { body: _body, ...summary } = post;
  void _body;
  return summary;
});

export const seedTags = [
  tag("CMS", "cms"),
  tag("Engineering", "engineering"),
  tag("Mobile", "mobile"),
  tag("Prompting", "prompting"),
  tag("Tooling", "tooling"),
  tag("Web", "web"),
];

/** Kept for callers that want the raw body type without importing it. */
export type SeedBody = PortableText;
import type { PortableTextBlock } from "@portabletext/react";
import type {
  BodyObject,
  Post,
  PostSummary,
  PortableText,
  Profile,
  ProjectSummary,
  Project,
} from "./types";

/**
 * Seed content.
 *
 * Two jobs. It is the copy that gets pushed into Sanity so the site looks
 * alive on day one, and it is what the site renders before Sanity is
 * configured — so every layout can be designed and audited against real
 * text rather than placeholder boxes.
 *
 * Deliberately includes the shapes that break layouts: a long project title,
 * a dense tag row, a long skill name, a two-line post title.  A grid that
 * only survives short strings is not a finished grid.
 *
 * Bodies are written at the depth the finished portfolio should carry, and in
 * the shapes Sanity actually returns, so migration is transcription rather
 * than a rewrite.  Between them the three posts exercise every renderer in
 * `Prose` — headings, both list kinds, quote, inline code, links, fenced code
 * and all three callout tones — because a renderer that has never rendered is
 * a renderer nobody has designed.
 */

/* ---------- portable-text builders ----------
   These mirror exactly what the Studio emits.  Keys are hand-written and must
   stay unique within their own array; Sanity generates them, but seed content
   has to supply its own. */

type Span = { _type: "span"; _key: string; text: string; marks: string[] };

const span = (text: string, key: string, marks: string[] = []): Span => ({
  _type: "span",
  _key: key,
  text,
  marks,
});

/** A block built from pre-made spans, for mixed formatting within a paragraph. */
const rich = (
  key: string,
  children: Span[],
  markDefs: Array<Record<string, unknown>> = [],
  style: string = "normal",
): PortableTextBlock =>
  ({
    _type: "block",
    _key: key,
    style,
    markDefs,
    children,
  }) as PortableTextBlock;

/** The common case: one unformatted run of text. */
const block = (text: string, key: string, style = "normal") =>
  rich(key, [span(text, `${key}s`)], [], style);

const h2 = (text: string, key: string) => block(text, key, "h2");
const h3 = (text: string, key: string) => block(text, key, "h3");
const quote = (text: string, key: string) => block(text, key, "blockquote");

/** List items are ordinary blocks carrying `listItem` and `level`. */
const li = (
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

const bullets = (items: string[], keyBase: string) =>
  items.map((t, i) => li(t, `${keyBase}${i}`, "bullet"));

const numbers = (items: string[], keyBase: string) =>
  items.map((t, i) => li(t, `${keyBase}${i}`, "number"));

const code = (
  key: string,
  language: string,
  source: string,
  filename?: string,
) => ({ _type: "codeBlock", _key: key, language, filename, code: source });

const callout = (
  key: string,
  tone: "note" | "insight" | "warning",
  body: string,
) => ({ _type: "callout", _key: key, tone, body });

const image = (
  key: string,
  alt: string,
  caption?: string,
): BodyObject =>
  ({
    _type: "image",
    _key: key,
    // A placeholder asset; swapped for a real upload when the seed is migrated.
    asset: { _type: "reference", _ref: "image-seed-placeholder-1600x900-png" },
    alt,
    ...(caption ? { caption } : {}),
  }) as BodyObject;

/** A paragraph ending in a link — the shape most body copy actually needs. */
const withLink = (
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
  headline: "Software Engineering Intern",
  thesis:
    "I'm learning to build software where AI does real work, not demo work. The projects here are what I've built; the journal is what it took to get there.",
  linkedinUrl: "https://www.linkedin.com/in/shawmiya-zarook",
  bio: [
    block(
      "I graduated in Computing and I'm now an engineering intern, spending most of my time on systems that use language models for something load-bearing rather than decorative.",
      "b1",
    ),
    block(
      "Most of what I know came from things that did not work the first time — retrieval that returned confident nonsense, evaluations that measured the wrong thing, prompts that worked until they met a real user. I write those down as I go, partly to think clearly and partly because the write-ups I learned from were the ones that admitted what broke.",
      "b2",
    ),
  ],
  education: [
    {
      qualification: "BSc (Hons) Computing",
      institution: "University of Bedfordshire",
      period: "2022 — 2025",
    },
  ],
  skillGroups: [
    {
      category: "Languages",
      skills: [
        { name: "TypeScript", level: "daily" },
        { name: "Python", level: "daily" },
        { name: "SQL", level: "comfortable" },
        { name: "Go", level: "learning" },
      ],
    },
    {
      category: "AI engineering",
      skills: [
        { name: "Retrieval-augmented generation", level: "daily" },
        { name: "Evaluation harnesses", level: "comfortable" },
        { name: "Prompt design", level: "daily" },
        { name: "Fine-tuning", level: "learning" },
      ],
    },
    {
      category: "Platform",
      skills: [
        { name: "Next.js", level: "daily" },
        { name: "PostgreSQL", level: "comfortable" },
        { name: "Docker", level: "comfortable" },
        { name: "Kubernetes", level: "learning" },
      ],
    },
  ],
  milestones: [
    {
      year: "2026",
      event: "Software Engineering Intern",
      detail:
        "Working on retrieval and evaluation for an internal assistant used by support staff.",
    },
    {
      year: "2025",
      event: "Graduated BSc Computing",
      detail:
        "Final project was a retrieval system that had to say “I don't know” convincingly.",
    },
    {
      year: "2024",
      event: "First production RAG system",
      detail:
        "Shipped to forty people. Learned more from the questions it answered badly than the ones it got right.",
    },
    {
      year: "2023",
      event: "Started writing things down",
      detail: "The journal began as notes I kept losing.",
    },
  ],
};

export const seedProjects: Project[] = [
  {
    title: "Ledger — a retrieval assistant that knows when to stop",
    slug: "ledger",
    summary:
      "An internal assistant over four years of support tickets. The hard part was not retrieval; it was teaching it to refuse.",
    date: "2026-04-12",
    featured: true,
    role: "Sole engineer — retrieval, evaluation, and the interface",
    techTags: [
      "TypeScript",
      "Python",
      "PostgreSQL",
      "pgvector",
      "Next.js",
      "OpenAI",
    ],
    githubUrl: "https://github.com/example/ledger",
    liveUrl: "https://example.com",
    problem: [
      block(
        "Support staff were answering the same forty questions every week, and the answers were buried in four years of tickets written by people who had all since left.",
        "lp1",
      ),
      block(
        "The obvious fix — search over the ticket archive — already existed and nobody used it. Keyword search returned thirty threads and no indication which one was still true. A resolution from 2022 and a resolution from last month look identical to a search index, and picking wrong meant giving a customer advice about a system that had been replaced twice since.",
        "lp2",
      ),
      block(
        "So the requirement was not really retrieval. It was confidence: an answer staff could act on without opening four tickets to check it, or a clear admission that no such answer existed.",
        "lp3",
      ),
    ],
    approach: [
      block(
        "Three decisions did most of the work, and only one of them was about the model.",
        "la1",
      ),
      h3("Chunk by thread, not by token count", "la2"),
      block(
        "The first version split tickets into 512-token windows, which routinely cut a resolution away from the problem it resolved. Chunking by conversation thread instead meant a chunk was always a complete unit of meaning — sometimes eighty tokens, sometimes four thousand — and retrieval quality moved more from that one change than from any amount of embedding tuning afterwards.",
        "la3",
      ),
      h3("Rerank, then truncate", "la4"),
      block(
        "Vector search returns the top fifty by cosine similarity, and a cross-encoder reranks those into a final six. Bi-encoders are fast and approximate; cross-encoders are slow and accurate. Running the slow one over fifty candidates rather than the whole corpus buys most of the accuracy for a fraction of the cost.",
        "la5",
      ),
      h3("Score refusal as an outcome", "la6"),
      block(
        "The evaluation set contains cases with no supportable answer, and on those the only correct behaviour is abstention. Because refusal is graded as a success rather than a missing answer, every prompt change gets measured on whether it made the system more willing to guess.",
        "la7"),
      code(
        "la8",
        "python",
        `def grade(case, response):
    """A refusal on an unanswerable case is a pass, not a miss."""
    if case.unanswerable:
        return Result.PASS if response.abstained else Result.OVERCONFIDENT

    if response.abstained:
        return Result.OVERCAUTIOUS

    return Result.PASS if case.matches(response.text) else Result.WRONG`,
        "eval/grading.py",
      ),
      callout(
        "la9",
        "insight",
        "Grading abstention changed the system's behaviour more than any prompt I wrote. Once refusing was worth points, every later change had to justify itself against the option of saying nothing.",
      ),
    ],
    outcome: [
      block(
        "Median answer time fell from eleven minutes to under one. That is the number that got the project approved, and it is the least interesting one.",
        "lo1",
      ),
      block(
        "The number people actually cared about was the refusal rate holding at 12%. High enough that staff believed it when it did answer — the first version refused nothing, was wrong about one time in six, and was abandoned within a fortnight because nobody could tell which sixth.",
        "lo2",
      ),
      bullets(
        [
          "Median time to answer: 11 minutes → 52 seconds",
          "Refusal rate: 12%, stable across three months",
          "Answers rated actionable by staff: 87%",
          "Tickets escalated for lack of context: down by roughly half",
        ],
        "lo3_",
      ).flat(),
      quote(
        "The version that admitted ignorance got used. The version that always had an answer got switched off.",
        "lo4",
      ),
    ].flat(),
  },
  {
    title: "Marginalia",
    slug: "marginalia",
    summary:
      "A reading tool that keeps your notes attached to the paragraph that provoked them.",
    date: "2025-11-03",
    featured: true,
    role: "Design and build",
    techTags: ["TypeScript", "IndexedDB", "Svelte"],
    githubUrl: "https://github.com/example/marginalia",
    problem: [
      block(
        "Highlights are worthless a month later because they lose the argument they were reacting to. You are left with a sentence you once thought was important and no memory of why.",
        "mp1",
      ),
      block(
        "Every tool I tried stored the note against a character offset. Offsets survive nothing — not an edit, not a re-flow, not a different reader width. Reopen the document a month later and the notes have all slid one paragraph to the left.",
        "mp2",
      ),
    ],
    approach: [
      block(
        "Each note anchors to a text range described three ways at once, so the anchor degrades instead of breaking.",
        "ma1",
      ),
      h3("Three selectors, tried in order", "ma2"),
      numbers(
        [
          "An exact quote of the selected text — fastest, and correct while the document is unchanged.",
          "A prefix and suffix of surrounding context, so a moved passage is still findable.",
          "An approximate character offset, used only to disambiguate when the quote appears more than once.",
        ],
        "ma3_",
      ).flat(),
      withLink(
        "ma4",
        "The strategy is a simplification of the ",
        "W3C Web Annotation selector model",
        "https://www.w3.org/TR/annotation-model/",
        ", cut down to what one reader actually needs.",
      ),
      code(
        "ma5",
        "typescript",
        `// Selectors are tried cheapest-first and the first confident hit wins.
// Nothing here is clever; the value is entirely in the ordering.
export function resolve(anchor: Anchor, doc: string): Range | null {
  return (
    exact(anchor.quote, doc) ??
    context(anchor.prefix, anchor.suffix, doc) ??
    nearest(anchor.offset, anchor.quote, doc)
  );
}`,
        "src/anchor/resolve.ts",
      ),
      h3("Where the threshold lives", "ma6"),
      block(
        "The third selector is the dangerous one. A nearest-match will always return something, so it needs a similarity floor beneath which it returns nothing at all — and that floor is the entire difference between a tool that quietly misfiles your thinking and one you can trust.",
        "ma7",
      ),
      callout(
        "ma8",
        "warning",
        "Fuzzy matching will happily re-anchor a note to a passage that merely resembles the original. The confidence threshold matters more than the matching algorithm, and mine took three attempts to get right.",
      ),
    ].flat(),
    outcome: [
      block(
        "I use it daily, which is the only endorsement I trust from myself.",
        "mo1",
      ),
      block(
        "The re-anchoring is right about 94% of the time. The remaining 6% is why I still keep a plain-text backup, and why notes that fail to re-anchor are surfaced in a review queue rather than silently dropped.",
        "mo2",
      ),
      bullets(
        [
          "Re-anchor accuracy: 94% across roughly 600 notes",
          "Failures surfaced for review rather than dropped: 100%",
          "Notes lost outright since the review queue landed: none",
        ],
        "mo3_",
      ).flat(),
      quote(
        "A lost note the reader never hears about is worse than one they are asked to re-file.",
        "mo4",
      ),
    ].flat(),
  },
  {
    title: "Kiln",
    slug: "kiln",
    summary:
      "A small evaluation harness for prompt changes, built because spreadsheets stopped scaling.",
    date: "2025-06-20",
    featured: true,
    role: "Sole engineer",
    techTags: ["Python", "SQLite", "Pytest"],
    githubUrl: "https://github.com/example/kiln",
    problem: [
      block(
        "Every prompt change felt like an improvement and I had no way to prove any of them were.",
        "kp1",
      ),
      block(
        "The honest version: I was reading four or five outputs after each change, deciding it looked better, and moving on. That is not evaluation, it is confirmation. Two regressions reached production before I accepted that the spreadsheet I had been maintaining was a record of my own optimism.",
        "kp2",
      ),
    ],
    approach: [
      block(
        "A fixed set of cases with graded rubrics, run on every change, diffed against the previous run. The design constraint was that it had to run in under a minute — anything slower gets skipped exactly when it matters most, which is when you are in a hurry.",
        "ka1",
      ),
      h3("The diff is the product", "ka2"),
      block(
        "An absolute score is not actionable. Knowing the suite sits at 88% tells you nothing you can act on; knowing that three specific cases passed yesterday and fail today tells you whether to ship.",
        "ka3",
      ),
      code(
        "ka4",
        "bash",
        `$ kiln run --against HEAD~1

  42 cases · 38 pass · 3 regress · 1 new

  REGRESSED  refusal/no-source-available
             was: abstained          now: answered with citation to unrelated doc
  REGRESSED  format/json-only
             was: valid JSON         now: valid JSON wrapped in prose
  REGRESSED  tone/no-apology
             was: direct             now: opens with "I apologise, but"`,
      ),
      h3("Why it is only four hundred lines", "ka5"),
      block(
        "Everything that could be someone else's problem is. Cases are plain files on disk, results go into SQLite, and the runner is a loop. There is no scheduler, no dashboard and no service to keep alive — three things I would have had to maintain, none of which would have caught a single regression.",
        "ka6",
      ),
      bullets(
        [
          "Cases: one directory of plain files, versioned with the prompts they test",
          "Storage: a single SQLite file, so a run is diffable and portable",
          "Execution: sequential, because forty-two cases do not need concurrency",
        ],
        "ka7_",
      ).flat(),
      callout(
        "ka8",
        "note",
        "The diff against the previous run is the whole product. An absolute score tells you nothing actionable; a list of what just broke tells you whether to ship.",
      ),
    ].flat(),
    outcome: [
      block(
        "Caught three regressions that would have shipped. Also killed two changes I was emotionally attached to, which was the more useful outcome and the less pleasant one.",
        "ko1",
      ),
      block(
        "It now runs on every commit that touches a prompt file. Total runtime is around forty seconds, which is the only reason it still gets run at all.",
        "ko2",
      ),
      bullets(
        [
          "Runtime: ~40 seconds for 42 cases",
          "Regressions caught before release: 3",
          "Changes reverted on the evidence: 2",
          "Total implementation: under 400 lines",
        ],
        "ko3_",
      ).flat(),
      quote(
        "It was smaller than the spreadsheet it replaced, and I put it off for months imagining something much larger.",
        "ko4",
      ),
    ].flat(),
  },
];

const tag = (title: string, slug: string) => ({ title, slug });

export const seedPosts: Post[] = [
  {
    title: "Refusal is a feature, not a failure state",
    slug: "refusal-is-a-feature",
    excerpt:
      "An assistant that answers everything is easy to build and impossible to trust. Scoring abstention as a real outcome changed how the whole system behaved.",
    publishedAt: "2026-05-18T09:00:00Z",
    /* Matches what READING_TIME in queries.ts computes for this body —
       round(words / 200) + 1, counting prose only. Seed and CMS must agree
       or every reading time shifts the day the content is migrated. */
    readingTime: 4,
    tags: [tag("Retrieval", "retrieval"), tag("Evaluation", "evaluation")],
    body: [
      block(
        "The first version answered every question it was asked. That sounds like success until you read the answers.",
        "r1",
      ),
      block(
        "Roughly one in six was wrong — not obviously, catastrophically wrong, but wrong in the way that costs an afternoon. A confident paragraph citing a real ticket that happened to describe a system replaced eighteen months earlier. Staff had no way to tell those apart from the five that were right, so within a fortnight they stopped using it entirely. A tool that is right 83% of the time and never signals which 83% is worth less than no tool at all, because now you have to check.",
        "r2",
      ),
      h2("Where the confidence came from", "r3"),
      rich(
        "r4",
        [
          span(
            "Nothing in the system was measuring whether an answer should exist. Retrieval always returned its top six chunks, because that is what a ",
            "r4a",
          ),
          span("top-k", "r4b", ["code"]),
          span(
            " search does — ask it for six and it will find six, even when the corpus contains nothing relevant. The model then did exactly what it was asked and wrote a fluent answer from whatever it was handed.",
            "r4c",
          ),
        ],
      ),
      quote(
        "Top-k retrieval has no concept of “nothing here”. It has a concept of “these were the least bad six”.",
        "r5",
      ),
      block(
        "So the failure was not hallucination in the usual sense. Every citation was real. The system was faithfully summarising genuinely retrieved documents that simply did not answer the question.",
        "r6",
      ),
      h2("Making abstention scoreable", "r7"),
      block(
        "The change that mattered was not a prompt. It was adding cases to the evaluation set that have no supportable answer, and grading a refusal on those as a pass.",
        "r8",
      ),
      code(
        "r9",
        "python",
        `# Four outcomes, not two. The two middle ones are where the
# interesting failures live.

class Result(Enum):
    PASS          = auto()  # answered correctly, or refused correctly
    WRONG         = auto()  # answered, but the answer was incorrect
    OVERCONFIDENT = auto()  # answered a question with no supportable answer
    OVERCAUTIOUS  = auto()  # refused a question that was answerable`,
        "eval/results.py",
      ),
      block(
        "Two failure modes rather than one is the entire point. Before, any refusal counted as a miss, so every change that reduced refusals looked like an improvement — including the ones that were simply making the system guess more. Splitting the failures apart made that trade visible.",
        "r10",
      ),
      h3("What the grader needs from retrieval", "r11"),
      block(
        "Abstention has to be decidable before generation, or the model is being asked to judge its own homework. In practice that meant the reranker's top score became a gate: below a threshold, the question never reaches the model at all.",
        "r12",
      ),
      bullets(
        [
          "Score above the threshold — answer, with citations.",
          "Score below it — refuse, and name what was searched.",
          "Score near it — answer, but say explicitly that the match is weak.",
        ],
        "r13_",
      ).flat(),
      block(
        "That third state did more for trust than the other two combined. A hedged answer with its uncertainty stated is useful; the same answer stated flatly is a trap.",
        "r14",
      ),
      callout(
        "r15",
        "insight",
        "Tuning the threshold is a product decision wearing an engineering costume. There is no correct value — only a position on the trade between refusing too often and guessing too often, and someone has to own where it sits.",
      ),
      h2("What it cost", "r16"),
      block(
        "Refusal rate settled at 12%, which means roughly one question in eight now returns nothing. That is a real cost and it was not free to defend: “it says I don't know too much” was the most common early complaint, and the honest answer was that the previous version had been saying it never, while being wrong one time in six.",
        "r17",
      ),
      withLink(
        "r18",
        "The evaluation harness that made any of this measurable is ",
        "Kiln",
        "/work/kiln",
        ", which came out of exactly this problem.",
      ),
      block(
        "If I were starting again I would write the unanswerable cases first, before any retrieval code existed. They are the cheapest test to write and the only one that catches the failure that actually kills adoption.",
        "r19",
      ),
      callout(
        "r20",
        "note",
        "The 12% refusal figure is from the last run I kept, not a promise. Finishing the write-up is overdue.",
      ),
    ].flat(),
  },
  {
    title: "What I got wrong about chunking",
    slug: "what-i-got-wrong-about-chunking",
    excerpt:
      "I spent two weeks tuning chunk size and overlap. The win came from changing what a chunk was, not how big it was.",
    publishedAt: "2026-03-02T09:00:00Z",
    readingTime: 2,
    tags: [tag("Retrieval", "retrieval")],
    body: [
      block("Token counts are a proxy for meaning, and a bad one.", "c1"),
      block(
        "I lost two weeks to a grid search over chunk size and overlap. Sizes from 256 to 1024, overlaps from zero to half. Forty-odd configurations, each scored against the same evaluation set. The best configuration beat the worst by about four points, and every one of them was mediocre.",
        "c2",
      ),
      h2("The grid search was measuring the wrong axis", "c3"),
      block(
        "A fixed-size window cuts wherever the counter runs out, which in a support archive means cutting between the problem and its resolution about as often as not. No window size fixes that, because the correct boundary is not at a fixed distance — it is wherever the thread ends.",
        "c4",
      ),
      block(
        "Once chunks followed conversation threads instead, the size distribution became wildly uneven: some eighty tokens, some four thousand. That felt wrong. It scored eleven points better than the best fixed-size configuration.",
        "c5",
      ),
      callout(
        "c6",
        "insight",
        "If a parameter sweep produces a narrow band of mediocre results, the problem is usually not inside the range. It is that you are sweeping the wrong parameter.",
      ),
      h2("What replaced it", "c7"),
      code(
        "c8",
        "typescript",
        `// Before: cut every N tokens, hope the seam falls somewhere harmless.
const chunks = splitByTokens(document, { size: 512, overlap: 64 });

// After: cut where the document itself says a unit ends.
const chunks = document.threads.map((thread) => ({
  text: thread.messages.map(renderMessage).join("\\n\\n"),
  // Retrieval matches on the text; the metadata is what makes the
  // result trustworthy once it comes back.
  meta: {
    resolvedAt: thread.resolvedAt,
    supersededBy: thread.supersededBy,
    product: thread.product,
  },
}));`,
        "src/ingest/chunk.ts",
      ),
      block(
        "The metadata turned out to matter as much as the boundary. Knowing a thread was superseded lets retrieval demote it before the model ever sees it, which removed a whole category of confidently-outdated answers that no amount of prompting had fixed.",
        "c9",
      ),
      image(
        "c9a",
        "A support thread split at its natural boundaries: each chunk spans one conversation.",
        "Thread chunking keeps a resolution attached to the problem it resolves.",
      ),
      h2("What I would keep from the two weeks", "c10"),
      bullets(
        [
          "The evaluation set. It was the only reason I could tell the new approach was better rather than merely different.",
          "The harness that ran it. Forty configurations by hand would have taken a month and I would have stopped at six.",
        ],
        "c11_",
      ).flat(),
      block(
        "And what I would drop: the assumption that because a parameter is exposed, it is the parameter that matters. Chunk size is tunable, visible and discussed everywhere, which makes it feel like the lever. It is simply the easiest thing to change.",
        "c12",
      ),
    ].flat(),
  },
  {
    title: "Evaluations you will actually run",
    slug: "evaluations-you-will-actually-run",
    excerpt:
      "The best harness is the one that runs on every change without being asked. Mine took an afternoon and has paid for itself many times over.",
    publishedAt: "2026-01-14T09:00:00Z",
    readingTime: 3,
    tags: [tag("Evaluation", "evaluation"), tag("Tooling", "tooling")],
    body: [
      block("A test you run manually is a test you do not run.", "e1"),
      block(
        "I know this about unit tests and had somehow decided prompts were different. They are not. The evaluation I ran when I remembered caught nothing, because I remembered on calm afternoons and never on the Friday when I was changing something quickly.",
        "e2",
      ),
      h2("Three properties, in order of importance", "e3"),
      numbers(
        [
          "It runs without being asked. On commit, in CI, anywhere that is not my memory.",
          "It finishes fast enough that nobody is tempted to skip it. Under a minute in practice.",
          "It reports what changed, not what is true. An absolute score is not actionable; a diff is.",
        ],
        "e4_",
      ).flat(),
      block(
        "Everything else — rubric design, grader choice, how many cases — matters far less than these three, and I spent most of my early effort on those instead.",
        "e5",
      ),
      h3("On case count", "e6"),
      block(
        "Forty-two cases sounds thin and has been sufficient. The cases were collected as failures happened rather than written up front, which is why they are unevenly distributed and why they keep catching things. A tidy, balanced set of two hundred synthetic cases would look more rigorous and find less.",
        "e7",
      ),
      quote(
        "Every case in the set exists because something broke once. That is the only curation rule I have and I have not needed another.",
        "e8",
      ),
      h2("The part I got wrong twice", "e9"),
      block(
        "Grading with a model is convenient and quietly circular. My first grader used the same model family as the system under test, and agreed with it far more than a human did — most visibly on tone, where both had the same taste.",
        "e10",
      ),
      callout(
        "e11",
        "warning",
        "If the grader and the system share a model family, measure the grader against human judgement before trusting a single number it produces. Mine agreed with me 71% of the time, which is not a grader, it is a second opinion.",
      ),
      block(
        "The fix was not a better grader. It was moving anything mechanically checkable — valid JSON, citation present, no apology opener, abstention on unanswerable cases — into deterministic assertions, and leaving the model to judge only what genuinely needs judgement. Roughly two-thirds of the set turned out to be mechanically checkable.",
        "e12",
      ),
      code(
        "e13",
        "python",
        `# Deterministic where possible, model-graded only where necessary.
CHECKS = [
    assert_valid_json,
    assert_cites_source,
    assert_no_apology_opener,
    assert_abstains_when_unsupported,
]

def grade(case, response):
    for check in CHECKS:
        if not check(case, response):
            return Result.WRONG
    # Only the genuinely subjective part reaches the model.
    return judge(case.rubric, response)`,
        "eval/grade.py",
      ),
      withLink(
        "e14",
        "The harness itself is ",
        "Kiln",
        "/work/kiln",
        " — an afternoon's work, a SQLite file, and no dependencies worth naming.",
      ),
      block(
        "The whole thing is under four hundred lines. I mention that because I put it off for months imagining something much larger, and the version that finally got built was smaller than the spreadsheet it replaced.",
        "e15",
      ),
    ].flat(),
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
  tag("Retrieval", "retrieval"),
  tag("Evaluation", "evaluation"),
  tag("Tooling", "tooling"),
];

/** Kept for callers that want the raw body type without importing it. */
export type SeedBody = PortableText;

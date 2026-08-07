import { groq } from "next-sanity";

/**
 * Cache tags. The publish webhook maps a document `_type` onto one of these,
 * so publishing a post never invalidates the projects page.
 */
export const TAGS = {
  profile: "profile",
  project: "project",
  post: "post",
  tag: "tag",
} as const;

/**
 * Reading time, computed in the query rather than the component.
 *
 * `pt::text` flattens portable text to a plain string, joining block
 * boundaries with newlines; normalising those to spaces (then dropping the
 * empty cells a split leaves behind) gives the same whitespace-token count as
 * `countWords` in the page. Dividing by 200wpm yields the reading time.
 * Doing it here means the journal index gets reading times without ever
 * transferring the full body of every post — which is the difference between
 * a small payload and shipping the entire journal to render a list.
 */
const READING_TIME = groq`
  "readingTime": round(
    length(
      string::split(
        array::join(string::split(pt::text(body), "\n"), " "),
        " "
      )[@ != ""]
    ) / 200
  ) + 1
`;

const POST_SUMMARY = groq`
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "tags": tags[]->{ title, "slug": slug.current },
  ${READING_TIME}
`;

const PROJECT_SUMMARY = groq`
  title,
  "slug": slug.current,
  summary,
  coverImage,
  "tags": tags[]->{ title, "slug": slug.current },
  techTags,
  featured,
  date
`;

export const profileQuery = groq`
  *[_type == "profile"][0]{
    name, headline, thesis, bio, avatar, linkedinUrl,
    education, skillGroups, milestones
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(date desc)[0...3]{
    ${PROJECT_SUMMARY}
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(date desc){
    ${PROJECT_SUMMARY}
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    ${PROJECT_SUMMARY},
    gallery, role, problem, approach, outcome, githubUrl, liveUrl
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`;

export const latestPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[0...3]{
    ${POST_SUMMARY}
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    ${POST_SUMMARY}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${POST_SUMMARY},
    body
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

/**
 * Previous and next by publish date.
 *
 * "Previous" is the older neighbour, which is the one a reader reaching the
 * end of a post is most likely to want next.
 */
export const postNavigationQuery = groq`{
  "previous": *[_type == "post" && publishedAt < $publishedAt]
    | order(publishedAt desc)[0]{ title, "slug": slug.current },
  "next": *[_type == "post" && publishedAt > $publishedAt]
    | order(publishedAt asc)[0]{ title, "slug": slug.current }
}`;

/**
 * Tags that at least one *post* uses.
 *
 * Scoped by usage rather than listing every tag document, so the journal
 * filter can never offer a tag that returns nothing. Now that projects share
 * the same `tag` vocabulary this scoping is what keeps the two filters
 * separate: a tag used only by a project never reaches the journal.
 *
 * The Work grid needs no equivalent query — `PROJECT_SUMMARY` already carries
 * each project's tags, so its chips are derived from the projects on screen
 * and are usage-scoped by construction.
 */
export const postTagsQuery = groq`
  *[_type == "tag" && count(*[_type == "post" && references(^._id)]) > 0]
    | order(title asc){ title, "slug": slug.current }
`;

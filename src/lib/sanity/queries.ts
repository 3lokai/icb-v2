/**
 * GROQ queries for articles
 */

export const ARTICLE_PROJECTION = `
  _id,
  _type,
  title,
  description,
  "slug": slug.current,
  date,
  updatedAt,
  updated,
  category->{
    _id,
    name,
    "slug": slug.current,
    description,
    kind,
    color
  },
  topics[]->{
    _id,
    name,
    "slug": slug.current,
    description,
    kind,
    color
  },
  tags,
  author{
    name,
    bio
  },
  authorRef->{
    _id,
    name,
    bio,
    "slug": slug.current,
    avatar
  },
  featured,
  draft,
  difficulty,
  cover{
    asset->{
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    hotspot,
    crop
  },
  excerpt,
  body[],
  hasFAQ,
  faqItems[]{
    question,
    answer
  },
  hasSteps,
  contentType,
  brewingMethod,
  equipment,
  ingredients,
  brewTime,
  servings,
  toneChecklist,
  metadata{
    readingTime,
    wordCount,
    metaTitle,
    metaDescription,
    ogImage
  },
  toc[]{
    title,
    url,
    items[]
  },
  series{
    name,
    "slug": slug.current,
    part
  },
  seriesRef->{
    _id,
    name,
    "slug": slug.current,
    description
  },
  _createdAt,
  _updatedAt
`;

export const ALL_ARTICLES_QUERY = `
  *[_type == "article" && defined(slug.current)]
  | order(date desc) {
    ${ARTICLE_PROJECTION}
  }
`;

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug][0] {
    ${ARTICLE_PROJECTION}
  }
`;

export const FEATURED_ARTICLES_QUERY = `
  *[_type == "article" && featured == true]
  | order(date desc) {
    ${ARTICLE_PROJECTION}
  }
`;

export const ALL_CATEGORIES_QUERY = `
  *[_type == "category" && defined(slug.current)] {
    _id,
    name,
    "slug": slug.current,
    description,
    kind,
    color,
    "articleCount": count(*[_type == "article" && category._ref == ^._id])
  }
  | order(name asc)
`;

export const CATEGORY_BY_SLUG_QUERY = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    kind,
    color
  }
`;

export const ALL_SERIES_QUERY = `
  *[_type == "series" && defined(slug.current)] {
    _id,
    name,
    "slug": slug.current,
    description
  } | order(name asc)
`;

export const ARTICLES_BY_SERIES_QUERY = `
  *[_type == "article" 
    && (
      series.slug.current == $seriesSlug 
      || seriesRef->slug.current == $seriesSlug
    )
  ]
  | order(series.part asc, date desc) {
    ${ARTICLE_PROJECTION}
  }
`;

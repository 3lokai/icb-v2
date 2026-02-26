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
    avatar,
    supabaseUserId,
    instagram
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
    keywords,
    ogImage{
      asset->{
        _id,
        url,
        metadata { dimensions { width, height } }
      },
      hotspot,
      crop
    },
    canonicalUrl,
    noIndex
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

export const PILLAR_CATEGORIES_QUERY = `
  *[_type == "category" && defined(slug.current) && kind == "pillar"] {
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
    color,
    metadata{
      metaTitle,
      metaDescription,
      keywords,
      ogImage{
        asset->{
          _id,
          url,
          metadata { dimensions { width, height } }
        },
        hotspot,
        crop
      },
      canonicalUrl,
      noIndex
    },
    cover{
      asset->{
        _id,
        url,
        metadata { dimensions { width, height } }
      },
      hotspot,
      crop
    }
  }
`;

export const SERIES_BY_SLUG_PROJECTION = `
  _id,
  name,
  "slug": slug.current,
  description,
  metadata{
    metaTitle,
    metaDescription,
    keywords,
    ogImage{
      asset->{
        _id,
        url,
        metadata { dimensions { width, height } }
      },
      hotspot,
      crop
    },
    canonicalUrl,
    noIndex
  },
  cover{
    asset->{
      _id,
      url,
      metadata { dimensions { width, height } }
    },
    hotspot,
    crop
  }
`;

export const ALL_SERIES_QUERY = `
  *[_type == "series" && defined(slug.current)] {
    ${SERIES_BY_SLUG_PROJECTION}
  } | order(name asc)
`;

export const SERIES_BY_SLUG_QUERY = `
  *[_type == "series" && slug.current == $slug][0] {
    ${SERIES_BY_SLUG_PROJECTION}
  }
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

export const AUTHOR_BY_SLUG_OR_ID_QUERY = `
  *[_type == "author" && (slug.current == $slug || _id == $slug)][0] {
    _id,
    name,
    bio,
    "slug": slug.current,
    avatar,
    supabaseUserId,
    instagram
  }
`;

export const ARTICLES_BY_AUTHOR_QUERY = `
  *[_type == "article" && authorRef._ref == $authorId && defined(slug.current)]
  | order(date desc) {
    ${ARTICLE_PROJECTION}
  }
`;

// Minimal queries for sitemap (non-draft articles only)
export const SITEMAP_ARTICLES_QUERY = `
  *[_type == "article" && defined(slug.current) && draft != true] {
    "slug": slug.current,
    updatedAt,
    _updatedAt,
    updated
  }
`;

export const SITEMAP_CATEGORIES_QUERY = `
  *[_type == "category" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  } | order(name asc)
`;

export const SITEMAP_SERIES_QUERY = `
  *[_type == "series" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  } | order(name asc)
`;

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useQuery } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import qs from "qs";
import axiosInstance from "services/api";
import { Article, Sources } from "utils/interfaces";

export const PAGE_LIMIT = 10;

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}
interface NYTResponse {
  status: string;
  copyright: string;
  response: {
    docs: {
      web_url: string;
      snippet: string;
      source: string;
      multimedia: {
        url: string;
      }[];
      headline: {
        main: string;
      };
      pub_date: string;
      byline: {
        original: string;
      };
      _id: string;
    }[];
    meta: {
      hits: number;
    };
  };
}
interface TheGuardianResponse {
  response: {
    status: string;
    total: number;
    results: {
      id: string;
      webPublicationDate: string;
      webTitle: string;
      webUrl: string;
      pillarName: string;
      fields: {
        thumbnail: string;
        trailText: string;
        byline: string;
        standfirst: string;
      };
    }[];
  };
}

const rateLimitTotal = (total: number) => (total > 100 ? 100 : total);
type SourcesResponse = NewsAPIResponse | NYTResponse | TheGuardianResponse;

export enum Category {
  BUSINESS = "business",
  ENTERTAINMENT = "entertainment",
  GENERAL = "general",
  HEALTH = "health",
  SCIENCE = "science",
  SPORTS = "sports",
  TECHNOLOGY = "technology",
}

const getNewsAPIQuery = (search: SearchObj) => {
  return (
    "https://newsapi.org/v2/everything?" +
    qs.stringify(
      {
        q:
          (search.q ? search.q : "World") +
          (search.category ? " AND " + search.category : ""),
        sortBy: "publishedAt",
        from: search.from?.format("YYYY-MM-DD"),
        to: search.from?.format("YYYY-MM-DD"),
        apiKey: import.meta.env.VITE_INTERNAL_NEWS_API_API_KEY,
        page: search.page,
        pageSize: PAGE_LIMIT,
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    )
  );
};

const getNYTQuery = (search: SearchObj) => {
  return (
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
    qs.stringify(
      {
        fq: { source: "The New York Times" },
        q: search.q + (search.category ? " " + search.category : ""),
        sort: "newest",
        begin_date: search.from?.format("YYYYMMDD"),
        end_date: search.from?.format("YYYYMMDD"),
        page: search.page,
        "api-key": import.meta.env.VITE_INTERNAL_NEW_YORK_TIMES_API_KEY,
        // By default only returns 10 and can't modify
      },
      { encodeValuesOnly: true }
    )
  );
};

const getTheGuardianQuery = (search: SearchObj) => {
  return (
    "https://content.guardianapis.com/search?" +
    qs.stringify({
      "api-key": import.meta.env.VITE_INTERNAL_THE_GUARDIANS_API_KEY,
      q: search.q + (search.category ? " AND " + search.category : ""),
      "from-date": search.from?.format("YYYY-MM-DD"),
      "to-date": search.from?.format("YYYY-MM-DD"),
      page: search.page,
      "show-elements": "image",
      "show-references": "author",
      "show-fields": "all",
      "page-size": PAGE_LIMIT,
    })
  );
};

const SOURCE_CONFIG: Record<
  Sources,
  {
    urlBuilder: (search: SearchObj) => string;
    selector: (oldData: SourcesResponse) => Response;
  }
> = {
  [Sources.THE_GUARDIAN]: {
    urlBuilder: getTheGuardianQuery,
    selector: old => ({
      articles: (old as TheGuardianResponse).response.results.map(result => ({
        author: result.fields.byline,
        content: result.fields.trailText,
        description: result.fields.trailText,
        publishedAt: result.webPublicationDate,
        source: { id: result.id, name: result.pillarName },
        title: result.webTitle,
        url: result.webUrl,
        urlToImage: result.fields.thumbnail,
      })),
      total: rateLimitTotal((old as TheGuardianResponse).response.total),
    }),
  },
  [Sources.NEWS_API]: {
    urlBuilder: getNewsAPIQuery,
    selector: old => ({
      articles: (old as NewsAPIResponse).articles
        .filter(article => article.url !== "https://removed.com")
        .map(article => ({
          ...article,
          content: article.description,
          source: {
            ...article.source,
            id: article.source.id + article.url + article.source.name,
          },
        })),
      total: rateLimitTotal((old as NewsAPIResponse).totalResults),
    }),
  },
  [Sources.NEW_YORK_TIMES]: {
    urlBuilder: getNYTQuery,
    selector: old => ({
      articles: (old as NYTResponse).response.docs.map(doc => ({
        author: doc?.byline?.original,
        content: doc?.snippet,
        description: doc?.snippet,
        publishedAt: doc?.pub_date,
        source: { id: doc?._id, name: doc?.source },
        title: doc?.headline?.main,
        url: doc?.web_url,
        urlToImage: "https://static01.nyt.com/" + doc?.multimedia[0]?.url,
      })),
      total: rateLimitTotal((old as NYTResponse)?.response?.meta?.hits),
    }),
  },
};

interface SearchObj {
  q?: string;
  from?: Dayjs | null;
  category?: string;
  source?: Sources;
  page?: number;
}
interface Response {
  articles: Article[];
  total: number;
}

const useListArticles = (search: SearchObj) => {
  const { q, from, category, source = Sources.NEWS_API, page } = search;

  return useQuery({
    queryKey: ["list-articles", q, source, category, from, page],
    queryFn: () =>
      axiosInstance
        .get<SourcesResponse>(SOURCE_CONFIG[source].urlBuilder(search))
        .then(res => res.data),
    refetchOnWindowFocus: false,
    retry: 1,
    select: data => SOURCE_CONFIG[source].selector(data),
  });
};

export default useListArticles;

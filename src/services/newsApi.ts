import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article, NewsApiResponse, Categories, NewsListFilters } from "@/types";
import { API_KEY, MAX_ARTICLE_PAGE } from "@/constant";
import Source from "@/types/source";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://newsapi.org/v2/" }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<Article[], void>({
      query: () => `top-headlines?country=us&apiKey=${API_KEY}`,
      transformResponse: (response: { articles: Article[] }) =>
        response.articles
          .filter((article) => article.title !== "[Removed]")
          .slice(0, 5),
    }),
    getNewsList: builder.query<NewsApiResponse, NewsListFilters>({
      query: ({ query = "", from = "", to = "", page = 1, sources = "", searchIn }) => {
        const generateSearchParams = `q=${query}&from=${from}&to=${to}&page=${page}&sources=${sources}${searchIn? '&searchIn=' + searchIn: ''}`
        return `everything?${generateSearchParams}&pageSize=${MAX_ARTICLE_PAGE}&apiKey=${API_KEY}`},
      transformResponse: (response: NewsApiResponse) => ({
        ...response,
        articles: response.articles.filter(
          (article) => article.title !== "[Removed]"
        ),
      }),
    }),
    getSources: builder.query<Source[], {category?: Categories}>({
      query: ({ category }) => `top-headlines/sources?category=${category}&apiKey=${API_KEY}`,
      transformResponse: (response: { status: string, sources: Source[] }) => (response.sources),
    }),
  }),
});

export const { useGetTopHeadlinesQuery, useGetNewsListQuery, useGetSourcesQuery } = newsApi;

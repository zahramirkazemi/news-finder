import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article } from "@/types";
import { API_KEY } from "@/constant";

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
  }),
});

export const { useGetTopHeadlinesQuery } = newsApi;

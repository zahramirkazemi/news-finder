"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// modules
import { useWatch, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//constants
import { MAX_ARTICLE_PAGE } from "@/constant";
// types
import { Article, NewsListFilters, Categories } from "@/types";
// utils
import debounce from "@/utils/debounce";
// api
import { useGetNewsListQuery, useGetSourcesQuery } from "@/services/newsApi";
// components
import SearchForm from "@/app/components/searchForm";
import NewsListDisplay from "@/app/components/newsListDisplay";
// styles
import styles from "@/app/components/newsList.module.scss";

const newsListFiltersSchema = z
  .object({
    query: z.string().optional(),
    from: z
      .union([z.string().length(0), z.string().date()])
      .optional(),
    to: z
      .union([z.string().length(0), z.string().date()])
      .optional(),
    searchIn: z.string().optional(),
    category: z.string().optional(),
    sources: z.string(),
  })
  .refine(
    (data) =>
      !data.from || !data.to || new Date(data.to) >= new Date(data.from),
    { message: "end-date must be later than start-date", path: ["to"] }
  );

const NewsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<Categories>("");
  const { data: sources } = useGetSourcesQuery({ category });
  const [searchParams, setSearchParams] = useState<NewsListFilters>({
    query: "",
    sources: "abc-news",
    from: "",
    to: "",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewsListFilters>({
    resolver: zodResolver(newsListFiltersSchema),
    defaultValues: { sources: "abc-news" },
  });

  const {
    data: newsList,
    isError,
    isLoading,
    isFetching,
  } = useGetNewsListQuery({
    ...searchParams,
    page,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const searchTerm = useWatch({ control, name: "query" });
  const selectedCategory = useWatch({ control, name: "category" });

  const handleLiveSearch = useCallback(
    debounce((value: string) => {
      setSearchParams((prev) => ({ ...prev, query: value }));
      setArticles([]);
      setPage(1);
    }, 1000),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      handleLiveSearch(searchTerm);
    }
  }, [searchTerm, handleLiveSearch]);

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
      const filteredSources = sources?.filter(
        (source) => source.category === selectedCategory
      );
      setValue("sources", filteredSources?.map((source) => source.id).join());
    }
  }, [sources, selectedCategory, setValue]);

  useEffect(() => {
    if (newsList?.articles) {
      setArticles((prev) => [...prev, ...newsList.articles]);
    }
  }, [newsList]);

  const lastArticleElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          newsList?.totalResults &&
          page * MAX_ARTICLE_PAGE < newsList?.totalResults
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, page, newsList]
  );

  const handleFormSubmit = (data: NewsListFilters): void => {
    setSearchParams(data);
    setArticles([]);
    setPage(1);
  };

  return (
    <section className={styles.container}>
      <SearchForm
        sources={sources || []}
        handleSubmit={handleSubmit}
        onSubmit={handleFormSubmit}
        register={register}
        errors={errors}
      />
      <NewsListDisplay
        articles={articles}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        lastArticleElementRef={lastArticleElementRef}
      />
    </section>
  );
};

export default NewsList;

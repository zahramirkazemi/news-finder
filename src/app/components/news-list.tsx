"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWatch, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_ARTICLE_PAGE } from "@/constant";
import { Article, NewsListFilters, Categories } from "@/types";
import { newsListFiltersSchema } from "@/utils/filter-validation-schema";
import { useGetNewsListQuery, useGetSourcesQuery } from "@/services/news-api";
import debounce from "@/utils/debounce";
import SearchForm from "./search-form";
import NewsListDisplay from "./news-list-display";
import styles from "./news-list.module.scss";

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
  const { register, setValue, handleSubmit, control, formState: { errors } } = useForm<NewsListFilters>({
    resolver: zodResolver(newsListFiltersSchema),
    defaultValues: { sources: 'abc-news'},
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
  }

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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MAX_ARTICLE_PAGE } from "@/constant";
import { Article, NewsCategoriesEnum, NewsListFilters } from "@/types";
import { useGetNewsListQuery } from "@/services/news-api";
import debounce from "@/utils/debounce";
import ArticleCard from "./article-card";
import styles from "./news-list.module.scss";

const NewsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<NewsListFilters>({
    query: "",
    sources: "abc-news",
    from: "",
    to: "",
    category: "",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const { register, handleSubmit, control } = useForm<NewsListFilters>();
  const { data, isError, isLoading, isFetching } = useGetNewsListQuery({
    ...searchParams,
    page,
  });
  const loadingElement = <div className="loading"></div>;
  const noNewsElement = <div className="error">There is no news! change your filters.</div>
  const errorElement = <p className="error">Error loading news list.</p>;
  const observer = useRef<IntersectionObserver | null>(null);
  const searchTerm = useWatch({
    control,
    name: 'query',
  });

  const handleLiveSearch = useCallback(
    debounce((value: string) => {
      setSearchParams((prevSearchParams) => ({...prevSearchParams, query: value}));
    setArticles([]);
    setPage(1);
    }, 1000),[]
  );

  useEffect(() => {
    if (searchTerm) {
      handleLiveSearch(searchTerm);
    }
  }, [searchTerm, handleLiveSearch]);

  const onSubmit = (data: NewsListFilters) => {
    setSearchParams({
      query: data.query || "",
      sources: data.sources || "",
      from: data.from || "",
      to: data.to || "",
      category: data.category || "",
      searchIn: data.searchIn
    });
    setArticles([]);
    setPage(1);
  };

  useEffect(() => {
    debugger;
    if (data?.articles) {
      setArticles((prevArticles) => [...prevArticles, ...data.articles]);
    }
  }, [data]);

  const lastArticleElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          data?.totalResults &&
          page * MAX_ARTICLE_PAGE < data?.totalResults
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, page, data]
  );

  const renderSearchBar = (): JSX.Element => (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <input
        className={styles.input}
        {...register('query')}
        type="text"
        placeholder="Search..."
      />
        <input className={styles.input} type="date" placeholder="From..." {...register('from')} />
        <input className={styles.input} type="date" placeholder="To..." {...register('to')} />
        <select {...register('searchIn')} className={styles.input}>
          <option value="">Search In</option>
          <option value="title">Title</option>
          <option value="description">Description</option>
          <option value="content">Content</option>
        </select>
        <select {...register('category')} className={styles.input}>
          <option value="">Category</option>
          <option value={NewsCategoriesEnum.Business}>Business</option>
          <option value={NewsCategoriesEnum.Entertainment}>Entertainment</option>
          <option value={NewsCategoriesEnum.General}>General</option>
          <option value={NewsCategoriesEnum.Health}>Health</option>
          <option value={NewsCategoriesEnum.Science}>Science</option>
          <option value={NewsCategoriesEnum.Sports}>Sports</option>
          <option value={NewsCategoriesEnum.Technology}>Technology</option>
        </select>
        <button type="submit">Search</button> 
    </form>
  );

  const renderNewsList = (): JSX.Element =>
    isLoading ? (
      loadingElement
    ) : isError ? (
      errorElement
    ) : (
      <section className={styles.newsListContainer}>
        {articles.length > 0 && !isFetching ? articles.map((article, index) => (
          <div
            key={index}
            ref={articles.length === index + 1 ? lastArticleElementRef : null}
          >
            <ArticleCard article={article} />
          </div>
        )): noNewsElement}
        {isFetching && loadingElement}
      </section>
    );

  return (
    <section className={styles.container}>
      {!isLoading && !isError && renderSearchBar()}
      {renderNewsList()}
    </section>
  );
};

export default NewsList;

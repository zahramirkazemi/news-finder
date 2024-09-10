"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MAX_ARTICLE_PAGE } from "@/constant";
import { Article, NewsCategories, NewsCategoriesEnum, NewsListFilters, SearchInEnum } from "@/types";
import { useGetNewsListQuery, useGetSourcesQuery } from "@/services/news-api";
import debounce from "@/utils/debounce";
import ArticleCard from "./article-card";
import styles from "./news-list.module.scss";

const NewsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<NewsCategories>('');
  const { data: sources } = useGetSourcesQuery({
    category
  });
  const [searchParams, setSearchParams] = useState<NewsListFilters>({
    query: "",
    sources: "abc-news",
    from: "",
    to: "",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const { register, setValue, handleSubmit, control } = useForm<NewsListFilters>();
  const { data: newsList, isError, isLoading, isFetching } = useGetNewsListQuery({
    ...searchParams,
    page,
  });

  const loadingElement = <div className="loading"></div>;
  const errorElement = <p className="error">Error loading news list.</p>;

  const observer = useRef<IntersectionObserver | null>(null);
  const searchTerm = useWatch({
    control,
    name: 'query',
  });
  const selectedCategory = useWatch({
    control,
    name: 'category',
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

  useEffect(() => {
    const newSources = sources;
    if(selectedCategory) {
      setCategory(selectedCategory);
      setValue("sources", newSources?.filter(source => source.category === selectedCategory)?.map(source => source.id).join())
    }
  },[sources, selectedCategory, setValue])

  const onSubmit = (newsFilters: NewsListFilters) => {
    setSearchParams({
      query: newsFilters.query || "",
      sources: newsFilters.sources || "",
      from: newsFilters.from || "",
      to: newsFilters.to || "",
      searchIn: newsFilters.searchIn
    });
    setArticles([]);
    setPage(1);
  };

  useEffect(() => {
    if (newsList?.articles) {
      setArticles((prevArticles) => [...prevArticles, ...newsList.articles]);
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
          <option value={SearchInEnum.Title}>Title</option>
          <option value={SearchInEnum.Description}>Description</option>
          <option value={SearchInEnum.Content}>Content</option>
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
        <select {...register('sources')} className={styles.input}>
          {sources?.map(source => <option key={source.id} value={source.id}>{source.name}</option>)}
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
        {articles.map((article, index) => (
          <div
            key={index}
            ref={articles.length === index + 1 ? lastArticleElementRef : null}
          >
            <ArticleCard article={article} />
          </div>
        ))}
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

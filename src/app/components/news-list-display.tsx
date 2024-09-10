"use client";

import { Article } from "@/types";
import ArticleCard from "./article-card";
import styles from "./news-list.module.scss";

interface NewsListDisplayProps {
  articles: Article[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  lastArticleElementRef: (node: HTMLElement | null) => void;
}

const NewsListDisplay: React.FC<NewsListDisplayProps> = ({
  articles,
  isLoading,
  isFetching,
  isError,
  lastArticleElementRef,
}) => {
  const loadingElement = <div className="loading"></div>;
  const errorElement = <p className="error">Error loading news list.</p>;

  return isLoading ? (
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
};

export default NewsListDisplay;

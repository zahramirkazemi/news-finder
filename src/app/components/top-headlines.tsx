"use client";

import { useGetTopHeadlinesQuery } from "@/services/news-api";
import styles from "./top-headlines.module.scss";

const TopHeadlines: React.FC = () => {
  const { data: articles, isError, isLoading } = useGetTopHeadlinesQuery();
  const loadingElement = <div className="loading"></div>;
  const errorElement = <p className='error'>Error loading headlines.</p>;

  const renderTopHeadLines = (): JSX.Element =>
    isLoading ? (
      loadingElement
    ) : isError ? (
      errorElement
    ) : (
      <ul className={styles.headlines}>
        {articles?.map((article, index) => (
          <li key={index}>
            <h4>{article.title}</h4>
          </li>
        ))}
      </ul>
    );

  return (
    <section className={styles.container}>
      <h2>Top Headlines</h2>
      {renderTopHeadLines()}
    </section>
  );
};

export default TopHeadlines;

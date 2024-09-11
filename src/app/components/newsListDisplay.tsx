"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Article } from "@/types";
import ArticleCard from "./articleCard";
import styles from "./newsList.module.scss";

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
  const rowVirtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 190,
    overscan: 3,
  });

  const parentRef = useRef<HTMLDivElement | null>(null);
  const loadingElement = <div className="loading"></div>;
  const errorElement = <p className="error">Error loading news list.</p>;

  return isLoading ? (
    loadingElement
  ) : isError ? (
    errorElement
  ) : (
    <section className={styles.newsListContainer} ref={parentRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const article = articles[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              ref={
                articles.length === virtualRow.index + 1
                  ? lastArticleElementRef
                  : null
              }
              style={{
                position: "absolute",
                top: `${virtualRow.start}px`,
                width: "100%",
              }}
            >
              <ArticleCard article={article} />
            </div>
          );
        })}
        {isFetching && loadingElement}
      </div>
    </section>
  );
};

export default NewsListDisplay;

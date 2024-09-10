"use client";

import { Article } from "@/types";
import dateFormat from "@/utils/date-format";
import styles from "./article-card.module.scss";

interface ArticleCardProps {
  article: Article,
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article } : ArticleCardProps) => (
  <section className={styles.container} >
    <h4 className={styles.title}>{article.title}</h4>
    <dl>
      <dd>{article.description}</dd>
    </dl>
    <span className={styles.info}>{`${dateFormat(article.publishedAt)} | ${article.source.name}`}</span>
  </section>
);

export default ArticleCard;

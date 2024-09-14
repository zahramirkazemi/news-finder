"use client";
// types
import { Article } from "@/types";
// utils
import dateFormat from "@/utils/dateFormat";
// styles
import styles from "@/app/components/articleCard.module.scss";

interface ArticleCardProps {
  article: Article,
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article } : ArticleCardProps) => (
  <section className={styles.container} >
    <h4 className={styles.title}>{article.title}</h4>
    <dl>
      <dd className={styles.description}>{article.description}</dd>
    </dl>
    <span className={styles.info}>{`${dateFormat(article.publishedAt)} | ${article.source.name}`}</span>
  </section>
);

export default ArticleCard;

import NewsList from './components/news-list';
import TopHeadlines from './components/top-headlines';
import styles from './page.module.scss';

export default function Home() {
  return (
      <main className={styles.main}>        
        <TopHeadlines/>
        <hr className={styles.divider}/>
        <NewsList />
      </main>
  );
}

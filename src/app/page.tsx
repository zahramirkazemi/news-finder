import NewsList from './components/newsList';
import TopHeadlines from './components/topHeadlines';
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

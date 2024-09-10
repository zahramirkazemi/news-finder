import TopHeadlines from './components/top-headlines';
import styles from './page.module.scss';

export default function Home() {
  return (
      <main className={styles.main}>        
        <TopHeadlines/>
      </main>
  );
}

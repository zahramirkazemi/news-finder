// components
import NewsList from '@/app/components/newsList';
import TopHeadlines from '@/app/components/topHeadlines';
// styles
import styles from '@/app/page.module.scss';

export default function Home() {
  return (
      <main className={styles.main}>        
        <TopHeadlines/>
        <hr className={styles.divider}/>
        <NewsList />
      </main>
  );
}

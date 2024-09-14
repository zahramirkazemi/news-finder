import Article from "@/types/article";

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export default NewsApiResponse;

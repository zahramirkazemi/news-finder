import NewsCategories from "./news-categories";

interface Source {
  category: NewsCategories;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
}

export default Source;

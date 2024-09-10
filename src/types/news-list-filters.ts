import NewsCategories from "./news-categories";
import SearchInType from "./search-in-type";

interface NewsListFilters {
  query?: string;
  from?: string;
  to?: string;
  page?: number;
  sources?: string;
  category?: NewsCategories;
  searchIn?: SearchInType;
}

export default NewsListFilters;

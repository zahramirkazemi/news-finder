import Categories from "./categories";
import SearchInType from "./search-in-type";

interface NewsListFilters {
  query?: string;
  from?: string;
  to?: string;
  page?: number;
  sources?: string;
  category?: Categories;
  searchIn?: SearchInType;
}

export default NewsListFilters;

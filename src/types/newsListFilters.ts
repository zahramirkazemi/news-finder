import Categories from "@/types/categories";
import SearchInType from "@/types/searchInType";

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

import { Categories, SearchInType } from "@/types";

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

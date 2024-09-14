import Categories from "@/types/categories";

interface Source {
  category: Categories;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
}

export default Source;

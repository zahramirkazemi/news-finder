import { Categories } from "@/types";

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

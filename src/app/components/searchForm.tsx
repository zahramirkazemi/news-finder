"use client";

import {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { CategoriesEnum, SearchInEnum, NewsListFilters } from "@/types";
import styles from "./newsList.module.scss";

interface SearchFormProps {
  sources: { id: string; name: string }[];
  handleSubmit: UseFormHandleSubmit<NewsListFilters>;
  onSubmit: (newsFilters: NewsListFilters) => void;
  register: UseFormRegister<NewsListFilters>;
  errors: FieldErrors<NewsListFilters>;
}

const SearchForm: React.FC<SearchFormProps> = ({
  sources,
  handleSubmit,
  onSubmit,
  register,
  errors,
}) => {
  const renderSearchInOptions = (
    <>
      <option value="">Search In</option>
      <option value={SearchInEnum.Title}>Title</option>
      <option value={SearchInEnum.Description}>Description</option>
      <option value={SearchInEnum.Content}>Content</option>
    </>
  );

  const renderCategoriesOptions = (
    <>
      <option value="">Category</option>
      <option value={CategoriesEnum.Business}>Business</option>
      <option value={CategoriesEnum.Entertainment}>Entertainment</option>
      <option value={CategoriesEnum.General}>General</option>
      <option value={CategoriesEnum.Health}>Health</option>
      <option value={CategoriesEnum.Science}>Science</option>
      <option value={CategoriesEnum.Sports}>Sports</option>
      <option value={CategoriesEnum.Technology}>Technology</option>
    </>
  );

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <input
        className={styles.input}
        {...register("query")}
        type="text"
        placeholder="Search..."
      />
      <span>
        <input
          className={styles.input}
          type="date"
          placeholder="From..."
          {...register("from")}
        />
        {errors.from && <p className={styles.inlineError}>{errors.from.message}</p>}
      </span>
      <span>
        <input
          className={styles.input}
          type="date"
          placeholder="To..."
          {...register("to")}
        />
        {errors.to && <p className={styles.inlineError}>{errors.to.message}</p>}
      </span>
      <select {...register("searchIn")} className={styles.input}>
        {renderSearchInOptions}
      </select>
      <select {...register("category")} className={styles.input}>
        {renderCategoriesOptions}
      </select>
      <select {...register("sources")} className={styles.input} defaultValue='abc-news'>
        {sources?.map((source) => (
          <option key={source.id} value={source.id}>
            {source.name}
          </option>
        ))}
      </select>
      <button className={styles.searchButton} type="submit">Search</button>
    </form>
  );
};

export default SearchForm;

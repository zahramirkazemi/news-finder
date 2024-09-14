"use client";
// form
import {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
// types
import {
  CategoriesEnum,
  SearchInEnum,
  NewsListFilters,
} from "@/types";
// styles
import styles from "@/app/components/newsList.module.scss";

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
  const categoriesOptions = [
    CategoriesEnum.Business,
    CategoriesEnum.Entertainment,
    CategoriesEnum.General,
    CategoriesEnum.Health,
    CategoriesEnum.Science,
    CategoriesEnum.Sports,
    CategoriesEnum.Technology,
  ];
  const searchInOptions = [
    SearchInEnum.Title,
    SearchInEnum.Description,
    SearchInEnum.Content,
  ];

  const renderSearchInOptions = (
    <>
      <option value="">Search In</option>
      {searchInOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </>
  );

  const renderCategoriesOptions = (
    <>
      <option value="">Category</option>
      {categoriesOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
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
        {errors.from && (
          <p className={styles.inlineError}>{errors.from.message}</p>
        )}
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
      <select
        {...register("sources")}
        className={styles.input}
        defaultValue="abc-news"
      >
        {sources?.map((source) => (
          <option key={source.id} value={source.id}>
            {source.name}
          </option>
        ))}
      </select>
      <button className={styles.searchButton} type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;

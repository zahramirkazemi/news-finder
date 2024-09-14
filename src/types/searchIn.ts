export enum SearchInEnum {
  Title = 'title',
  Description = 'description',
  Content = 'content',
}

export type SearchInType = SearchInEnum.Title | SearchInEnum.Description | SearchInEnum.Content;
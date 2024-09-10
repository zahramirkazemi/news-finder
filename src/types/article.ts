interface Article {
  author: string | null,
  content: string,
  description: string,
  publishedAt: Date,
  source: {id: number | null, name: string},
  title: string,
  url: string,
  urlToImage: string,
}

export default  Article;
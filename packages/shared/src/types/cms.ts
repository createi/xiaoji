// 文章
export interface Article {
  id: number;
  cid: number;
  title: string;
  author: string;
  image_input: string[];
  content: string;
  digest: string;
  visit: number;
  sort: number;
  status: number;
  is_hot: number;
  is_best: number;
  is_new: number;
  add_time: number;
}

// 文章分类
export interface ArticleCategory {
  id: number;
  pid: number;
  name: string;
  sort: number;
  status: number;
  add_time: number;
}

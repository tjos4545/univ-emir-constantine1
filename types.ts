
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

export interface LibrarySection {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum TabType {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  NEWS = 'NEWS',
  AI = 'AI'
}


export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  dateAdded: string;
}

export interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
}

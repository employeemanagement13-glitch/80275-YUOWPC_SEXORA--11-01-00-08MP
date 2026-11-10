export interface BlogContentItem {
  heading: string;
  paragraph: string;
  imageUrl: string | null;
}

export interface CreatingBlogData {
  id?: string;
  title: string;
  shortDescription: string;
  bannerImage: File | null;
  referenceImage: File | null;
  content: BlogContentItem[];
}

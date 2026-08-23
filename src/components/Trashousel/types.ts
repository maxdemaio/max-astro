export interface CoverflowProps {
  images: Image[];
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width?: number;
  height?: number;
  alt: string;
  githubUrl?: string;
  siteUrl?: string;
}

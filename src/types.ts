export interface ImageMetadata {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  aiPrompt?: string;
  aiModel?: string;
  aiSettings?: {
    negativePrompt?: string;
    steps?: number;
    seed?: number;
    guidanceScale?: number;
  };
  uploadDate: string;
  likes: number;
  userId?: string;
  parentImageId?: string;
  childImageIds: string[];
  isPlaceholder?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ImageLineage {
  parent?: ImageMetadata;
  current: ImageMetadata;
  children: ImageMetadata[];
}
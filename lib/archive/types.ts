export type ArchiveItemFormInput = {
  title: string;
  url: string;
  note: string | null;
  isFavorite: boolean;
  tagNames: string[];
  imageUrl: string | null;
  source: string | null;
};

export type CreateArchiveItemInput = ArchiveItemFormInput;

export type UpdateArchiveItemInput = ArchiveItemFormInput & {
  id: string;
};

export type ArchiveItemRecord = {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  note: string | null;
  isFavorite: boolean;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  tagSlugs: string[];
};

export type ArchiveUrlMetadata = {
  title?: string;
  description?: string;
  imageUrl?: string;
  source?: string;
};

export type ArchiveTagOption = {
  name: string;
  slug: string;
};

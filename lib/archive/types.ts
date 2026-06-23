export type CreateArchiveItemInput = {
  title: string;
  url: string;
  note: string | null;
  isFavorite: boolean;
  tagNames: string[];
};

export type ArchiveItemWithTags = {
  id: string;
  title: string;
  url: string;
  note: string | null;
  isFavorite: boolean;
  createdAt: Date;
  tags: string[];
};

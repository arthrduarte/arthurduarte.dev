export type ArchiveItemFormInput = {
  title: string;
  url: string;
  note: string | null;
  isFavorite: boolean;
  tagNames: string[];
  imageUrl: string | null;
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
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  tagSlugs: string[];
};

export type ArchiveUrlMetadata = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type ArchiveTagOption = {
  name: string;
  slug: string;
};

export type DeletedArchiveItemRecord = ArchiveItemRecord & {
  deletedAt: Date;
  deletedReason: string;
};

export type SoftDeleteArchiveItemInput = {
  id: string;
  deletedReason: string;
};

export type RestoreArchiveItemInput = {
  id: string;
};

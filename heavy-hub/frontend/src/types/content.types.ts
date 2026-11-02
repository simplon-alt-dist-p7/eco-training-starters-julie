// Données des contenus et de leurs modules

export type ContentModule = {
  title: string;
  progress: number;
  attachmentCount: number;
};

export type ContentAttachment = {
  name: string;
  kind: string;
};

export type RawContentItem = {
  id: string;
  title: string;
  format: string;
  level: string;
  duration: number;
  heroAsset: string;
  teaser: string;
  body: string;
  modules: ContentModule[];
  attachments: ContentAttachment[];
};

export type DisplayContentItem =
  Omit<RawContentItem, 'modules' | 'attachments'> & {
    track: string;
    modules: ContentModule[];
    attachments: ContentAttachment[];
  };

export type RawContentDetail = RawContentItem & {
  related: RawContentItem[];
};

export type DisplayContentDetail = DisplayContentItem & {
  related: DisplayContentItem[];
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ContentBlockType =
  | "heading"
  | "paragraph"
  | "video"
  | "image"
  | "callToAction"
  | "quote"
  | "table"
  | "faq"
  | "relatedArticles"
  | "map"
  | "list"
  | "audio"
  | "references"
  | "tableOfContents";

export interface BaseBlock {
  id: string;
  type: ContentBlockType;
  order: number;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  data: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    id?: string;
  };
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  data: {
    text: string;
  };
}

export interface VideoBlock extends BaseBlock {
  type: "video";
  data: {
    url: string;
    description?: string;
    source?: 'internal' | 'aparat' | '';
  };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  data: {
    url: string;
    alt: string;
    caption?: string;
  };
}

export interface CallToActionBlock extends BaseBlock {
  type: "callToAction";
  data: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  data: {
    englishText: string;
    persianText: string;
    referenceLink: string;
  };
}

export interface TableBlock extends BaseBlock {
  type: "table";
  data: {
    rows: number;
    columns: number;
    headers: string[];
    data: string[][];
    description?: string;
    descriptionLink?: string;
    headerColor?: string;
  };
}

export interface FAQBlock extends BaseBlock {
  type: "faq";
  data: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface RelatedArticlesBlock extends BaseBlock {
  type: "relatedArticles";
  data: {
    articles: Array<{
      id: string;
      title: string;
      url: string;
    }>;
  };
}

export interface MapBlock extends BaseBlock {
  type: "map";
  data: {
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  };
}

export interface ListBlock extends BaseBlock {
  type: "list";
  data: {
    items: string[];
    ordered: boolean;
  };
}

export interface AudioBlock extends BaseBlock {
  type: "audio";
  data: {
    url: string;
    title: string;
    description?: string;
  };
}

export interface ReferencesBlock extends BaseBlock {
  type: "references";
  data: {
    title: string;
    references: Array<{
      id: string;
      title: string;
      url: string;
    }>;
  };
}

export interface TableOfContentsBlock extends BaseBlock {
  type: "tableOfContents";
  data: {
    items: Array<{
      title: string;
      id: string;
      type: "h2" | "h3";
    }>;
  };
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | VideoBlock
  | ImageBlock
  | CallToActionBlock
  | QuoteBlock
  | TableBlock
  | FAQBlock
  | RelatedArticlesBlock
  | MapBlock
  | ListBlock
  | AudioBlock
  | ReferencesBlock
  | TableOfContentsBlock;

export interface Article {
  id?: string;
  englishTitle: string;
  persianTitle: string;
  mainImage: string;
  content: ContentBlock[];
  createdAt?: string;
  updatedAt?: string;
}


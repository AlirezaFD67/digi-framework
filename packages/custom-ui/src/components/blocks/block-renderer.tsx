"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { ContentBlock } from "../../types/content-blocks";
import HeadingBlockComponent from "./heading-block";
import ParagraphBlockComponent from "./paragraph-block";
import VideoBlockComponent from "./video-block";
import CallToActionBlockComponent from "./call-to-action-block";
import ImageBlockComponent from "./image-block";
import QuoteBlockComponent from "./quote-block";
import TableBlockComponent from "./table-block";
import FAQBlockComponent from "./faq-block";
import AudioBlockComponent from "./audio-block";
import MapBlockComponent from "./map-block";
import ListBlockComponent from "./list-block";
import ReferencesBlockComponent from "./references-block";
import TableOfContentsBlockComponent from "./table-of-contents-block";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface BlockRendererProps {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  isEditing?: boolean;
  articleId?: string;
  itemMedia?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function BlockRenderer({
  block,
  onChange,
  isEditing = false,
  articleId,
  itemMedia,
}: BlockRendererProps) {
  const handleChange = (updatedBlock: ContentBlock) => {
    onChange(updatedBlock);
  };

  switch (block.type) {
    case "heading":
      return (
        <HeadingBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "paragraph":
      return (
        <ParagraphBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "video":
      return (
        <VideoBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
          articleId={articleId}
          itemMedia={itemMedia}
        />
      );

    case "callToAction":
      return (
        <CallToActionBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
          articleId={articleId}
          itemMedia={itemMedia}
        />
      );

    case "image":
      return (
        <ImageBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
          articleId={articleId}
          itemMedia={itemMedia}
        />
      );

    case "quote":
      return (
        <QuoteBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "table":
      return (
        <TableBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "faq":
      return (
        <FAQBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "audio":
      return (
        <AudioBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
          articleId={articleId}
          itemMedia={itemMedia}
        />
      );

    case "map":
      return (
        <MapBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "list":
      return (
        <ListBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "references":
      return (
        <ReferencesBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    case "tableOfContents":
      return (
        <TableOfContentsBlockComponent
          block={block}
          onChange={handleChange}
          isEditing={isEditing}
        />
      );

    default:
      return (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-500 text-center">
            Unknown block type: {(block as any).type}
          </p>
        </div>
      );
  }
}

import React from "react";

const RichTextDisplay = ({
  content,
  className = "",
  maxLength = null,
  preview = false,
}) => {
  // Process plain text content
  const processContent = () => {
    if (!content) return "";

    let processedContent = content;

    // For preview mode, truncate text
    if (preview && maxLength && content.length > maxLength) {
      processedContent = content.substring(0, maxLength) + "...";
    }

    return processedContent;
  };

  const displayContent = processContent();

  if (!displayContent) {
    return null;
  }

  return (
    <div
      className={`simple-text-display ${
        preview ? "simple-text-preview" : ""
      } ${className}`}
      style={{
        wordBreak: "break-word",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap", // Preserve line breaks and whitespace
      }}
    >
      {displayContent}
    </div>
  );
};

export default RichTextDisplay;

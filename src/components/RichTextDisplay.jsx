import React from "react";

const RichTextDisplay = ({
  content,
  className = "",
  maxLength = null,
  preview = false,
}) => {
  // Sanitize and display HTML content safely
  const createMarkup = () => {
    let processedContent = content;

    if (preview && content) {
      // For preview mode, strip HTML and truncate text
      const textContent = content.replace(/<[^>]*>/g, "").trim();
      if (maxLength && textContent.length > maxLength) {
        processedContent = textContent.substring(0, maxLength) + "...";
      } else {
        processedContent = textContent;
      }
    }

    return { __html: processedContent };
  };

  if (!content) {
    return null;
  }

  return (
    <div
      className={`rich-text-display ${
        preview ? "rich-text-preview" : ""
      } ${className}`}
      dangerouslySetInnerHTML={createMarkup()}
      style={{
        wordBreak: "break-word",
        lineHeight: "1.6",
      }}
    />
  );
};

export default RichTextDisplay;

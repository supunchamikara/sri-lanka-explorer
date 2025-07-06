import React from "react";

const RichTextDisplay = ({ content, maxLength = null, className = "" }) => {
  if (!content) {
    return null;
  }

  // Handle truncation if maxLength is specified
  let displayContent = content;
  let isTruncated = false;

  if (maxLength && content.length > maxLength) {
    displayContent = content.substring(0, maxLength) + "...";
    isTruncated = true;
  }

  return (
    <div className={`rich-text-display ${className}`}>
      <div
        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
      >
        {displayContent}
      </div>
      {isTruncated && (
        <span className="text-accent-gold text-sm mt-2 inline-block">
          ... Read more
        </span>
      )}
    </div>
  );
};

export default RichTextDisplay;

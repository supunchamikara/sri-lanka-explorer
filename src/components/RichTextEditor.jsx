import React from "react";
import "./RichTextEditor.css";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Enter your description...",
  className = "",
  disabled = false,
}) => {
  const handleTextChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`simple-text-editor ${className}`}>
      <textarea
        className="simple-text-textarea"
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
      />
    </div>
  );
};

export default RichTextEditor;

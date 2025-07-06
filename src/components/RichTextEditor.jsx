import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter your description...",
  className = "",
  disabled = false,
}) => {
  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  // Quill formats configuration
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "color",
    "background",
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          backgroundColor: disabled ? "#f9fafb" : "white",
        }}
      />

      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-bottom: none;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f9fafb;
        }

        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top: none;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
        }

        .rich-text-editor .ql-editor {
          min-height: 120px;
          padding: 12px;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }

        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }

        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus {
          color: #fca311;
        }

        .rich-text-editor .ql-toolbar button.ql-active {
          color: #fca311;
        }

        .rich-text-editor .ql-toolbar .ql-picker-label:hover,
        .rich-text-editor .ql-toolbar .ql-picker-label.ql-active {
          color: #fca311;
        }

        /* Focus styles */
        .rich-text-editor .ql-container.ql-focused {
          border-color: #fca311;
          box-shadow: 0 0 0 2px rgba(252, 163, 17, 0.2);
        }

        .rich-text-editor .ql-toolbar.ql-focused {
          border-color: #fca311;
        }

        /* Responsive toolbar */
        @media (max-width: 640px) {
          .rich-text-editor .ql-toolbar {
            display: flex;
            flex-wrap: wrap;
          }

          .rich-text-editor .ql-formats {
            margin-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

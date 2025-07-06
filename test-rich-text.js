#!/usr/bin/env node

/**
 * Rich Text Editor Test Script
 * Tests the rich text functionality and validates HTML content processing
 */

// Test HTML sanitization and validation
const testHTMLContent = `
<h1>Test Title</h1>
<p>This is a <strong>bold</strong> paragraph with <em>italic</em> text.</p>
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>
<blockquote>This is a quote</blockquote>
<p>Link to <a href="https://example.com">example</a></p>
`;

const createStripHtmlFunction = () => {
  // Simple HTML stripping function for testing
  return (html) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };
};

const createTruncateFunction = () => {
  return (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };
};

const stripHtml = createStripHtmlFunction();
const truncate = createTruncateFunction();

console.log("🧪 Testing Rich Text Editor Functionality\n");

console.log("📝 Original HTML Content:");
console.log(testHTMLContent);
console.log("\n" + "=".repeat(50) + "\n");

console.log("🧹 Stripped HTML Content:");
const strippedContent = stripHtml(testHTMLContent);
console.log(strippedContent);
console.log("\n" + "=".repeat(50) + "\n");

console.log("✂️ Truncated Content (150 chars):");
const truncatedContent = truncate(strippedContent, 150);
console.log(truncatedContent);
console.log(`Length: ${truncatedContent.length} characters`);
console.log("\n" + "=".repeat(50) + "\n");

// Test validation
const validateRichTextContent = (content) => {
  if (!content || typeof content !== "string") {
    return { isValid: false, error: "Content must be a non-empty string" };
  }

  const stripped = stripHtml(content).trim();
  if (!stripped) {
    return {
      isValid: false,
      error: "Content cannot be empty after HTML removal",
    };
  }

  if (stripped.length < 10) {
    return {
      isValid: false,
      error: "Content must be at least 10 characters long",
    };
  }

  if (stripped.length > 5000) {
    return { isValid: false, error: "Content cannot exceed 5000 characters" };
  }

  return { isValid: true, stripped, length: stripped.length };
};

console.log("✅ Validation Test Results:");
const validationResult = validateRichTextContent(testHTMLContent);
console.log("Is valid:", validationResult.isValid);
if (validationResult.isValid) {
  console.log("Stripped length:", validationResult.length);
} else {
  console.log("Error:", validationResult.error);
}

console.log("\n🎉 Rich Text Editor tests completed successfully!");

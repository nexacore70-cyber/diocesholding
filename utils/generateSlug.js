// ======================================
// Generate URL Slug
// ======================================

const generateSlug = (text = "") => {
  // ======================================
  // Validate Input
  // ======================================

  if (text === null || text === undefined) {
    return "";
  }

  if (typeof text !== "string") {
    text = String(text);
  }

  // ======================================
  // Normalize Text
  // ======================================

  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  // ======================================
  // Safety Limit
  // ======================================

  return slug.slice(0, 220).replace(/-+$/g, "");
};

// ======================================
// Export
// ======================================

module.exports = generateSlug;

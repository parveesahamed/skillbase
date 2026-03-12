/**
 * skillExtractor.js
 * Takes raw text extracted from a PDF resume and returns an array of
 * canonical skill names by matching against skillTaxonomy.js.
 */
const skillTaxonomy = require('./skillTaxonomy');

/**
 * Normalise a piece of text for matching:
 * - lowercase
 * - collapse multiple whitespace into a single space
 * - strip non-alphanumeric characters that aren't spaces, +, #, /, or .
 */
const normalise = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#/.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * extractSkills(rawText)
 * @param {string} rawText  - Plain text from pdf-parse
 * @returns {string[]}      - Deduplicated array of matched canonical skill names
 */
const extractSkills = (rawText) => {
  const normalisedText = normalise(rawText);
  const foundSkills = new Set();

  for (const [canonicalName, variants] of Object.entries(skillTaxonomy)) {
    for (const variant of variants) {
      // Build a regex that matches the variant as a whole word / token.
      // We escape special regex chars in the variant first.
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Use \b word boundaries; fall back to lookahead/lookbehind for
      // variants that start/end with non-word characters (e.g. "c++")
      const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i');

      if (pattern.test(normalisedText)) {
        foundSkills.add(canonicalName);
        break; // no need to check more variants for this canonical skill
      }
    }
  }

  return Array.from(foundSkills);
};

module.exports = { extractSkills };

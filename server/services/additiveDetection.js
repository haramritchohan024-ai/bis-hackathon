const Additive = require('../models/Additive');

/**
 * Detects additives from text using regex and DB lookup
 * @param {string} text - The input ingredients text
 * @returns {Promise<Object>} - Detected additives codes and names
 */
const detectAdditivesFromText = async (text) => {
    // 1. Normalize Text
    // remove punctuation like brackets if they mess up tokens, but keeping commas/spaces is usually good
    // we want to catch "E621" or "sodium benzoate"
    const normalizedText = text.toLowerCase()
        .replace(/[()]/g, ' ') // replace brackets with space
        .replace(/\s+/g, ' ');

    console.log("Normalized Detect Text:", normalizedText.substring(0, 100) + "...");

    // 2. Fetch all additives from DB for matching
    // Optimization: In prod, cache this or use text search.
    const allAdditives = await Additive.find({});

    const detectedAdditives = [];
    const detectedCodes = [];
    const detectedNames = [];

    // Helper to escape regex
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    allAdditives.forEach(additive => {
        let codePatterns = [];

        // E-codes: E102, E 102, E-102
        if (additive.code && additive.code.toUpperCase().startsWith('E')) {
            const numPart = additive.code.substring(1);
            codePatterns.push(`E\\s*${numPart}`);
            codePatterns.push(`E-${numPart}`);
        }
        // INS codes: INS 102, INS-102, INS102
        else if (additive.code && additive.code.toUpperCase().startsWith('INS')) {
            const numPart = additive.code.replace(/INS/i, '').trim();
            codePatterns.push(`INS\\s*-?\\s*${numPart}`);
            codePatterns.push(`INS${numPart}`);
        }
        // Fallback for other codes
        else {
            codePatterns.push(escapeRegExp(additive.code));
        }

        const namePattern = escapeRegExp(additive.name);

        // Regex for code (whole word boundary)
        const codeRegex = new RegExp(`\\b(${codePatterns.join('|')})\\b`, 'i');
        // Regex for name (whole word boundary)
        const nameRegex = new RegExp(`\\b${namePattern}\\b`, 'i');

        const codeMatch = codeRegex.test(normalizedText);
        const nameMatch = nameRegex.test(normalizedText);

        if (codeMatch || nameMatch) {
            // Avoid duplicates in result list
            if (!detectedAdditives.find(a => a.code === additive.code)) {
                detectedAdditives.push(additive);
                if (codeMatch) detectedCodes.push(additive.code);
                if (nameMatch) detectedNames.push(additive.name);
                console.log(`Detected: ${additive.name} (${additive.code})`);
            }
        }
    });

    return {
        detectedAdditives, // Full DB objects
        detectedCodes,
        detectedNames
    };
};

module.exports = { detectAdditivesFromText };

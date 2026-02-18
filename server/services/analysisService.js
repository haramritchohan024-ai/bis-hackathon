const { detectAdditivesFromText } = require('./additiveDetection');
const Alternative = require('../models/Alternative');

const analyzeProduct = async (text, healthProfile = [], sensitivityProfile = [], debugMode = false) => {
    try {
        if (!text) throw new Error("No text provided for analysis");

        // 1. Text Normalization
        const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');

        // 2. Additive Detection (Delegated to specialized module)
        const { detectedAdditives } = await detectAdditivesFromText(text);

        if (debugMode) console.log(`Debug Analysis: Found ${detectedAdditives.length} additives`);

        // 3. Nutrition Extraction (Basic Regex)
        const nutritionFlags = {
            highSugar: /SUGAR\s*:\s*(\d+)/i.test(normalizedText) && parseInt(normalizedText.match(/SUGAR\s*:\s*(\d+)/i)[1]) > 10,
            highSodium: /SODIUM\s*:\s*(\d+)/i.test(normalizedText) && parseInt(normalizedText.match(/SODIUM\s*:\s*(\d+)/i)[1]) > 400,
            highSaturatedFat: /SATURATED\s*FAT\s*:\s*(\d+)/i.test(normalizedText) && parseInt(normalizedText.match(/SATURATED\s*FAT\s*:\s*(\d+)/i)[1]) > 5,
            transFatPresent: /TRANS\s*FAT|HYDROGENATED/i.test(normalizedText)
        };

        // 4. Scoring Logic (Strictly as requested)
        let score = 10;
        const scoreBreakdown = {
            additiveCountPenalty: 0,
            highRiskPenalty: 0,
            moderateRiskPenalty: 0,
            sugarPenalty: 0, sodiumPenalty: 0, transFatPenalty: 0,
            bonusNoColors: 0, bonusNoPreservatives: 0
        };

        // -0.5 per additive beyond first 3
        if (detectedAdditives.length > 3) {
            scoreBreakdown.additiveCountPenalty = (detectedAdditives.length - 3) * 0.5;
            score -= scoreBreakdown.additiveCountPenalty;
        }

        detectedAdditives.forEach(a => {
            // Case-insensitive risk check
            const risk = (a.riskLevel || 'Low').toLowerCase();
            if (risk === 'high') {
                score -= 2;
                scoreBreakdown.highRiskPenalty += 2;
            } else if (risk === 'medium') {
                score -= 1;
                scoreBreakdown.moderateRiskPenalty += 1;
            }
        });

        if (nutritionFlags.highSugar) { score -= 1; scoreBreakdown.sugarPenalty = 1; }
        if (nutritionFlags.highSodium) { score -= 1; scoreBreakdown.sodiumPenalty = 1; }
        if (nutritionFlags.transFatPresent) { score -= 1; scoreBreakdown.transFatPenalty = 1; }

        const hasColors = detectedAdditives.some(a => a.category === 'Color');
        const hasPreservatives = detectedAdditives.some(a => a.category === 'Preservative');

        if (!hasColors) { score += 0.5; scoreBreakdown.bonusNoColors = 0.5; }
        if (!hasPreservatives) { score += 0.5; scoreBreakdown.bonusNoPreservatives = 0.5; }

        // Clamp score
        score = Math.max(1, Math.min(10, score));

        // 5. Warnings & Personalization
        const warnings = [];
        const highRiskForUser = [];

        const userHealthTags = healthProfile.map(t => t ? t.toLowerCase() : '');
        const userSensitivityTags = sensitivityProfile.map(t => t ? t.toLowerCase() : '');

        detectedAdditives.forEach(a => {
            let isRiskyForUser = false;

            if (a.sensitivityTags) {
                a.sensitivityTags.forEach(tag => {
                    const tagLower = tag.toLowerCase();
                    const matchesHealth = userHealthTags.some(u => u && (u.includes(tagLower) || tagLower.includes(u)));
                    const matchesSens = userSensitivityTags.some(u => u && (u.includes(tagLower) || tagLower.includes(u)));

                    if (matchesHealth || matchesSens) {
                        isRiskyForUser = true;
                        // Use groupWarnings from DB map
                        const warningMsg = (a.groupWarnings && a.groupWarnings.get(tag)) ||
                            `Caution: ${a.name} is linked to ${tag}.`;
                        warnings.push(warningMsg);
                    }
                });
            }

            if (isRiskyForUser) {
                highRiskForUser.push(a.name);
            }
        });

        // 6. Frequency Recommendation
        let frequency = 'Okay for regular use';
        if (score < 4 || highRiskForUser.length > 0) frequency = 'Avoid / Rare treat';
        else if (score < 7) frequency = 'Once a week';
        else if (score < 9) frequency = '2-3 times per week';

        // 7. Alternatives
        let alternatives = [];
        const allAlternativeCats = await Alternative.find({});
        allAlternativeCats.forEach(cat => {
            if (normalizedText.includes(cat.category.toLowerCase())) {
                alternatives.push(...cat.alternatives);
            }
        });

        return {
            success: true,
            safetyScore: score,
            scoreBreakdown,
            detectedAdditives: detectedAdditives.map(a => ({
                code: a.code,
                name: a.name,
                riskLevel: a.riskLevel,
                category: a.category,
                description: a.description || a.notes,
                groupWarnings: a.groupWarnings // Expose warnings map if needed
            })),
            warningsForUser: [...new Set(warnings)],
            highRiskForUser: [...new Set(highRiskForUser)],
            frequencyRecommendation: frequency,
            alternatives: alternatives.slice(0, 3)
        };
    } catch (error) {
        console.error("Analysis Service Error:", error);
        throw error; // Propagate to route handler
    }
};

module.exports = { analyzeProduct };

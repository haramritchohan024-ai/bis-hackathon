import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Results = () => {
    const { state } = useLocation();

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">No results found</h2>
                    <Link to="/scan" className="mt-4 text-green-600 underline">Scan a product first</Link>
                </div>
            </div>
        );
    }

    const { score, detectedAdditives = [], warnings = [], alternatives = [], frequency, scoreBreakdown, highRiskForUser, extractedText, debugMode } = state;

    // Safety check for detectedAdditives being null/undefined
    const additives = detectedAdditives || [];

    const getScoreColor = (s) => {
        if (s >= 8) return 'text-green-600 border-green-500';
        if (s >= 5) return 'text-yellow-600 border-yellow-500';
        return 'text-red-600 border-red-500';
    };

    const getScoreBg = (s) => {
        if (s >= 8) return 'bg-green-50';
        if (s >= 5) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Score Section */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between border-l-8 ${getScoreBg(score).replace('bg-', 'border-')}`}
                >
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Safety Score</h2>
                        <div className={`text-8xl font-black ${getScoreColor(score).split(' ')[0]}`}>
                            {score.toFixed(1)}
                            <span className="text-4xl text-gray-300">/10</span>
                        </div>
                        <p className="text-gray-600 font-medium mt-2">{frequency}</p>
                    </div>

                    <div className="flex-1 md:ml-12 border-l pl-0 md:pl-12 border-gray-100">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">Summary</h3>
                        <p className="text-gray-600 mb-4">
                            This product contains <strong className="text-gray-900">{detectedAdditives.length} additives</strong>.
                            {textWarningSummary(score)}
                        </p>

                        {/* Warnings Box */}
                        {warnings.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="flex items-center text-red-700 font-bold mb-2">
                                    <AlertTriangle size={18} className="mr-2" /> Personalized Alerts
                                </h4>
                                <ul className="space-y-1">
                                    {warnings.map((w, i) => (
                                        <li key={i} className="text-sm text-red-800 flex items-start">
                                            <span className="mr-2">•</span> {w.replace('⚠️', '')}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Additives List */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <Info className="mr-2 text-blue-500" /> Detected Additives
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {additives.length === 0 ? (
                            <div className="col-span-2 text-center text-gray-500 italic py-8 bg-white rounded-lg">
                                No additives detected!
                            </div>
                        ) : (
                            additives.map(additive => (
                                <div key={additive.code} className="bg-white rounded-xl shadow p-6 border-t-4 border-gray-200 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg
                                        ${additive.riskLevel === 'High' ? 'bg-red-500' : additive.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}
                                    `}>
                                        {additive.riskLevel || 'Unknown'} Risk
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{additive.name}</h4>
                                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{additive.code}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-semibold text-gray-700">Used as:</span> {additive.category}
                                    </p>
                                    <p className="text-sm text-gray-500 italic mb-3">
                                        "{additive.notes}"
                                    </p>
                                    {additive.sensitivityTags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {additive.sensitivityTags.map(tag => (
                                                <span key={tag} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Alternatives Section */}
                {alternatives.length > 0 && (
                    <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                        <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                            <CheckCircle className="mr-2" /> Better Alternatives
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {alternatives.map((alt, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-bold text-green-800">{alt.name}</h5>
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{alt.score}/10</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{alt.whyBetter}</p>
                                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">{alt.additiveReduction}</span>
                                        <span>Cost: {alt.cost}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Debug Panel */}
                {debugMode && (
                    <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-xs overflow-x-auto shadow-inner border border-gray-700">
                        <h4 className="text-white font-bold mb-2 border-b border-gray-700 pb-2">Developer Debug Info</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong className="text-gray-500">Extracted Text:</strong>
                                <pre className="whitespace-pre-wrap mt-1 text-gray-300 bg-gray-800 p-2 rounded max-h-32 overflow-y-auto">{extractedText}</pre>
                            </div>
                            <div>
                                <strong className="text-gray-500">Score Breakdown:</strong>
                                <pre className="mt-1 text-blue-300">{JSON.stringify(scoreBreakdown, null, 2)}</pre>
                            </div>
                        </div>
                        <div className="mt-4">
                            <strong className="text-gray-500">High Risk Identified:</strong>
                            <span className="ml-2 text-red-400">{JSON.stringify(highRiskForUser)}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-center pt-8 pb-12">
                    <Link to="/scan" className="bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow hover:bg-black transition">
                        Scan Another Label
                    </Link>
                </div>

            </div>
        </div>
    );
};

function textWarningSummary(score) {
    if (score >= 8) return "Seems mostly safe for regular consumption.";
    if (score >= 5) return "Use in moderation. Contains some additives of concern.";
    return "High processing detected. Best to limit consumption.";
}

export default Results;

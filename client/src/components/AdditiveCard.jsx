import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const AdditiveCard = ({ additive, delay = 0 }) => {
    const riskColor = {
        'High': 'bg-red-50 text-red-700 border-red-100',
        'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-100',
        'Low': 'bg-green-50 text-green-700 border-green-100',
    }[additive.riskLevel] || 'bg-gray-50';

    const cleanName = additive.name.split('(')[0]; // Simplified name for title

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            className="group relative bg-white rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${riskColor}`}>
                    {additive.riskLevel} Risk
                </div>
                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    {additive.code}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                {cleanName}
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">{additive.category}</p>

            <div className="space-y-3">
                <div className="bg-gray-50/80 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed border border-gray-100">
                    {additive.description}
                </div>

                {additive.sensitivityTags && additive.sensitivityTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {additive.sensitivityTags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-600">
                                <AlertCircle size={10} className="mr-1.5" /> {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdditiveCard;

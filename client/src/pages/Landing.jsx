import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, ShieldCheck, Heart } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Hero Section */}
            <header className="relative pt-20 pb-32 flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="container relative mx-auto px-6 z-10 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 text-left mb-12 md:mb-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-green-800 uppercase bg-green-100 rounded-full">
                                AI-Powered Food Intelligence
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 mb-6 tracking-tight">
                                Know What You <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                                    Really Eat.
                                </span>
                            </h1>
                            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                                Stop guessing. Scan any packaged food to instantly decode additives, E-numbers, and health risks tailored to your body.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/scan" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full shadow-lg shadow-gray-300 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                    <Scan size={20} /> Scan Label
                                </Link>
                                <Link to="/about" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center">
                                    How it Works
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image / Graphic */}
                    <div className="w-full md:w-1/2 flex justify-center relative">
                        <motion.img
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Healthy Food Bowl"
                            className="rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 w-4/5 md:w-full max-w-md object-cover md:rotate-3 hover:rotate-0 transition-transform duration-500"
                        />
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-5 md:right-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
                        >
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Safety Score</p>
                                <p className="text-xl font-bold text-gray-900">9.2/10</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-5 md:left-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
                        >
                            <div className="bg-red-100 p-2 rounded-full text-red-600">
                                <Heart size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Alert</p>
                                <p className="text-sm font-bold text-gray-900">High Sodium</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Premium Features Section */}
            <section className="py-20 bg-white rounded-t-[50px] -mt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why LabelLens?</h2>
                        <p className="text-gray-500">We translate complex chemical codes into simple, actionable health insights.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6">
                                <Scan size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Decoding</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Our OCR technology reads ingredients lists in seconds, identifying every E-number and hidden additive.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-500 mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scoring</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Get a simple 1-10 safety score based on scientific research, not just marketing claims.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 mb-6">
                                <Heart size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Alerts</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Set your profile (Vegan, Gluten-Free, Pregnant, etc.) to get warnings that matter to YOU.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;

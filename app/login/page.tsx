"use client";

import { motion } from "framer-motion";
import { login, signup } from "./actions";
import { useState, Suspense, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D95204]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D95204]/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl z-10 mx-4"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        CNP <span className="text-[#D95204]">BOT</span>
                    </h1>
                    <p className="text-white/50 text-sm">
                        {isLogin ? "Welcome back. Please login to your account." : "Join us today. Create your account."}
                    </p>
                </div>

                <Suspense fallback={<div className="h-4" />}>
                    <ErrorDisplay />
                </Suspense>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 ml-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="name@company.com"
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#D95204]/50 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#D95204]/50 transition-all pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button
                            formAction={(formData) => startTransition(() => (isLogin ? login(formData) : signup(formData)))}
                            disabled={isPending}
                            className="w-full py-4 bg-[#D95204] hover:bg-[#BF4903] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#D95204]/20 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin mr-2" size={20} />
                            ) : null}
                            {isLogin ? "Sign In" : "Sign Up"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full py-2 text-white/40 text-sm hover:text-white transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                        &copy; 2024 CNP PARTNERS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function ErrorDisplay() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    if (!error) return null;

    return (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { login, signup } from "./actions";
import { useState, Suspense, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, KeyRound } from "lucide-react";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleToggleMode = () => {
        setIsLogin(!isLogin);
        setClientError(null);
    };

    const handleFormSubmit = (formData: FormData) => {
        setClientError(null);
        const password = formData.get("password") as string;

        if (password.length < 6) {
            setClientError("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        if (!isLogin) {
            const confirmPassword = formData.get("confirmPassword") as string;
            if (password !== confirmPassword) {
                setClientError("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        startTransition(() => {
            if (isLogin) {
                login(formData);
            } else {
                signup(formData);
            }
        });
    };

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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        CNP <span className="text-[#D95204]">BOT</span>
                    </h1>
                    <p className="text-white/50 text-sm">
                        {isLogin ? "다시 오신 걸 환영합니다. 계정으로 로그인해 주세요." : "지금 가입하고 계정을 만들어 보세요."}
                    </p>
                </div>

                <Suspense fallback={<div className="h-4" />}>
                    <StatusDisplay clientError={clientError} />
                </Suspense>

                <form action={handleFormSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 ml-1">
                            이메일
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="예: name@company.com"
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#D95204]/50 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider">
                                비밀번호
                            </label>
                            {isLogin && (
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(true)}
                                    className="text-xs text-[#D95204] hover:underline transition-colors"
                                >
                                    비밀번호 찾기
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="•••••••• (최소 6자)"
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

                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative"
                        >
                            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 ml-1">
                                비밀번호 확인
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#D95204]/50 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-3 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-[#D95204] hover:bg-[#BF4903] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#D95204]/20 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin mr-2" size={20} />
                            ) : null}
                            {isLogin ? "로그인" : "회원가입"}
                        </button>

                        <button
                            type="button"
                            onClick={handleToggleMode}
                            className="w-full py-2 text-white/40 text-sm hover:text-white transition-colors"
                        >
                            {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
                        </button>
                    </div>
                </form>

                {/* Password Reset Modal / Dialog */}
                {showResetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-xl text-center"
                        >
                            <KeyRound className="mx-auto text-[#D95204] mb-3" size={36} />
                            <h3 className="text-lg font-bold text-white mb-2">비밀번호 찾기 안내</h3>
                            <p className="text-sm text-white/60 mb-6 leading-relaxed">
                                비밀번호 재설정 기능은 준비 중입니다. 관리자에게 문의하시거나 지원팀으로 메일을 남겨주세요.
                            </p>
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                            >
                                닫기
                            </button>
                        </motion.div>
                    </div>
                )}

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                        &copy; 2024 CNP PARTNERS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function StatusDisplay({ clientError }: { clientError: string | null }) {
    const searchParams = useSearchParams();
    const serverError = searchParams.get("error");
    const registered = searchParams.get("registered");

    const errorMessage = clientError || serverError;

    if (registered === "true" && !errorMessage) {
        return (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start space-x-3 text-emerald-400">
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold mb-0.5">회원가입 신청이 완료되었습니다!</p>
                    <p className="text-emerald-300/80 text-xs">
                        입력하신 이메일로 인증 메일이 발송되었습니다. 메일을 확인하신 후 로그인해 주세요.
                    </p>
                </div>
            </div>
        );
    }

    if (!errorMessage) return null;

    return (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
        </div>
    );
}


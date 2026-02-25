'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    role: 'internal' | 'external';
    initialMessage?: string;
}

export default function ChatInterface({ role, initialMessage }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Handle initial message from props
    useEffect(() => {
        // Reset messages when role changes
        setMessages([]);
        if (initialMessage) {
            handleChat(initialMessage);
        }
    }, [role, initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChat = async (userMessage: string) => {
        setIsLoading(true);
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    role,
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error: any) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: error.message || '죄송합니다. 오류가 발생했습니다.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        await handleChat(userMessage);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-2">
                        <Bot size={48} className="opacity-20" />
                        <p className="text-sm font-medium">플립패스 스마트 챗봇이 도와드리겠습니다.</p>
                    </div>
                )}
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex space-x-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-point/10 dark:bg-point/30'
                                    }`}>
                                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-point" />}
                                </div>
                                <div
                                    className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-none'
                                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-white/10'
                                        }`}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {m.content.split(/(\[.*?\])/).map((part, index) => {
                                        if (part.startsWith('[전화 연결:') && part.endsWith(']')) {
                                            const phone = part.replace('[전화 연결:', '').replace(']', '').trim();
                                            return (
                                                <a key={index} href={`tel:${phone}`} className="inline-flex items-center space-x-2 bg-point text-white px-4 py-2 rounded-xl mt-3 font-bold hover:opacity-90 transition-all no-underline">
                                                    <span>📞 담당 엔지니어 전화 연결</span>
                                                </a>
                                            );
                                        }
                                        if (part.startsWith('[결재 기안 바로가기]')) {
                                            return (
                                                <button key={index} className="inline-flex items-center space-x-2 bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-2 rounded-xl mt-3 font-bold hover:opacity-90 transition-all">
                                                    <span>📄 결재 기안 바로가기</span>
                                                </button>
                                            );
                                        }
                                        return part;
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-point/10 dark:bg-point/30 flex items-center justify-center">
                                <Loader2 size={16} className="text-point animate-spin" />
                            </div>
                            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-400 rounded-tl-none">
                                생각 중...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-zinc-50 dark:bg-black/20 border-t border-zinc-200 dark:border-zinc-800">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="w-full p-4 pr-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-point transition-all dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-80 disabled:opacity-30 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  MessageSquare,
  Briefcase,
  Library as LibraryIcon,
  User,
  Mic,
  LayoutGrid,
  Activity,
  Calendar,
  Package,
  FileText,
  BookOpen,
  Archive,
  Wallet,
  CalendarClock,
  Settings,
  ChevronRight,
  Plus,
  Bot,
  Loader2,
  AlertCircle,
  Terminal,
  Gavel,
  Users,
  Cpu,
  Shield,
  Zap,
  CheckCircle2,
  Network,
  HardDrive,
  Share2,
  Search,
  HelpCircle,
  Lock,
  ScrollText,
  Scale,
  UserCheck,
  CreditCard,
  Heart,
  GraduationCap,
  PenTool,
  Sparkles,
  Bell,
  History,
  ArrowUpRight,
  MoreVertical,
  Clock,
  Layers,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  Mail,
  Smartphone,
  ShieldCheck,
  Sun,
  Moon,
  Camera,
  CheckSquare,
  Radio,
  ListTodo,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from '@/components/ChatInterface';
import { createClient } from '@/utils/supabase/client';
import { logout, updatePassword, updatePreferences } from './login/actions';

type Tab = 'home' | 'work' | 'library' | 'my';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Modal states moved from MyView
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    marketing: false,
    activity: true
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user?.user_metadata?.preferences) {
        setTheme(user.user_metadata.preferences.theme || 'dark');
        setPrefs({
          email: user.user_metadata.preferences.email ?? true,
          push: user.user_metadata.preferences.push ?? true,
          marketing: user.user_metadata.preferences.marketing ?? false,
          activity: user.user_metadata.preferences.activity ?? true
        });
      }
    });
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const currentPrefs = user?.user_metadata?.preferences || {};
    await updatePreferences({ ...currentPrefs, theme: newTheme });
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    startTransition(async () => {
      const result = await updatePreferences(newPrefs);
      if (!result.success) {
        setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다.' });
      }
    });
  };

  const handlePasswordChange = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result.success) {
        setMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || '오류가 발생했습니다.' });
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'work':
        return <WorkView setIsGlobalChatOpen={setIsGlobalChatOpen} />;
      case 'library':
        return <LibraryView />;
      case 'my':
        return (
          <MyView
            user={user}
            onThemeOpen={() => setIsThemeModalOpen(true)}
            onPasswordOpen={() => setIsPasswordModalOpen(true)}
            onNotifOpen={() => setIsNotifModalOpen(true)}
          />
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 fixed left-0 top-0 bottom-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col p-6 z-20">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-point rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight">CNP <span className="text-point">Bot</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarNavItem
            icon={<MessageSquare size={18} />}
            label="홈 (Chat)"
            active={activeTab === 'home'}
            onClick={() => { setActiveTab('home'); setIsGlobalChatOpen(false); }}
          />
          <SidebarNavItem
            icon={<Briefcase size={18} />}
            label="워크 (Work)"
            active={activeTab === 'work'}
            onClick={() => setActiveTab('work')}
          />
          <SidebarNavItem
            icon={<LibraryIcon size={18} />}
            label="라이브러리"
            active={activeTab === 'library'}
            onClick={() => setActiveTab('library')}
          />
          <SidebarNavItem
            icon={<User size={18} />}
            label="마이 (My)"
            active={activeTab === 'my'}
            onClick={() => setActiveTab('my')}
          />
        </nav>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center space-x-3 p-2 rounded-xl group hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-500">
            <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-sm font-medium">설정</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-screen relative">
        <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
          <h1 className="text-lg font-bold capitalize">
            {activeTab === 'home' && '대화'}
            {activeTab === 'work' && '현장 및 업무 관리'}
            {activeTab === 'library' && '지식 베이스'}
            {activeTab === 'my' && '개인 정보'}
          </h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="사용자 메뉴"
              >
                <User size={16} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-3"
                    >
                      <div className="px-4 pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">계정 설정</p>
                      </div>
                      <UserMenuBtn icon={<Settings size={14} />} label="비밀번호 변경" onClick={() => { setIsPasswordModalOpen(true); setIsUserMenuOpen(false); }} />
                      <UserMenuBtn icon={<Bell size={14} />} label="알림 설정" onClick={() => { setIsNotifModalOpen(true); setIsUserMenuOpen(false); }} />
                      <UserMenuBtn icon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} label="테마 모드" onClick={() => { setIsThemeModalOpen(true); setIsUserMenuOpen(false); }} />
                      <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
                      <UserMenuBtn icon={<Plus className="rotate-45" size={14} />} label="로그아웃" dangerous onClick={() => { logout(); setIsUserMenuOpen(false); }} />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Chat Overlay */}
        <AnimatePresence>
          {isGlobalChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 bottom-20 md:bottom-28 md:right-10 md:left-auto md:w-[450px] z-50 shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
              <div className="bg-point p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <MessageSquare size={18} />
                  <span className="font-bold">CNP 퀵 헬프</span>
                </div>
                <button onClick={() => setIsGlobalChatOpen(false)} className="hover:rotate-90 transition-transform">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="h-[500px] bg-white dark:bg-zinc-950">
                <ChatInterface role="internal" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsGlobalChatOpen(!isGlobalChatOpen)}
          className={`fixed right-6 bottom-24 md:bottom-10 md:right-10 w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center text-white transition-all duration-300 transform active:scale-95 ${isGlobalChatOpen
            ? 'bg-zinc-900 dark:bg-zinc-800'
            : 'bg-point hover:scale-110'
            }`}
        >
          {isGlobalChatOpen ? (
            <Plus className="rotate-45" size={32} />
          ) : (
            <div className="relative">
              <motion.div
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Bot size={32} />
              </motion.div>
            </div>
          )}
        </button>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around z-30 px-6">
        <MobileNavItem
          icon={<MessageSquare size={20} />}
          label="홈"
          active={activeTab === 'home'}
          onClick={() => { setActiveTab('home'); setIsGlobalChatOpen(false); }}
        />
        <MobileNavItem
          icon={<Briefcase size={20} />}
          label="워크"
          active={activeTab === 'work'}
          onClick={() => setActiveTab('work')}
        />
        <MobileNavItem
          icon={<LibraryIcon size={20} />}
          label="라이브러리"
          active={activeTab === 'library'}
          onClick={() => setActiveTab('library')}
        />
        <MobileNavItem
          icon={<User size={20} />}
          label="마이"
          active={activeTab === 'my'}
          onClick={() => setActiveTab('my')}
        />
      </nav>

      {/* Global Modals */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
                <h3 className="font-bold text-lg">비밀번호 변경</h3>
                <button
                  onClick={() => { setIsPasswordModalOpen(false); setMessage(null); }}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="p-8">
                {message ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'
                      }`}
                  >
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium">{message.text}</p>
                  </motion.div>
                ) : null}

                <form action={handlePasswordChange} className="space-y-6">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                      새로운 비밀번호
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-point transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    비밀번호 업데이트
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        prefs={prefs}
        handlePreferenceChange={handlePreferenceChange}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        setTheme={handleThemeChange}
      />
    </div>
  );
}

// --- Views ---

function HomeView() {
  const [initialMsg, setInitialMsg] = useState<string | undefined>(undefined);

  const handleQuickMenu = (text: string) => {
    setInitialMsg(text);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-[calc(100vh-180px)]">
      <div className="flex-1 flex flex-col min-h-0">
        <ChatInterface role="internal" initialMessage={initialMsg} />
      </div>

      {/* Floating Action Buttons / Quick Menu Overlay */}
      <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        <QuickMenuButton label="자주 묻는 질문" onClick={() => handleQuickMenu("자주 묻는 질문")} />
        <QuickMenuButton label="인사 규정 문의" onClick={() => handleQuickMenu("인사 규정 문의")} />
        <QuickMenuButton label="장비 신청 방법" onClick={() => handleQuickMenu("장비 신청 방법")} />
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-point flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <Mic size={20} />
        </div>
      </div>
    </div>
  );
}

function WorkView({ setIsGlobalChatOpen }: { setIsGlobalChatOpen: (open: boolean) => void }) {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [activeActionToast, setActiveActionToast] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'legal'>('legal');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isDashSettingsOpen, setIsDashSettingsOpen] = useState(false);
  const [aiBrief, setAiBrief] = useState('');
  const [contractForm, setContractForm] = useState({
    partyA: '로폼 주식회사',
    partyB: '아미쿠스렉스 주식회사',
    serviceTitle: '시스템 운영 및 유지보수',
    date: '2026년 02월 25일',
    fee: '10,000,000',
    serviceDetail: '소프트웨어 개발 및 현장 운영 지원 전반'
  });

  const handleAiSmartFill = () => {
    if (!aiBrief) return;
    setIsAiGenerating(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setContractForm({
        partyA: 'CNP 파트너스',
        partyB: '태양 이벤트 기획',
        serviceTitle: '2026 모빌리티 쇼 현장 운영 및 티켓팅 시스템 구축',
        date: '2026년 03월 15일',
        fee: '25,000,000',
        serviceDetail: '현장 키오스크 12대 운영, 참관객 등록 API 연동 및 데이터 분석 보고서 제공'
      });
      setIsAiGenerating(false);
    }, 2000);
  };

  const categories = [
    { id: 'legal', label: '법무 파트', icon: <Gavel size={14} /> },
  ];


  const handleQuickAction = (label: string) => {
    setSelectedAction(label);
  };

  const handleActionSubmit = (label: string) => {
    setSelectedAction(null);
    setActiveActionToast(`${label} 처리가 완료되었습니다.`);
    setTimeout(() => setActiveActionToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-20 relative">
      {/* Category Tabs */}
      <div className="flex items-center space-x-1 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl w-fit mb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === cat.id
              ? 'bg-white dark:bg-zinc-800 text-point shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >


          {activeCategory === 'legal' && (
            <div className="space-y-6">
              {/* Legal Stats Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-point/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="flex items-center space-x-5 relative">
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-point to-orange-400 flex items-center justify-center text-white shadow-xl shadow-point/20">
                    <Scale size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight">법무 대시보드</h2>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-zinc-400 font-medium tracking-wide">
                      <span className="flex items-center"><UserCheck size={12} className="mr-1" /> 홍길동 매니저</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1" /> 최근 접속: 10:23:44</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 relative">
                  <button
                    onClick={() => setIsNotifDrawerOpen(true)}
                    className="relative w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-all group"
                  >
                    <Bell size={20} className="text-zinc-500 group-hover:text-point transition-colors" />
                    <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 text-[8px] flex items-center justify-center text-white font-black">5</span>
                  </button>
                  <button
                    onClick={() => setIsDashSettingsOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 hover:rotate-90 transition-all"
                  >
                    <Settings size={20} className="text-zinc-500" />
                  </button>
                </div>
              </div>
              {/* AI 원스톱 계약 생성 Banner - Moved to top */}
              <div
                onClick={() => setIsContractModalOpen(true)}
                className="p-8 bg-point rounded-[40px] text-white shadow-2xl shadow-point/30 relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-[24px] bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl tracking-tighter">AI 원스톱 계약 생성</h4>
                    <p className="text-sm text-white/80 mt-1 font-medium max-w-md leading-relaxed">복잡한 조항 구성부터 법무 검토용 초안까지, AI가 즉시 제안합니다.</p>
                  </div>
                </div>
                <div className="relative z-10 w-full md:w-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsContractModalOpen(true); }}
                    className="w-full md:px-10 py-5 bg-white text-point rounded-3xl font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>신규 계약 제안하기</span>
                  </button>
                </div>
              </div>

              <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatBox icon={<FileText className="text-blue-500" size={18} />} label="내부 결제 진행" value="100건" />
                <StatBox icon={<Layers className="text-zinc-500" size={18} />} label="요청자 검토 중" value="10건" />
                <StatBox icon={<CheckCircle2 className="text-emerald-500" size={18} />} label="법무 검토 완료" value="23건" />
                <StatBox icon={<Shield className="text-amber-500" size={18} />} label="인감 사용 신청" value="45건" />
                <StatBox icon={<PenTool className="text-point" size={18} />} label="서명 진행 중" value="3건" />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: Drafts & References */}
                <div className="md:col-span-4 space-y-6">
                  <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="font-black text-sm flex items-center space-x-2">
                        <History size={16} className="text-point" />
                        <span>임시 저장 리스트</span>
                      </h3>
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-point uppercase tracking-widest transition-colors">More</button>
                    </div>
                    <div className="p-4 space-y-3">
                      <LegalDraftItem title="계약 연장 합의서(전산팀)" date="24.08-01" />
                      <LegalDraftItem title="신규 벤더 보안 서약서" date="24.08-01" />
                      <LegalDraftItem title="현장 운영 대행 용역" date="24.08-01" />
                    </div>
                  </section>

                  <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="font-black text-sm flex items-center space-x-2">
                        <Share2 size={16} className="text-point" />
                        <span>참조 중 요청</span>
                      </h3>
                      <span className="text-xs font-black text-point bg-point/10 px-2 py-0.5 rounded-full">24</span>
                    </div>
                    <div className="p-4 space-y-3 font-medium">
                      <LegalApprovalItem title="오피스 임대차 계약" manager="김법무" date="2024-08-01" isNew />
                      <LegalApprovalItem title="데이터 센터 이용 계약" manager="이검토" date="2024-08-01" />
                    </div>
                  </section>
                </div>

                {/* Center Column: Global Review List & Participating Projects */}
                <div className="md:col-span-5 space-y-6">
                  <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                      <h3 className="font-black text-sm flex items-center space-x-2 tracking-tight">
                        <LayoutGrid size={16} className="text-point" />
                        <span>나의 결제 대기 건</span>
                      </h3>
                      <button className="text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-point transition-all">더보기 <ChevronRight size={10} className="inline" /></button>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-12 px-6 py-4 border-b border-zinc-50 dark:border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <div className="col-span-7">계약명 / 문서번호</div>
                        <div className="col-span-3 text-center">업무 담당자</div>
                        <div className="col-span-2 text-right">기한</div>
                      </div>
                      <div className="divide-y divide-zinc-50 dark:divide-zinc-800 px-4">
                        <LegalMainRowItem title="클라우드 인프라 라이선스" id="L-2024-042" manager="전산관리팀" date="2024-08-01" isNew />
                        <LegalMainRowItem title="사옥 리모델링 인테리어" id="L-2024-039" manager="총무팀" date="2024-08-01" isNew />
                        <LegalMainRowItem title="연말 이벤트 대행 정산" id="L-2024-035" manager="이벤트실" date="2024-08-01" />
                        <LegalMainRowItem title="전략 제휴 비밀유지" id="L-2024-031" manager="전략기획팀" date="2024-08-01" />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                      <h3 className="font-black text-sm flex items-center space-x-2 tracking-tight">
                        <Briefcase size={16} className="text-point" />
                        <span>참여 프로젝트</span>
                      </h3>
                      <button className="text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-point transition-all">더보기 <ChevronRight size={10} className="inline" /></button>
                    </div>
                    <div className="flex-1 min-h-[250px] flex flex-col">
                      <div className="grid grid-cols-12 px-6 py-4 border-b border-zinc-50 dark:border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <div className="col-span-7">프로젝트명</div>
                        <div className="col-span-3 text-center">등록자</div>
                        <div className="col-span-2 text-right">등록일</div>
                      </div>
                      <div className="divide-y divide-zinc-50 dark:divide-zinc-800 px-4 flex-1">
                        <LegalProjectItem title="2026 글로벌 모빌리티 쇼" registar="김운영" date="2024-08-01" isNew />
                        <LegalProjectItem title="전사적 AI 봇 도입 프로젝트" registar="이개발" date="2024-08-01" />
                        <LegalProjectItem title="판교 오피스 이전 TF" registar="박총무" date="2024-08-01" />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Status & Direct Actions */}
                <div className="md:col-span-3 space-y-6">
                  <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-sm">나의 요청 현황</h3>
                      <span className="text-xs font-black text-point">24</span>
                    </div>
                    <div className="space-y-4">
                      <LegalStatusCard label="검토 담당자 배정 중" count={5} active />
                      <LegalStatusCard label="법무 검토 완료" count={12} color="text-emerald-500" />
                      <LegalStatusCard label="요청자 검토 중" count={4} color="text-purple-500" />
                      <LegalStatusCard label="전자서명 진행 중" count={3} color="text-blue-500" />
                    </div>
                  </section>

                </div>
              </div>

              {/* Notification Drawer Pop-over */}
              <AnimatePresence>
                {isNotifDrawerOpen && (
                  <div className="fixed inset-0 z-[120] flex justify-end">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsNotifDrawerOpen(false)}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="relative w-full max-w-sm bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="text-xl font-black tracking-tighter">알림 뉴스피드</h3>
                        <button onClick={() => setIsNotifDrawerOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <div className="flex items-center justify-between px-4 py-2 mb-4">
                          <button className="text-[10px] font-black text-point flex items-center space-x-1">
                            <CheckCircle size={12} />
                            <span>모두 읽음 표시</span>
                          </button>
                          <span className="text-[10px] font-bold text-zinc-400">지난 14일간 알림</span>
                        </div>
                        <LegalNotifItem title="수출 물품 공급 계약서 검토가 완료되었습니다." date="24.09.01 13:44" isNew />
                        <LegalNotifItem title="현대모비스 운영 대행 협의 요청이 도착했습니다." date="24.09.01 13:20" isNew />
                        <LegalNotifItem title="2026 전략 제휴 NDA의 수탁사 배정이 완료되었습니다." date="24.08.31 11:05" />
                        <LegalNotifItem title="참관객 개인정보 수집 동의서 파기 마감 3일 전입니다." date="24.08.30 09:12" />
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Dashboard Settings Modal */}
              <AnimatePresence>
                {isDashSettingsOpen && (
                  <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white dark:bg-zinc-900 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-800/20">
                        <h3 className="font-black text-lg">대시보드 레이아웃 설정</h3>
                        <button onClick={() => setIsDashSettingsOpen(false)} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                          <X size={20} />
                        </button>
                      </div>
                      <div className="p-8 space-y-6">
                        <div className="space-y-4">
                          <SettingsToggle label="검토 현황 통계 (Stats)" defaultChecked />
                          <SettingsToggle label="나의 요청 현황 (Requests)" defaultChecked />
                          <SettingsToggle label="결제 대기 중 요청 (Approvals)" defaultChecked />
                          <SettingsToggle label="임시 저장 리스트 (Drafts)" />
                          <SettingsToggle label="참조 프로젝트 알림" />
                        </div>
                        <div className="flex gap-4 pt-4 mt-6">
                          <button onClick={() => setIsDashSettingsOpen(false)} className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-sm font-bold">취소</button>
                          <button onClick={() => setIsDashSettingsOpen(false)} className="flex-1 py-4 bg-point text-white rounded-2xl text-sm font-black shadow-lg shadow-point/20">설정 저장</button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* AI Contract Generator Modal */}
          <AnimatePresence>
            {isContractModalOpen && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="bg-zinc-50 dark:bg-zinc-950 rounded-[40px] w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-point/10 flex items-center justify-center text-point">
                        <ScrollText size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl tracking-tight">AI 스마트 표준계약서 생성기</h3>
                        <p className="text-xs text-zinc-400 font-medium tracking-wide mt-0.5 uppercase">Contract Draft Automation v1.0</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsContractModalOpen(false)}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group"
                    >
                      <Plus className="rotate-45 group-hover:scale-110 transition-transform" size={28} />
                    </button>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* Input Area */}
                    <div className="w-full md:w-1/3 border-r border-zinc-200 dark:border-zinc-800 p-8 space-y-8 overflow-y-auto bg-white dark:bg-zinc-900/50">
                      {/* NEW: AI Smart Input Section */}
                      <div className="p-5 bg-point/5 border border-point/20 rounded-3xl space-y-4">
                        <div className="flex items-center space-x-2">
                          <Bot size={20} className="text-point animate-bounce" />
                          <h4 className="font-black text-sm text-point">AI 매직 입력 (Smart Fill)</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                          "CNP와 태양기획의 2500만원 규모 전시회 운영 계약 만들어줘" 같이 짧게 입력해보세요.
                        </p>
                        <textarea
                          placeholder="계약의 핵심 내용을 입력하세요..."
                          value={aiBrief}
                          onChange={(e) => setAiBrief(e.target.value)}
                          className="w-full h-24 bg-white dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-point/30 outline-none resize-none shadow-inner"
                        />
                        <button
                          onClick={handleAiSmartFill}
                          disabled={isAiGenerating || !aiBrief}
                          className="w-full py-3 bg-point text-white rounded-xl font-black text-xs shadow-lg shadow-point/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:scale-100 transition-all hover:scale-[1.02]"
                        >
                          {isAiGenerating ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>AI가 조항 분석 중...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              <span>AI 초안 자동 완성하기</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm flex items-center space-x-2">
                            <UserCheck size={16} className="text-point" />
                            <span>1. 계약 당사자 정보</span>
                          </h4>
                          <span className="text-[10px] font-bold text-zinc-300">1 / 4</span>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">위탁자 (갑)</label>
                            <input
                              type="text"
                              value={contractForm.partyA}
                              onChange={(e) => setContractForm({ ...contractForm, partyA: e.target.value })}
                              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point/30 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">수탁자 (을)</label>
                            <input
                              type="text"
                              value={contractForm.partyB}
                              onChange={(e) => setContractForm({ ...contractForm, partyB: e.target.value })}
                              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point/30 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm flex items-center space-x-2">
                            <Scale size={16} className="text-point" />
                            <span>2. 업무 범위 및 대금</span>
                          </h4>
                          <span className="text-[10px] font-bold text-zinc-300">2 / 4</span>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">서비스명</label>
                            <input
                              type="text"
                              value={contractForm.serviceTitle}
                              onChange={(e) => setContractForm({ ...contractForm, serviceTitle: e.target.value })}
                              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point/30 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">계약 금액 (VAT 별도)</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={contractForm.fee}
                                onChange={(e) => setContractForm({ ...contractForm, fee: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-point/30 outline-none transition-all"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">KRW</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button className="w-full bg-point text-white py-4 rounded-2xl font-bold shadow-lg shadow-point/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                          <PenTool size={18} />
                          <span>협업 플랫폼 기반 초안 생성</span>
                        </button>
                        <p className="text-center text-[10px] text-zinc-400 mt-4 leading-relaxed font-medium">
                          생성된 초안은 법무팀 검토용 협업 링크로 자동 공유됩니다.
                        </p>
                      </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 bg-zinc-200/50 dark:bg-zinc-900/80 p-12 overflow-y-auto">
                      <div className="bg-white dark:bg-zinc-100 text-zinc-800 w-full max-w-[800px] mx-auto min-h-[1000px] shadow-2xl p-16 rounded-sm border border-zinc-200">
                        <div className="text-center mb-16">
                          <h1 className="text-3xl font-black underline underline-offset-8 decoration-2">용 역 계 약 서</h1>
                        </div>

                        <div className="space-y-8 leading-loose text-sm">
                          <p>
                            <span className="font-black border-b-2 border-zinc-800">{contractForm.partyA}</span>(이하 '위탁자' 또는 '갑')와
                            <span className="font-black border-b-2 border-zinc-800 ml-2">{contractForm.partyB}</span>(이하 '수탁자' 또는 '을')은(는)
                            '갑'이 위탁하는 업무를 '을'이 수행하고, '갑'은 '을'에게 이에 대한 대가를 지급하기로 하는 내용의 약정에 관하여 다음과 같이 계약(이하 '본 계약')을 체결한다.
                          </p>

                          <div>
                            <h4 className="font-black text-base mb-2">제1조(계약의 목적)</h4>
                            <p>본 계약은 '갑'이 필요로 하는 업무(이하 '본 건 용역 업무')를 '을'에게 위탁하여 수행하도록 함에 있어, '갑'과 '을'이 사이에 필요한 사항을 정하는 것을 목적으로 한다.</p>
                          </div>

                          <div>
                            <h4 className="font-black text-base mb-2">제2조(용역의 범위)</h4>
                            <p>'을'이 제공하는 용역의 구체적인 내용은 다음과 같다.</p>
                            <div className="bg-zinc-50 border border-zinc-200 p-4 mt-2 rounded-md font-bold">
                              1. 용역 명칭: {contractForm.serviceTitle}<br />
                              2. 주요 범위: {contractForm.serviceDetail}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-black text-base mb-2">제3조(용역 대금)</h4>
                            <p>'갑'은 본 계약에 따른 용역 대금으로 일금 <span className="underline font-bold font-serif">{contractForm.fee}</span>원정(VAT 별도)을 '을'이 지정한 계좌로 지급한다.</p>
                          </div>

                          <div className="pt-20 text-right space-y-2">
                            <p className="text-lg font-bold">{contractForm.date}</p>
                          </div>

                          <div className="pt-20 grid grid-cols-2 gap-20">
                            <div className="space-y-4">
                              <p className="font-bold underline">위탁자 (갑)</p>
                              <p>주소: 서울특별시 강남구 테헤란로 123</p>
                              <p>상호: {contractForm.partyA}</p>
                              <p className="pt-4 flex items-center justify-between">대표이사: (인) <span className="w-12 h-12 rounded-full border border-dashed border-red-500/30 flex items-center justify-center text-[10px] text-red-500/50 italic">Seal</span></p>
                            </div>
                            <div className="space-y-4">
                              <p className="font-bold underline">수탁자 (을)</p>
                              <p>주소: 경기도 성남시 분당구 판교로 456</p>
                              <p>상호: {contractForm.partyB}</p>
                              <p className="pt-4 flex items-center justify-between">대표이사: (인) <span className="w-12 h-12 rounded-full border border-dashed border-red-500/30 flex items-center justify-center text-[10px] text-red-500/50 italic">Seal</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>

      {/* Issue Detail Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
                <h3 className="font-bold text-lg">이슈 상세현황</h3>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${selectedIssue.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                    {selectedIssue.priority === 'high' ? '긴급 장애' : '일반 이슈'}
                  </div>
                  <span className="text-zinc-400 text-xs font-medium">{selectedIssue.date}</span>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-2">{selectedIssue.title}</h4>
                  <p className="text-sm text-zinc-400 font-medium flex items-center">
                    <Activity size={14} className="mr-1.5" />
                    {selectedIssue.site}
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">상세 내역</p>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {selectedIssue.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-400 mb-1">상태</p>
                    <p className="text-sm font-bold text-point">{selectedIssue.status}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-400 mb-1">담당자</p>
                    <p className="text-sm font-bold">{selectedIssue.assigned}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIssue(null)}
                  className="w-full bg-point text-white py-4 rounded-2xl font-bold shadow-lg shadow-point/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  상황 전파 및 업무 배정
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Action Modal */}
      <AnimatePresence>
        {selectedAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
                <h3 className="font-bold text-lg">{selectedAction}</h3>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="p-8 space-y-5">
                {selectedAction === '결재 기안' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">문서 종류</label>
                      <select className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all">
                        <option>일반 품의서</option>
                        <option>지출 결의서</option>
                        <option>근태 신청서</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">제목</label>
                      <input type="text" placeholder="기안 제목을 입력하세요" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all" />
                    </div>
                  </div>
                )}

                {selectedAction === '비용 정산' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">금액</label>
                        <input type="number" placeholder="0" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">항목</label>
                        <select className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all">
                          <option>식비</option>
                          <option>교통비</option>
                          <option>소모품</option>
                        </select>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <Plus className="mx-auto text-zinc-300 mb-2" size={24} />
                      <p className="text-xs text-zinc-400 font-medium">영수증 파일 업로드</p>
                    </div>
                  </div>
                )}

                {selectedAction === '장비 신청' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <EquipmentItem name="노트북" stock="3" />
                      <EquipmentItem name="모니터" stock="5" />
                      <EquipmentItem name="태블릿" stock="2" />
                      <EquipmentItem name="키오스크" stock="1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">사용 목적</label>
                      <textarea placeholder="신청 사유를 입력하세요" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all h-24 resize-none" />
                    </div>
                  </div>
                )}

                {selectedAction === '휴가 신청' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-point/5 border border-point/10 rounded-2xl">
                      <span className="text-xs font-bold text-point">잔여 연차</span>
                      <span className="text-lg font-black text-point">12.5일</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">시작일</label>
                        <input type="date" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">종료일</label>
                        <input type="date" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-point outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleActionSubmit(selectedAction)}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  제출하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Feedback Overlay */}
      <AnimatePresence>
        {activeActionToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-2xl flex items-center space-x-3"
          >
            <div className="w-2 h-2 rounded-full bg-point animate-pulse" />
            <span className="text-sm font-bold">{activeActionToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EquipmentItem({ name, stock }: { name: string, stock: string }) {
  return (
    <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-between hover:border-point transition-colors cursor-pointer group">
      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{name}</span>
      <span className="text-[10px] text-zinc-400">{stock}대 남음</span>
    </div>
  );
}

function AdminQuickBtn({ icon, label, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-point/50 hover:shadow-md transition-all group bg-white dark:bg-zinc-900"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{label}</span>
    </button>
  );
}

function LibraryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const allDocs = [
    { title: "플립패스_운영_가이드_v2.4.pdf", category: "Dev", date: "2시간 전", tags: ["Manual"] },
    { title: "시스템_아키텍처_상세_v1.2.pdf", category: "Dev", date: "어제", tags: ["Architecture"] },
    { title: "Bixolon_프린터_장애_조치.docx", category: "Dev", date: "3일 전", tags: ["Hardware"] },
    { title: "개인정보_처리_방침_2026.pdf", category: "Legal", date: "1주 전", tags: ["Privacy"] },
    { title: "행사_대행_계약서_표준안.docx", category: "Legal", date: "어제", tags: ["Contract"] },
    { title: "사내_보안_수칙_공지.pdf", category: "Legal", date: "2주 전", tags: ["Security"] },
    { title: "2026_복리후생_변경_안내.docx", category: "HR", date: "어제", tags: ["Welfare"] },
    { title: "현장_스태프_응대_매뉴얼.pdf", category: "HR", date: "3일 전", tags: ["Staff"] },
    { title: "출장비_정산_가이드라인.pdf", category: "HR", date: "1개월 전", tags: ["Finance"] },
  ];

  const filteredDocs = searchQuery
    ? allDocs.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">
      <div className="relative group z-30">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-point transition-colors">
          <LibraryIcon size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          placeholder="문서 제목 또는 내용 검색..."
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-point/30 outline-none transition-all shadow-sm"
        />

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-40 max-h-[400px] overflow-y-auto"
            >
              <div className="p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">검색 결과 ({filteredDocs.length})</p>
              </div>
              <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc, idx) => (
                    <div key={idx} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex justify-between items-center group">
                      <div className="flex items-center space-x-3">
                        <FileText size={16} className="text-zinc-400 group-hover:text-point transition-colors" />
                        <div>
                          <p className="text-sm font-bold">{doc.title}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{doc.category} · {doc.date}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-zinc-300" />
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-sm text-zinc-400">검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">부서별 핵심 지식고</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LibraryDepartmentCard
            title="Development"
            icon={<Terminal className="text-blue-500" size={24} />}
            count={32}
            docs={allDocs.filter(d => d.category === 'Dev').slice(0, 2)}
          />
          <LibraryDepartmentCard
            title="Legal & Privacy"
            icon={<Gavel className="text-point" size={24} />}
            count={18}
            docs={allDocs.filter(d => d.category === 'Legal').slice(0, 2)}
          />
          <LibraryDepartmentCard
            title="HR & Org"
            icon={<Users className="text-orange-500" size={24} />}
            count={24}
            docs={allDocs.filter(d => d.category === 'HR').slice(0, 2)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">카테고리별 탐색</h4>
          <div className="grid grid-cols-2 gap-3">
            <LibraryCategoryItem icon={<Cpu size={18} />} label="시스템 아키" count={8} color="bg-blue-500" />
            <LibraryCategoryItem icon={<Shield size={18} />} label="보안/개인정보" count={12} color="bg-emerald-500" />
            <LibraryCategoryItem icon={<Scale size={18} />} label="계약/법무" count={15} color="bg-point" />
            <LibraryCategoryItem icon={<UserCheck size={18} />} label="인사/매뉴얼" count={22} color="bg-orange-500" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">최근 업데이트 문서</h4>
          <div className="space-y-3">
            {allDocs.slice(0, 3).map((doc, idx) => (
              <RecentDocItem key={idx} title={doc.title} date={doc.date} category={doc.category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyView({ user, onPasswordOpen, onNotifOpen, onThemeOpen }: { user: any, onPasswordOpen: () => void, onNotifOpen: () => void, onThemeOpen: () => void }) {
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '사용자';
  const userInitials = userName.substring(0, 1);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Preference persistence logic
  const savePreferences = (newPrefs: any) => {
    startTransition(async () => {
      const result = await updatePreferences(newPrefs);
      if (!result.success) {
        setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다.' });
      }
    });
  };

  const [prefs, setPrefs] = useState({
    email: user?.user_metadata?.preferences?.email ?? true,
    push: user?.user_metadata?.preferences?.push ?? true,
    marketing: user?.user_metadata?.preferences?.marketing ?? false,
    activity: user?.user_metadata?.preferences?.activity ?? true
  });

  const handlePreferenceChange = async (key: string, value: any) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    savePreferences(newPrefs);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">
      <section className="relative overflow-hidden p-8 bg-zinc-900 dark:bg-zinc-800 rounded-3xl text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-point/20 rounded-full blur-3xl" />
        <div className="relative flex items-center space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-point to-orange-400 flex items-center justify-center text-3xl font-bold shadow-lg uppercase">
            {userInitials}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">{userName}</h2>
              <span className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider">Manager</span>
            </div>
            <p className="text-white/60 text-sm mt-1">{user?.email || 'email@company.com'}</p>
            <div className="flex items-center space-x-4 mt-4 text-xs text-white/40">
              <span className="flex items-center"><Briefcase size={12} className="mr-1" /> 사번: 2024001</span>
              <span className="flex items-center"><Calendar size={12} className="mr-1" /> 입사일: 2024.01.01</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MyStatCard label="남은 휴가" value="12.5" unit="일" />
        <MyStatCard label="이번달 정산" value="2.45" unit="M" />
        <MyStatCard label="참여 행사" value="14" unit="건" />
        <MyStatCard label="칭찬 뱃지" value="3" unit="개" />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
        <h3 className="font-bold mb-4 text-sm">개인 설정 및 관리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <MyMenuBtn label="비밀번호 변경" onClick={onPasswordOpen} />
          <MyMenuBtn label="알림 설정" onClick={onNotifOpen} />
          <MyMenuBtn label="테마 모드" onClick={onThemeOpen} />
          <button
            onClick={() => logout()}
            className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

function ThemeModal({ isOpen, onClose, currentTheme, setTheme }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
              <div className="flex items-center space-x-2">
                <LayoutGrid size={20} className="text-point" />
                <h3 className="font-bold text-lg">화면 테마 설정</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <ThemeOption
                  active={currentTheme === 'light'}
                  onClick={() => setTheme('light')}
                  icon={<Sun size={24} />}
                  label="라이트 모드"
                  colors="bg-zinc-50 border-zinc-200 text-zinc-900"
                />
                <ThemeOption
                  active={currentTheme === 'dark'}
                  onClick={() => setTheme('dark')}
                  icon={<Moon size={24} />}
                  label="다크 모드"
                  colors="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={onClose}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold transition-all"
                >
                  적용하기
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ThemeOption({ active, onClick, icon, label, colors }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${active ? 'border-point shadow-lg shadow-point/10' : 'border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
        } ${colors}`}
    >
      <div className={`mb-3 p-3 rounded-2xl ${active ? 'bg-point text-white' : 'bg-white/10'}`}>
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
      {active && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={16} className="text-point" />
        </div>
      )}
    </button>
  );
}

function NotificationModal({ isOpen, onClose, prefs, handlePreferenceChange }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
              <div className="flex items-center space-x-2">
                <Bell size={20} className="text-point" />
                <h3 className="font-bold text-lg">알림 설정</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-xs text-zinc-400 font-medium mb-2">수신하고 싶은 알림 채널을 선택해 주세요.</p>

              <div className="space-y-1">
                <ToggleItem
                  icon={<Mail size={18} />}
                  title="이메일 알림"
                  desc="주요 공지사항 및 활동 내역을 메일로 받습니다."
                  active={prefs.email}
                  onChange={(val: boolean) => handlePreferenceChange('email', val)}
                />
                <ToggleItem
                  icon={<Smartphone size={18} />}
                  title="푸시 알림"
                  desc="모바일 및 브라우저 앱 알림을 받습니다."
                  active={prefs.push}
                  onChange={(val: boolean) => handlePreferenceChange('push', val)}
                />
                <ToggleItem
                  icon={<Activity size={18} />}
                  title="활동 알림"
                  desc="나와 관련된 새로운 활동 발생 시 알림을 받습니다."
                  active={prefs.activity}
                  onChange={(val: boolean) => handlePreferenceChange('activity', val)}
                />
                <ToggleItem
                  icon={<ShieldCheck size={18} />}
                  title="마케팅 정보 수신"
                  desc="이벤트 및 혜택 정보를 수신합니다."
                  active={prefs.marketing}
                  onChange={(val: boolean) => handlePreferenceChange('marketing', val)}
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold transition-all"
                >
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ToggleItem({ icon, title, desc, active, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-start space-x-3">
        <div className={`mt-0.5 p-2 rounded-lg ${active ? 'bg-point/10 text-point' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[200px]">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!active)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${active ? 'bg-point' : 'bg-zinc-200 dark:bg-zinc-700'
          }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${active ? 'translate-x-6' : 'translate-x-0'
            }`}
        />
      </button>
    </div>
  );
}

function LibraryCategoryItem({ icon, label, count, color }: any) {
  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-point/50 hover:shadow-md transition-all cursor-pointer group">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="font-bold text-sm tracking-tight">{label}</p>
      <p className="text-[10px] text-zinc-400 mt-0.5">{count}개의 문서</p>
    </div>
  );
}

function MyStatCard({ label, value, unit }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center space-y-1 hover:border-point/30 transition-colors">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline justify-center space-x-0.5">
        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{value}</span>
        <span className="text-xs font-bold text-zinc-400">{unit}</span>
      </div>
    </div>
  );
}

function MyMenuBtn({ label, dangerous, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-colors ${dangerous
        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}>
      {label}
    </button>
  );
}

function RecentDocItem({ title, date, category }: { title: string, date: string, category?: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-point transition-colors">
          <FileText size={16} />
        </div>
        <div>
          <h5 className="text-xs font-bold truncate max-w-[150px] md:max-w-none">{title}</h5>
          <p className="text-[10px] text-zinc-400 mt-0.5">{category ? `${category} · ` : ''}{date}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-zinc-300 group-hover:text-point transition-colors" />
    </div>
  );
}

function LibraryDepartmentCard({ title, icon, count, docs }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:border-point/30 hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-point/10 transition-colors">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{count}</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase">Documents</p>
        </div>
      </div>
      <h3 className="font-extrabold text-base mb-4 tracking-tight group-hover:text-point transition-colors">{title}</h3>
      <div className="space-y-3 flex-1">
        {docs.map((doc: any, i: number) => (
          <div key={i} className="flex items-center space-x-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            <div className="w-1 h-1 rounded-full bg-point" />
            <span className="truncate">{doc.title}</span>
          </div>
        ))}
      </div>
      <button className="mt-6 flex items-center space-x-2 text-[11px] font-bold text-zinc-400 hover:text-point transition-colors">
        <span>자세히 보기</span>
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

// --- Legal Dashboard Helpers ---

function LegalDraftItem({ title, date }: any) {
  return (
    <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl flex items-center justify-between group hover:border-point/30 transition-all cursor-pointer">
      <div className="flex items-center space-x-3 truncate">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-point shadow-sm">
          <FileText size={14} />
        </div>
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 truncate">{title}</span>
      </div>
      <span className="text-[10px] font-black text-zinc-400 uppercase">{date}</span>
    </div>
  );
}

function LegalApprovalItem({ title, manager, date, isNew }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer group">
      <div className="flex items-center space-x-3">
        <div className="w-1.5 h-1.5 rounded-full bg-point" />
        <span className="text-xs font-bold truncate max-w-[120px]">{title}</span>
        {isNew && <span className="text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-md uppercase">New</span>}
      </div>
      <div className="flex items-center space-x-4 text-[10px] text-zinc-400">
        <span className="font-bold">{manager}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

function LegalMainRowItem({ title, id, manager, date, isNew }: any) {
  return (
    <div className="grid grid-cols-12 py-5 items-center group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer rounded-2xl px-2">
      <div className="col-span-7 flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${isNew ? 'bg-point text-white shadow-lg shadow-point/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
          <Scale size={18} />
        </div>
        <div className="truncate">
          <p className="text-xs font-black tracking-tight">{title}</p>
          <p className="text-[10px] text-zinc-400 font-bold">{id}</p>
        </div>
        {isNew && <span className="text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm">NEW</span>}
      </div>
      <div className="col-span-3 text-center">
        <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{manager}</span>
      </div>
      <div className="col-span-2 text-right">
        <span className="text-[10px] font-black text-zinc-400">{date}</span>
      </div>
    </div>
  );
}

function LegalStatusCard({ label, count, active, color }: any) {
  return (
    <div className={`p-4 rounded-[22px] border ${active ? 'border-point/20 bg-point/[0.03]' : 'border-zinc-100 dark:border-zinc-800'} flex items-center justify-between group cursor-pointer hover:border-point/40 transition-all`}>
      <span className={`text-[11px] font-black ${active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'} tracking-tight`}>{label}</span>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-black ${color || (active ? 'text-point' : 'text-zinc-400')}`}>{count}</span>
        <ArrowUpRight size={12} className="text-zinc-300 group-hover:text-point transition-colors" />
      </div>
    </div>
  );
}

function LegalNotifItem({ title, date, isNew }: any) {
  return (
    <div className={`p-5 rounded-3xl border ${isNew ? 'bg-point/[0.02] border-point/20' : 'bg-zinc-50/50 dark:bg-zinc-800/20 border-transparent'} transition-all hover:border-point/30 cursor-pointer group`}>
      <div className="flex items-start space-x-3">
        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isNew ? 'bg-red-500' : 'bg-zinc-300'}`} />
        <div className="flex-1">
          <p className="text-xs font-black leading-snug tracking-tight group-hover:text-point transition-colors">{title}</p>
          <p className="text-[10px] text-zinc-400 font-bold mt-2">{date}</p>
        </div>
      </div>
    </div>
  );
}

function SettingsToggle({ label, defaultChecked }: { label: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
      <span className="text-xs font-black text-zinc-600 dark:text-zinc-300">{label}</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-point shadow-lg shadow-point/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7 shadow-sm' : 'left-1'}`} />
      </button>
    </div>
  );
}

function LegalProjectItem({ title, registar, date, isNew }: any) {
  return (
    <div className="grid grid-cols-12 py-4 items-center group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer rounded-xl px-2">
      <div className="col-span-7 flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNew ? 'bg-point/10 text-point' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
          <LayoutGrid size={14} />
        </div>
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{title}</span>
        {isNew && <span className="text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-md uppercase">New</span>}
      </div>
      <div className="col-span-3 text-center">
        <span className="text-[10px] font-bold text-zinc-500">{registar}</span>
      </div>
      <div className="col-span-2 text-right">
        <span className="text-[10px] font-black text-zinc-400">{date}</span>
      </div>
    </div>
  );
}

// --- Helper Components ---

function SidebarNavItem({ icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
        ? 'bg-point/10 text-point shadow-sm'
        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
    >
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-point" />}
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 transition-colors ${active ? 'text-point' : 'text-zinc-400'
        }`}
    >
      <div className={`p-1.5 rounded-lg ${active ? 'bg-point/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function QuickMenuButton({ label, onClick }: { label: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-full text-xs font-medium hover:border-point transition-colors shadow-sm"
    >
      {label}
    </button>
  );
}


function LibraryCard({ icon, title, subtitle }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-point/50 transition-all cursor-pointer group">
      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-point/10 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-sm">{title}</h3>
      <p className="text-zinc-400 text-xs mt-1">{subtitle}</p>
    </div>
  );
}

function UserMenuBtn({ icon, label, dangerous, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${dangerous
        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}
    >
      <span className={dangerous ? 'text-red-500' : 'text-zinc-400 group-hover:text-point'}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function StatBox({ icon, label, value, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center space-y-2 hover:border-point/30 transition-all cursor-pointer group active:scale-95"
    >
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}

// --- Specific Category Components ---


function LegalListItem({ title, status, date, sender }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
      <div>
        <h4 className="text-xs font-bold group-hover:text-point transition-colors">{title}</h4>
        <p className="text-[10px] text-zinc-400 mt-0.5">{sender} · {date}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${status === '완료' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
        }`}>
        {status}
      </span>
    </div>
  );
}



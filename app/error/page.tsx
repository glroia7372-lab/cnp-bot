export default function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">앗!</h1>
            <p className="text-white/60 mb-8">인증 요청 처리 중 오류가 발생했습니다.</p>
            <a
                href="/login"
                className="px-8 py-3 bg-[#D95204] rounded-full font-bold hover:bg-[#BF4903] transition-colors"
            >
                로그인으로 돌아가기
            </a>
        </div>
    )
}

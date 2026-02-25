export default function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Oops!</h1>
            <p className="text-white/60 mb-8">Something went wrong with your authentication request.</p>
            <a
                href="/login"
                className="px-8 py-3 bg-[#D95204] rounded-full font-bold hover:bg-[#BF4903] transition-colors"
            >
                Back to Login
            </a>
        </div>
    )
}

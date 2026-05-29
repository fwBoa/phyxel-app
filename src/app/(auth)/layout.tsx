import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F9F9] px-4">
      <Link href="/" className="mb-8 text-2xl font-bold text-[#0A0A0A]">
        Phyxel
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  )
}

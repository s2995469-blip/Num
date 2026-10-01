import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/auth/session";
import { logout } from "../actions";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="border-b border-line-light bg-porcelain">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" aria-label="Admin home">
              <Logo tone="light" className="h-auto w-14" />
            </Link>
            <nav aria-label="Admin">
              <ul className="flex gap-6 text-[0.95rem] font-medium">
                <li>
                  <Link href="/admin" className="link-underline">
                    Enquiries
                  </Link>
                </li>
                <li>
                  <Link href="/admin/messages" className="link-underline">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/" className="link-underline text-ink-soft">
                    View site
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <form action={logout} className="flex items-center gap-4 text-sm text-ink-soft">
            <span className="hidden sm:inline">{admin.email}</span>
            <button type="submit" className="btn btn-ghost min-h-10 px-4 text-sm">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="container-x py-12">{children}</main>
    </>
  );
}

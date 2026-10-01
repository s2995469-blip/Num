import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="main">
    <section data-hero-tone="light" className="bg-porcelain">
      <div className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-[var(--header-h)]">
        <p className="eyebrow text-brass-deep">404</p>
        <h1 className="display-lg mt-6 max-w-[16ch]">This path doesn&apos;t lead anywhere — yet.</h1>
        <p className="lede mt-6 max-w-lg text-ink-soft">The page you were looking for may have moved. Let&apos;s get you back on course.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn btn-primary">
            Return home <Arrow />
          </Link>
          <Link href="/services" className="btn btn-ghost">
            Explore services
          </Link>
        </div>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { site } from "@/lib/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo/powerhouse-logo-original.png`,
  description: site.description,
  founder: { "@type": "Person", name: site.practitioner.name },
  ...(site.contact.email ? { email: site.contact.email } : {}),
  ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
  ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <MotionProvider>{children}</MotionProvider>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

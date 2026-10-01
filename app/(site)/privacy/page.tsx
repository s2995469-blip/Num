import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Powerhouse Numerology collects, uses and protects the information you share through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="2026-10-01">
      <p>
        This policy explains what information {site.name} (&quot;we&quot;, &quot;us&quot;) collects through this website, why, and how it is
        looked after. We aim to collect only what is genuinely needed.
      </p>

      <h2>What we collect</h2>
      <h3>When you send a session enquiry</h3>
      <ul>
        <li>Your name and email address, so we can reply.</li>
        <li>Your phone number, only if you choose to provide it.</li>
        <li>The service you are interested in, a preferred date and time window{site.sessionFormats.length ? ", and a preferred session format" : ""}.</li>
        <li>Any message you choose to include.</li>
        <li>A record that you agreed to this policy, and when the enquiry was sent.</li>
      </ul>
      <h3>When you use the contact form</h3>
      <ul>
        <li>Your name, email address, subject and message.</li>
      </ul>
      <p>
        We do not ask for your date of birth, health information or other sensitive details through these forms. If a
        numerology session requires your birth name and date of birth, we will ask for them separately after your session
        is confirmed and explain why.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry or message.</li>
        <li>To arrange, confirm and prepare for sessions you request.</li>
        <li>To keep basic records of enquiries and appointments.</li>
      </ul>
      <p>We do not sell your information, use it for advertising, or share it with third parties for their own purposes.</p>

      <h2>How it is stored</h2>
      <p>
        Enquiries and messages are stored in a secured database that only the practitioner can access, through a
        password-protected administration area. If email notifications are enabled, the practitioner receives a short
        notification containing your enquiry reference and service — not the contents of your message.
      </p>
      <p>
        To protect the forms from abuse, the website briefly keeps a one-way hashed version of your network address in
        memory to limit repeated submissions. It is not stored in the database.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not use advertising or analytics cookies. A single, strictly necessary cookie is used only when
        the practitioner signs in to the administration area.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry information for as long as it is needed to respond to you and manage any sessions, and to meet any
        record-keeping obligations. You can ask us to delete it at any time.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask to see, correct or delete the information we hold about you, or withdraw your consent, by getting in
        touch via the{" "}
        {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <Link href="/contact">contact form</Link>}. Depending on
        where you live, you may also have the right to complain to your local data-protection authority.
      </p>

      <h2>Changes</h2>
      <p>If we change how we handle information, we will update this page and the date above.</p>
    </LegalPage>
  );
}

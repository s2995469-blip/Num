import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Powerhouse Numerology website and sending session enquiries.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="2026-10-01">
      <p>
        These terms apply to your use of the {site.name} website. By using the site you agree to them. If you have questions,
        please <Link href="/contact">get in touch</Link>.
      </p>

      <h2>Enquiries and appointments</h2>
      <p>
        Submitting the booking form sends an <strong>enquiry</strong>. It is not a confirmed appointment. A session is only
        booked once {site.practitioner.name} has confirmed it with you directly. Session details — including format,
        duration, fees and any cancellation or rescheduling arrangements — are confirmed with you at that point.
      </p>

      <h2>The nature of our services</h2>
      <ul>
        <li>
          <strong>Numerology</strong> is an interpretive, traditional framework used for reflection. It does not predict the
          future.
        </li>
        <li>
          <strong>Reiki</strong> is a complementary practice focused on relaxation and wellbeing. It does not diagnose, treat
          or cure any condition and is not a substitute for medical care.
        </li>
        <li>
          <strong>Career and relationship sessions</strong> are reflective guidance conversations. They are not legal,
          financial, medical or psychological advice, therapy, or a crisis service.
        </li>
      </ul>
      <p>
        You remain responsible for your own decisions. For medical, psychological, legal or financial matters, please consult
        an appropriately qualified professional. If you are in danger, contact your local emergency services.
      </p>

      <h2>Website content</h2>
      <p>
        Articles and information on this site are provided for general interest and reflection only. We aim to keep them
        accurate but cannot guarantee they are complete or current.
      </p>
      <p>
        The {site.name} name, logo and website content belong to {site.name} and may not be reused without permission.
      </p>

      <h2>Acceptable use</h2>
      <p>Please don&apos;t misuse the website — for example by sending automated or abusive submissions or attempting to access areas you are not authorised to use.</p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date above shows when they last changed.</p>
    </LegalPage>
  );
}

import { SiteNavbar } from '@/components/site/SiteNavbar';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';
import { getSession } from '@/lib/session-cookie';
import { SITES, type SiteSlug } from '@/lib/sites';

/**
 * Wrapper used by the layout of each GlofiHub business website: its own navbar and footer
 * (instead of the parent site's), plus the floating chat / contact buttons.
 * Only the signed-in state is read, and only for sites with accounts (the JWT cookie — no database hit).
 */
export async function SiteShell({ slug, children }: { slug: SiteSlug; children: React.ReactNode }) {
  const session = SITES[slug].auth ? await getSession() : null;
  return (
    <>
      <SiteNavbar slug={slug} session={session ? { name: session.name, role: session.role } : null} />
      {children}
      <SiteFooter slug={slug} />
      <Chatbot />
      <FloatingContact />
    </>
  );
}

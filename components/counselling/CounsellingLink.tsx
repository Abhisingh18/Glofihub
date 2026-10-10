'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';

/**
 * Link to the GlofiHub Counselling website for the sign-in pages. The admin subdomain serves staff pages only
 * (anything else there bounces back to /login), so on admin.<host> it points at the public host instead.
 */
export function CounsellingLink({ className, children }: { className?: string; children: ReactNode }) {
  const [href, setHref] = useState('/counselling');

  useEffect(() => {
    const { protocol, host } = window.location;
    if (host.startsWith('admin.')) setHref(`${protocol}//${host.replace(/^admin\./, '')}/counselling`);
  }, []);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

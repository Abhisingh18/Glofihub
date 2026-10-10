'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/utm';

/** Mounted once in the root layout: records UTM params / referrer on the visitor's first page view. */
export function UtmCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}

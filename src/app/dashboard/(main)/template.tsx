'use client';

import PageTransition from '@/components/transitions/PageTransition';

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

'use client';

import React from 'react';
import LandingPage from '@/components/landing/LandingPage';

interface PortalIntroPageProps {
  onEnterMainSite: () => void;
  introReady?: boolean;
}

/**
 * DevCanvas — Story Landing Page
 * Full reimagined experience in brown, polished silver, and whisper-lavender.
 */
export default function PortalIntroPage({ onEnterMainSite }: PortalIntroPageProps) {
  return <LandingPage onEnter={onEnterMainSite} />;
}

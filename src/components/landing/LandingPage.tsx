'use client';

import React from 'react';
import StoryLanding from '@/components/landing/story/StoryLanding';

/**
 * DevCanvas landing page.
 *
 * The full experience lives in `components/landing/story`, which keeps the
 * scroll narrative, product mockups, and sample data together. This wrapper
 * preserves the entry point used by PortalIntroPage.
 */
export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return <StoryLanding onEnter={onEnter} />;
}

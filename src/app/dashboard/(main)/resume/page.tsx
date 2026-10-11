'use client';

import React from 'react';
import ResumeUploader from '@/components/ResumeUploader';

export default function ResumePage() {
  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full min-h-screen">
      <div className="mb-xl">
        <h1 className="font-serif text-2xl font-bold text-on-surface mb-2">Resume</h1>
        <p className="text-on-surface-variant text-sm">Upload your professional resume and extract structured data.</p>
      </div>

      <ResumeUploader />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { initialPortfolioData, PortfolioData } from '@/types/portfolio';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import DeveloperProTemplate from '@/components/templates/DeveloperPro';
import { Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Portfolio {
  id: string;
  title: string;
  template_name: string;
  data: PortfolioData;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function PortfolioPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const { id } = await params;
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setPortfolio(data);
      } catch (err) {
        console.error('Error loading portfolio:', err);
        setError('Portfolio not found');
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Portfolio Not Found</h1>
          <p className="text-on-surface-variant">This portfolio doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const Template = portfolio.template_name === 'modern-developer' 
    ? ModernDeveloperTemplate 
    : DeveloperProTemplate;

  return (
    <Template data={portfolio.data} />
  );
}
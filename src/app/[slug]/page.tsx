import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import DeveloperProTemplate from '@/components/templates/DeveloperPro';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PortfolioSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('id, title, template_name, data, status, slug, created_at, updated_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !portfolio) {
    notFound();
  }

  const Template =
    portfolio.template_name === 'modern-developer'
      ? ModernDeveloperTemplate
      : DeveloperProTemplate;

  return <Template data={portfolio.data} />;
}

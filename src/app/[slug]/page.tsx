import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import DeveloperProTemplate from '@/components/templates/DeveloperPro';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Slugs are stored lowercase with only `[a-z0-9-]`. Normalizing the incoming
 * param the same way keeps hand-typed / pasted links working: previously
 * `/My-Name` returned 404 while `/my-name` worked.
 */
function normalizeSlug(raw: string): string {
  let decoded = raw;

  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // Malformed percent-encoding — fall through with the raw value.
  }

  return decoded.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export default async function PortfolioSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    notFound();
  }

  const supabase = await createClient();

  const { data: portfolios, error } = await supabase
    .from('portfolios')
    .select('id, title, template_name, data, status, slug, created_at, updated_at')
    .eq('slug', normalizedSlug)
    .eq('status', 'published')
    .limit(1);

  const portfolio = portfolios?.[0];

  if (error || !portfolio) {
    notFound();
  }

  const Template =
    portfolio.template_name === 'modern-developer'
      ? ModernDeveloperTemplate
      : DeveloperProTemplate;

  return <Template data={portfolio.data} />;
}

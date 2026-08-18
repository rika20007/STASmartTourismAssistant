import { useMemo, useState } from 'react';
import { partners, Partner, PartnerCategory } from '@/services/mockPartners';

export type PartnerFilter = PartnerCategory | 'all';

export function usePartners() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<PartnerFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partners.filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, filter]);

  return {
    query,
    setQuery,
    filter,
    setFilter,
    partners: filtered as Partner[],
    total: filtered.length,
  };
}

import type { ReactNode } from 'react';
import { useT } from '@/i18n/useT';
import { VERIFICATION_KEYS } from '@/i18n/labels';
import type { VerificationStatus } from '@/data/gameDatabase/types';
import { Badge } from '@/components/ui/Badge';

export function FieldValue({ value }: { value: ReactNode | null | undefined }) {
  const t = useT();
  if (value === null || value === undefined || value === '') {
    return <span className="italic text-muted">{t('common.notImported')}</span>;
  }
  return <span className="font-medium text-ink">{value}</span>;
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const t = useT();
  return <Badge tone={status === 'verified' ? 'success' : 'warning'}>{t(VERIFICATION_KEYS[status])}</Badge>;
}

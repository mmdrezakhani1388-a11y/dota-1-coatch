import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

export interface ComparisonRow {
  label: string;
  cells: (string | null)[];
}

interface ComparisonTableProps {
  columns: string[];
  rows: ComparisonRow[];
}

export function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="bg-panel/80">
            <th scope="col" className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wider text-muted">
              {'\u00a0'}
            </th>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 text-start font-display font-semibold text-gold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const differs = new Set(row.cells.map((cell) => cell ?? '')).size > 1;
            return (
              <tr key={row.label} className={cn('border-t border-line', differs && 'bg-gold/5')}>
                <th scope="row" className="px-4 py-3 text-start font-medium text-muted">
                  <span className="flex items-center gap-2">
                    {differs && <span aria-hidden="true" className="h-4 w-1 rounded-full bg-gold" />}
                    {row.label}
                  </span>
                </th>
                {row.cells.map((cell, index) => (
                  <td key={`${row.label}-${columns[index]}`} className="px-4 py-3 align-top">
                    {cell ?? <span className="italic text-muted">{t('common.notImported')}</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

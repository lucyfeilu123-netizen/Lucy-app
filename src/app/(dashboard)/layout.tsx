'use client';

import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { DetailPanel } from '@/components/layout/detail-panel';
import { AmbientOverlay } from '@/components/ambient/ambient-overlay';
import { useUIStore } from '@/stores/ui-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--bg-base)]">
      <AmbientOverlay />
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center h-14 px-4 border-b border-[var(--border)] lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)]"
          >
            <Menu size={20} />
          </button>
          <span className="ml-2 font-semibold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Lucy App
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      <DetailPanel />
    </div>
  );
}

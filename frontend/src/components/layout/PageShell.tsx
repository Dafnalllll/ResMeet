import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

/** Pembungkus halaman dengan tema editorial "paper & ink". */
export default function PageShell({ children }: PageShellProps) {
  return (
    <main className="rsm-page min-h-screen font-sans text-(--rsm-ink)]">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </div>
    </main>
  );
}

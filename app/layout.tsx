import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

const cx = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');

export const metadata: Metadata = {
  title: {
    default: 'MMA Elo Engine',
    template: '%s | MMA Elo Engine',
  },
  description: 'Visualize fighter rankings and match history using our custom Elo rating system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-kanagawa-ink-light bg-kanagawa-bg-light dark:text-kanagawa-ink-dark dark:bg-kanagawa-bg-dark',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-4xl mx-5 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}

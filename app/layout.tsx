import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, Fraunces, Newsreader } from 'next/font/google';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://ahanot.github.io/blog'
      : 'http://localhost:3000',
  ),
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  axes: ['opsz', 'SOFT', 'WONK'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-prose',
  style: ['normal', 'italic'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${newsreader.variable} ${inter.className}`} suppressHydrationWarning>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="1d0157b7-f78d-4e22-bbb3-22e934062c9c" />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              type: 'static',
              api: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/search`,
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

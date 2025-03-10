import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackServerApp } from '@/stack';

export const metadata: Metadata = {
    title: 'Jeder\'s House',
    description: 'Welcome to Jeder\'s Blog!',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased min-h-dvh flex flex-col`}>
                <StackProvider app={stackServerApp}>
                    <StackTheme>
                        <Header />
                        <main className="mx-auto flex-1 w-full flex flex-col">{children}</main>
                    </StackTheme>
                </StackProvider>
            </body>
        </html>
    );
}

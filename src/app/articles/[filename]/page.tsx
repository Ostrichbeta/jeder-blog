import ArticleContent from '@/components/article-content';
import { notFound } from 'next/navigation';
import fsExists from 'fs.promises.exists';
import path from 'path';
import { Suspense } from 'react';
import Loading from './loading';
import ScrollToTop from '@/components/scroll-to-top';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { logger } from '@/lib/logger';
import { getItem } from '@/lib/article-io';
import { MDField } from '@/lib/article-check';
import { headers } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params, searchParams }: { params: Promise<{ filename: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> },
    // eslint-disable-next-line
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const draftMode: boolean = (await searchParams).draft !== undefined ? true : false;

    // If not found, return a 404 page.
    if (!(await fsExists(path.join(process.cwd(), draftMode ? 'drafts' : 'raw_articles', `${(await params).filename}.md`)))) {
        return {
            title: "Not Found | Jeder's House",
        };
    }

    try {
        const article = await getItem((await params).filename, draftMode);
        const metadata: MDField = article.fields;

        return {
            title: `${metadata.title} | Jeder's House`,
            description: `${metadata.description}`,
        };
    } catch (e) {
        logger.error(e);
        return {
            title: "Error | Jeder's House",
            description: `Error`,
        };
    }
}

export default async function ArticlesPage({ params, searchParams }: { params: Promise<{ filename: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const draftMode: boolean = (await searchParams).draft !== undefined ? true : false;

    // If not found, return a 404 page.
    if (!(await fsExists(path.join(process.cwd(), draftMode ? 'drafts' : 'raw_articles', `${(await params).filename}.md`)))) {
        return notFound();
    }

    // Get articles
    try {
        const article = await getItem((await params).filename, draftMode);
        const metadata: MDField = article.fields;
        const content: string = article.content;
        const isAdmin: boolean = (await headers()).has('is-admin');

        return (
            <div className="flex-1 flex flex-col py-8 w-full">
                <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4">
                    {draftMode && (
                        <Alert className="mb-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Draft</AlertTitle>
                            <AlertDescription>This article is currently stored in your drafts, it is not avaliable to guests.</AlertDescription>
                        </Alert>
                    )}

                    <Suspense fallback={<Loading />}>
                        <ArticleContent slug={(await params).filename} mdField={metadata} mdContent={content} isAdmin={isAdmin} />
                    </Suspense>
                </div>

                <ScrollToTop />
            </div>
        );
        // eslint-disable-next-line
    } catch (e: any) {
        logger.error(e);
        return (
            <div className="flex-1 flex flex-col py-8 w-full">
                <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 items-center justify-center">
                    <Suspense fallback={<Loading />}>
                        <div className="flex flex-col items-center justify-center text-center space-y-4 text-500 h-full mb-8" role="alert">
                            <div className="text-2xl font-bold">⚠️ Oops! Something went wrong.</div>
                            <div className="text-lg text-400">Please try refreshing the page or contact support if the problem persists.</div>
                            <div className="text-lg text-400">{e.message ?? ''}</div>
                        </div>
                    </Suspense>
                </div>
            </div>
        );
    }
}

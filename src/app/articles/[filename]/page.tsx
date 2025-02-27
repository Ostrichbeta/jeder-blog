import ArticleContent from '@/components/article-content';
import { notFound } from 'next/navigation';
import fsExists from 'fs.promises.exists';
import path from 'path';
import { Suspense } from 'react';
import Loading from './loading';
import ScrollToTop from '@/components/scroll-to-top';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function ArticlesPage({ params, searchParams }: { params: Promise<{ filename: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const draftMode: boolean = (await searchParams).draft !== undefined ? true : false;

    // If not found, return a 404 page.
    if (!(await fsExists(path.join(process.cwd(), draftMode ? 'drafts' : 'raw_articles', `${(await params).filename}.md`)))) {
        return notFound();
    }

    return (
        <div className="flex-1 flex flex-col py-8 w-full">
            <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4">
                {draftMode && (
                    <Alert className='mb-2'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Draft</AlertTitle>
                        <AlertDescription>This article is currently stored in your drafts, it is not avaliable to guests.</AlertDescription>
                    </Alert>
                )}

                <Suspense fallback={<Loading />}>
                    <ArticleContent slug={(await params).filename} />
                </Suspense>
            </div>

            <ScrollToTop />
        </div>
    );
}

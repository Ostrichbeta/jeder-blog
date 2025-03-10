'use client';

import { MDField } from '@/lib/article-check';
import Showdown from 'showdown';
import ArticleTOC from './article-toc';
import { Badge } from './ui/badge';
import { Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ArticleContent({ slug, isAdmin, mdField, mdContent }: { slug: string; isAdmin: boolean; mdField: MDField; mdContent: string }) {
    const searchParams = useSearchParams();

    // Authentication here, if the user is not superuser, ignore the drafts tag.
    const draftMode: boolean = searchParams.has('draft');

    const router = useRouter();

    const conv = new Showdown.Converter({ headerLevelStart: 2 });
    const mdHTML: string = conv.makeHtml(mdContent);

    return (
        <article className="px-2">
            {/* Action Buttons */}
            {isAdmin && mdField && (
                <div className="flex justify-end space-x-2 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/articles/${slug}/edit?${draftMode ? 'draft' : ''}`)} className="text-muted-foreground hover:text-primary">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit
                    </Button>
                </div>
            )}

            <h1 className="text-4xl font-bold tracking-tight mb-2">{mdField?.title ?? 'Loading'}</h1>
            <p className="text-gray-500 mb-8">
                Published on {mdField?.date ?? '...'}{' '}
                {[...(mdField?.tags ?? '')].map((item) => (
                    <Badge key={item} variant="secondary" className="ml-2 text-md mt-1">
                        {item}
                    </Badge>
                ))}
            </p>

            {mdHTML && <ArticleTOC>{mdHTML}</ArticleTOC>}

            <div
                dangerouslySetInnerHTML={{ __html: mdHTML ?? '' }}
                className="prose dark:prose-invert prose-base max-w-none
                           prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                           prose-h1:font-bold prose-h2:font-semibold prose-h3:font-medium prose-h4:font-medium
                           prose-h1:mt-9 prose-h2:mt-7 prose-h3:mt-6 prose-h4:mt-4
                           prose-h1:mb-4 prose-h2:mb-3 prose-h3:mb-3 prose-h4:mb-2
                           prose-headings:font-semibold
                           prose-p:mb-2 prose-p:leading-7 prose-p:text-lg
                           prose-a:text-blue-600 hover:prose-a:text-blue-500
                           prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                           prose-blockquote:pl-4 prose-blockquote:italic
                           dark:prose-blockquote:border-gray-600
                           prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                           prose-code:px-2 prose-code:py-1 prose-code:rounded
                           prose-code:before:content-none prose-code:after:content-none
                           prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                           prose-pre:rounded-lg prose-pre:p-4
                           prose-img:rounded-xl prose-img:shadow-lg
                           prose-ul:pl-8 prose-ol:pl-8 prose-li:my-1 prose-li:text-lg mb-8"
            ></div>
        </article>
    );
}

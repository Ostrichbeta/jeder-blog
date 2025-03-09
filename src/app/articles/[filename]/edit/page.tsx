'use server';

import { notFound } from 'next/navigation';
import fsExists from 'fs.promises.exists';
import path from 'path';
import { getItem } from '@/lib/article-io';
import ArticleEditor from '@/components/article-editor';
import { stackServerApp } from '@/stack';
import { Team } from '@stackframe/stack';

export default async function ArticlesPage({ params, searchParams }: { params: Promise<{ filename: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const fromDrafts: boolean = (await searchParams).draft !== undefined;

    const user = await stackServerApp.getUser();
    const userTeam: Team[] = (await user?.listTeams()) ?? [];

    if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined) {
        throw new Error('Unauthorized');
    }

    // If not found, return a 404 page.
    if (!(await fsExists(path.join(process.cwd(), fromDrafts ? 'drafts' : 'raw_articles', `${(await params).filename}.md`)))) {
        return notFound();
    }

    // Temporary values - replace with actual data from your CMS/markdown frontmatter
    try {
        const fileContent = await getItem((await params).filename, fromDrafts);
        if (fileContent.content.startsWith('\n')) {
            fileContent.content = fileContent.content.substring(1, fileContent.content.length);
            // Remove the heading \n
        }

        return (
            <div className="flex-1 flex flex-col py-8 w-full">
                <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4">
                    <ArticleEditor initialMetadata={fileContent.fields} initialContent={fileContent.content} filename={(await params).filename} />
                </div>
            </div>
        );
    } catch (e) {
        console.log(e);
    }
}

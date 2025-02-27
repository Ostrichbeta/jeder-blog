'use server';

import { redirect } from 'next/navigation';
import ArticleEditor from '@/components/article-editor';
import { MDField } from '@/lib/article-check';
import { stackServerApp } from '@/stack';
import { Team } from '@stackframe/stack';

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const filename = (await searchParams).filename;

    const user = await stackServerApp.getUser();
    const userTeam: Team[] = (await user?.listTeams()) ?? [];

    if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined) {
        throw new Error('Unauthorized');
    }

    if (filename === undefined) {
        redirect('/articles');
    }

    const initialMetadata: MDField = {
        title: '',
        description: '',
        date: '',
        tags: new Set<string>(),
    };

    // Temporary values - replace with actual data from your CMS/markdown frontmatter
    try {
        return (
            <div className="flex-1 flex flex-col py-8 w-full">
                <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4">
                    <ArticleEditor initialMetadata={initialMetadata} initialContent={''} filename={filename.toString()} createMode={true} />
                </div>
            </div>
        );
    } catch (e) {
        console.log(e);
    }
}

import { ArticlesList } from '@/components/articles-list';

export default async function ArticlesPage() {
    return (
        <div className="flex-1 flex flex-col py-8 w-full">
            <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4">
                <ArticlesList />
            </div>
        </div>
    );
}

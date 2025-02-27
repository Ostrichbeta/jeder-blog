'use client';

import { Separator } from '@/components/ui/separator';
import { MDField } from '@/lib/article-check';
import { getArticleList, getTagsList } from '@/lib/article-io';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PaginationControl } from './pagination-control';
import { Badge } from './ui/badge';
import { TagsCloud } from './tags-cloud';
import { Archive, FilePlus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useUser } from '@stackframe/stack';

type ArticleItem = {
    filename: string;
    fields: MDField;
};

export function ArticlesList() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const showDrafts = searchParams.has('draft');

    const [articleList, setArticleList] = useState<ArticleItem[] | null>([]);
    const [displayArticleList, setDisplayArticleList] = useState<ArticleItem[] | null>([]);
    const [tagsRecord, setTagsRecord] = useState<Record<string, number> | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newFilename, setNewFilename] = useState('');
    const [error, setError] = useState('');

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const user = useUser();

    // Define the page and item
    const page = parseInt(searchParams.get('page') ?? '1') ?? 1;

    const maxItemChoices: number[] = [5, 10, 20];
    // Get validated max items per page
    const maxItemPerPage = maxItemChoices.includes(parseInt(searchParams.get('maxitem') ?? '')) ? parseInt(searchParams.get('maxitem')!) : maxItemChoices[0];

    const handleMaxItemChange = (value: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('maxitem', value);
        newSearchParams.set('page', '1'); // Reset to first page when changing page size
        router.replace(`${pathname}?${newSearchParams.toString()}`);
    };

    // Calculate total pages
    const totalItems = articleList?.length || 0;

    const handlePageChange = (newPage: number) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', Math.max(1, Math.min(newPage, Math.ceil(totalItems / maxItemPerPage))).toString());
        router.replace(`${pathname}?${newSearchParams.toString()}`);
    };

    const handleCreatePost = async () => {
        // Basic validation example - adapt to your actual validation requirements
        if (!newFilename) {
            setError('Filename cannot be empty');
            return;
        }

        if (/\s/.test(newFilename)) {
            setError('Filename cannot contain spaces');
            return;
        }

        if (!/^[a-z0-9-_]+$/.test(newFilename)) {
            setError('Only lowercase letters, numbers, and hyphens allowed');
            return;
        }

        // Check if file exists
        const fullArticleList = await getArticleList();
        const draftList = await getArticleList(undefined, true);

        if (fullArticleList.length > 0 && fullArticleList.find((item) => item.filename.toLowerCase() === `${newFilename.toLowerCase()}.md`) !== undefined) {
            setError('Article exists, try another name');
            return;
        }

        if (draftList.length > 0 && draftList.find((item) => item.filename.toLowerCase() === `${newFilename.toLowerCase()}.md`) !== undefined) {
            setError('Article exists in drafts, try another name');
            return;
        }

        // Clear error if validation passes
        setError('');
        setCreateDialogOpen(false);
        const newSearchParams = new URLSearchParams();
        newSearchParams.set('filename', newFilename);
        router.push(`/articles/create?${newSearchParams.toString()}`);
    };

    const handleShowDrafts = async () => {
        if (!showDrafts) {
            const newSearchParams = new URLSearchParams();
            newSearchParams.set('draft', '');
            router.replace(`${pathname}?${newSearchParams.toString()}`);
        } else {
            router.replace(pathname);
        }
    };

    useEffect(() => {
        async function fetchArticles() {
            try {
                if (user && (await user.listTeams()).find((item) => (item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) !== undefined)) {
                    setIsAdmin(true);
                }

                const articleListFetched = (await getArticleList(searchParams.has('tag') ? searchParams.get('tag')! : undefined, showDrafts)) as ArticleItem[];
                setArticleList(articleListFetched);
                setDisplayArticleList(articleListFetched.filter((_, index) => index >= (page - 1) * maxItemPerPage && index < page * maxItemPerPage));
                setTagsRecord(await getTagsList());
            } catch (e) {
                console.error(e);
            }
        }
        fetchArticles();
        // Actual filter implementation here
    }, [maxItemPerPage, page, searchParams, showDrafts, user]);

    return (
        <div className="px-none flex-grow flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 px-2">
                <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
                {isAdmin && (
                    <div className="flex space-x-2">
                        <Button variant={showDrafts ? 'default' : 'outline'} size="sm" onClick={handleShowDrafts}>
                            <Archive className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">{showDrafts ? 'Showing Drafts' : 'See Drafts'}</span>
                        </Button>

                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <FilePlus className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Create Post</span>
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Post</DialogTitle>
                                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 ">
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </DialogClose>
                                </DialogHeader>
                                <div className="py-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="filename" className="text-left">
                                            Filename
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="filename"
                                                value={newFilename}
                                                onChange={(e) => {
                                                    setNewFilename(e.target.value);
                                                    setError('');
                                                }}
                                                placeholder="new-post"
                                                className="flex-1"
                                            />
                                            <span className="text-sm">.md</span>
                                        </div>
                                        {error && <div className="text-destructive text-sm mt-1 px-2 py-1 bg-destructive/10 rounded">{error}</div>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleCreatePost}>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Article list */}
            {(displayArticleList ?? []).length > 0 && <div className="px-2">{tagsRecord && <TagsCloud tags={tagsRecord}></TagsCloud>}</div>}
            <div className="flex-grow flex flex-col min-h-full">
                {(displayArticleList ?? []).length > 0 ? (
                    (displayArticleList ?? []).map((article, index) => {
                        const date = new Date(article.fields.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        });

                        return (
                            <div key={article.filename} className="group">
                                <div
                                    className="py-4 rounded-lg transition-colors hover:bg-muted/50"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push(`/articles/${article.filename.substring(0, article.filename.length - 3)}?${showDrafts ? 'draft' : ''}`);
                                    }}
                                >
                                    <h3 className="text-xl font-semibold mb-1 px-2 truncate max-w-[95%]">{article.fields.title}</h3>
                                    <p className="text-muted-foreground px-2 truncate">{article.fields.description}</p>
                                    <time className="text-sm text-muted-foreground px-2 mt-2">
                                        {date}{' '}
                                        {[...article.fields.tags].map((item) => (
                                            <Badge className="ml-2" variant="secondary" key={item}>
                                                {item}
                                            </Badge>
                                        ))}
                                    </time>
                                </div>
                                {index !== (displayArticleList ?? []).length - 1 && <Separator />}
                            </div>
                        );
                    })
                ) : (
                    // No Articles Message
                    <div className="flex-grow flex flex-col items-center justify-center text-center pb-8">
                        <div className="space-y-4">
                            <div className="mx-auto bg-muted/50 rounded-full p-4 flex items-center justify-center w-fit">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-12 h-12 text-muted-foreground"
                                >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <path d="M14 2v6h6" />
                                    <path d="M9 15h6" />
                                    <path d="M9 18h6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight">No Articles Found</h2>
                            <p className="text-muted-foreground max-w-md">It looks like there are no articles to display right now. Check back later or try different filters.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination Control */}
            <PaginationControl
                totalItems={totalItems}
                currentPage={page}
                maxItemPerPage={maxItemPerPage}
                maxItemChoices={maxItemChoices}
                onPageChange={handlePageChange}
                onMaxItemChange={handleMaxItemChange}
            />
        </div>
    );
}

'use client';

import { MDField } from '@/lib/article-check';
import { useState } from 'react';
import { MetadataEditor } from '@/components/metadata-editor'; // Adjust import path
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Trash2, Save, UploadCloud } from 'lucide-react';

import dynamic from 'next/dynamic';
import '@uiw/react-textarea-code-editor/dist.css';
import { deleteArticle, saveArticle } from '@/lib/article-io';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';

const CodeEditor = dynamic(() => import('@uiw/react-textarea-code-editor').then((mod) => mod.default), { ssr: false });

function ActionDialog({
    trigger,
    title,
    description,
    confirmText,
    onConfirm,
    variant = 'default',
}: {
    trigger: React.ReactNode;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => Promise<void>;
    variant?: 'destructive' | 'default';
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className={variant === 'destructive' ? 'bg-destructive text-white hover:bg-destructive/90' : ''}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function ArticleEditor({ initialMetadata, initialContent, filename, createMode = false }: { initialMetadata: MDField; initialContent: string; filename: string; createMode?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const fromDrafts: boolean = searchParams.has('draft');

    const [metadata, setMetadata] = useState<MDField>(initialMetadata);
    const [content, setContent] = useState<string>(initialContent);
    const [ipBlockMode, setIPBlockMode] = useState<number>(() => {
        if (initialMetadata.geoBlock) {
            return 1;
        }

        if (initialMetadata.geoAllow) {
            return 2;
        }

        return 0;
    });
    const [regions, setRegions] = useState<Set<string>>(() => {
        if (initialMetadata.geoBlock) {
            return initialMetadata.geoBlock;
        }

        if (initialMetadata.geoAllow) {
            return initialMetadata.geoAllow;
        }

        return new Set<string>();
    });

    // Handle metadata updates from MetadataEditor
    const handleTitleChange = (newTitle: string) => {
        setMetadata((prev) => ({ ...prev, title: newTitle }));
    };

    const handleDescriptionChange = (newDescription: string) => {
        setMetadata((prev) => ({ ...prev, description: newDescription }));
    };

    const handleTagsChange = (newTags: string[]) => {
        setMetadata((prev) => ({ ...prev, tags: new Set<string>(newTags) }));
    };

    const handleIpBlockChange = (newValue: string) => {
        setIPBlockMode(parseInt(newValue));
    };

    const checkMetadata = (metadata: MDField) => {
        if (metadata.title == '') {
            return false;
        }

        if (metadata.description == '') {
            return false;
        }

        if (metadata.tags.size == 0) {
            return false;
        }

        if (metadata.geoAllow !== undefined && metadata.geoAllow.size == 0) {
            return false;
        }

        if (metadata.geoBlock !== undefined && metadata.geoBlock.size == 0) {
            return false;
        }

        return true;
    };

    const handleRegionsChange = (newValue: string[]) => {
        setRegions(new Set<string>(newValue));
    };

    const applyGEOBlock = (metadata: MDField): MDField => {
        switch (ipBlockMode) {
            case 1:
                return { ...metadata, geoBlock: regions, geoAllow: undefined };

            case 2:
                return { ...metadata, geoBlock: undefined, geoAllow: regions };

            default:
                return { ...metadata, geoAllow: undefined, geoBlock: undefined };
        }
    };

    return (
        <div className="space-y-4">
            <Toaster />
            <h1 className="text-4xl font-bold tracking-tight mb-6 px-2">Article Editor</h1>
            <MetadataEditor
                title={metadata.title}
                description={metadata.description}
                tags={[...metadata.tags]}
                ipBlock={ipBlockMode.toString()}
                regions={[...regions]}
                // Add this prop to your MetadataEditor component
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onTagsChange={handleTagsChange}
                onIpBlockChange={handleIpBlockChange}
                onRegionsChange={handleRegionsChange}
            />

            {/* Content Editor */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Content</h2>
                <CodeEditor
                    value={content}
                    language="markdown"
                    placeholder="Your blog here"
                    onChange={(e) => setContent(e.target.value)}
                    padding={15}
                    style={{
                        fontSize: 16,
                        backgroundColor: '#f5f5f5',
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                />
            </div>

            <div className="w-full mx-auto px-4 flex justify-end gap-2">
                {!createMode && (
                    <ActionDialog
                        title="Delete Article"
                        description="Are you sure you want to delete this article permanently?"
                        confirmText="Delete"
                        onConfirm={async () => {
                            await deleteArticle(filename, fromDrafts);
                            router.push(`/articles`);
                        }}
                        variant="destructive"
                        trigger={
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden md:inline">Delete</span>
                            </Button>
                        }
                    />
                )}

                <ActionDialog
                    title="Save to Drafts"
                    description="Save current changes to drafts without publishing?"
                    confirmText="Save Draft"
                    onConfirm={async () => {
                        if (!checkMetadata(metadata)) {
                            // Pop a error dialog here
                            toast.error('Metadata Structure not met', {
                                description: 'Please check the required metadata field and try again.',
                            });
                            return;
                        }

                        await saveArticle(filename, applyGEOBlock(metadata), content, true);
                        router.push(`/articles/${filename}?draft`);
                    }}
                    trigger={
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Save className="h-4 w-4" />
                            <span className="hidden md:inline">Save to Drafts</span>
                        </Button>
                    }
                />

                <ActionDialog
                    title="Publish Article"
                    description="Make this article public and visible to all readers?"
                    confirmText="Publish"
                    onConfirm={async () => {
                        console.log(metadata);
                        if (!checkMetadata(metadata)) {
                            console.log(metadata);
                            // Pop a error dialog here
                            toast.error('Metadata Structure not met', {
                                description: 'Please check the required metadata field and try again.',
                            });
                            return;
                        }

                        await saveArticle(filename, applyGEOBlock(metadata), content);
                        router.push(`/articles/${filename}`);
                    }}
                    trigger={
                        <Button variant="ghost" size="sm" className="gap-2">
                            <UploadCloud className="h-4 w-4" />
                            <span className="hidden md:inline">Publish</span>
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

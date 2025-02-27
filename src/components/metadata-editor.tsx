'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TagsInput } from './tags-input';
import { IpBlockSelect } from './ip-block-radio';

export function MetadataEditor({
    title,
    description,
    tags,
    ipBlock,
    regions,
    onTitleChange,
    onDescriptionChange,
    onTagsChange,
    onIpBlockChange,
    onRegionsChange,
}: {
    title: string;
    description: string;
    tags: string[];
    ipBlock: string;
    regions: string[];
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onTagsChange: (tags: string[]) => void;
    onIpBlockChange: (value: string) => void;
    onRegionsChange: (value: string[]) => void;
}) {
    return (
        <div className="w-full space-y-2">
            <div className="flex flex-col md:flex-row md:gap-4 space-y-2">
                <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => onTitleChange(e.target.value)} className="w-full text-md" placeholder="Article title" />
                </div>

                <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={description} onChange={(e) => onDescriptionChange(e.target.value)} className="w-full text-md" placeholder="Article description" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Tags</Label>
                <TagsInput initialTags={tags} onTagsChange={onTagsChange} />
            </div>

            <div className="flex flex-col md:flex-row md:gap-4 space-y-2">
                <div className="w-full md:w-1/2 space-y-2 md:pr-2">
                    <Label>IP Restrictions</Label>
                    <IpBlockSelect value={ipBlock} onChange={onIpBlockChange} />
                </div>
            </div>

            {ipBlock !== '0' && (
                <div className="space-y-2">
                    <Label>{['?', 'Blocked Regions', 'Allowed Regions'][parseInt(ipBlock) ?? 0]}</Label>
                    <TagsInput initialTags={regions} onTagsChange={onRegionsChange} />
                </div>
            )}
        </div>
    );
}

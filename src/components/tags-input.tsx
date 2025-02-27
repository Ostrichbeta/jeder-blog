'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export function TagsInput({ initialTags, onTagsChange }: { initialTags: string[]; onTagsChange: (tags: string[]) => void }) {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<string[]>(initialTags);

    const handleAddTag = () => {
        if (inputValue.trim() && !tags.includes(inputValue.trim())) {
            const newTags = [...tags, inputValue.trim()];
            setTags(newTags);
            onTagsChange(newTags);
            setInputValue('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        onTagsChange(newTags);
    };

    return (
        <div className="space-y-2 w-full">
            <div className="flex gap-2 w-full">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 h-9 text-md" // Adjusted for height matching
                />
                <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="secondary"
                    className="h-9 px-4" // Explicit height matching
                >
                    Add Tag
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1 px-3 py-1 text-sm bg-muted rounded-full">
                        <span>{tag}</span>
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted-foreground/10 p-1">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

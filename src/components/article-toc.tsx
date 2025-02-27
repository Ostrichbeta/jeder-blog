'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ArticleTOC({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

    // Find the minimum heading level to use as base indentation
    const minLevel = useMemo(() => {
        if (headings.length === 0) return 0;
        return Math.min(...headings.map((h) => h.level));
    }, [headings]);

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(children?.toString() || '', 'text/html');
        const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

        const parsedHeadings = headingElements.map((heading) => ({
            id: heading.id,
            text: heading.textContent || '',
            level: parseInt(heading.tagName.substring(1)), // Extract number from H tag (e.g., 2 from H2) to check the highest indentation
        }));

        setHeadings(parsedHeadings);
    }, [children]);

    return (
        <Card className="top-20 p-4 mb-8 ml-8 w-80 max-h-[80vh] overflow-y-auto">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Table of Contents</h3>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2">
                    <nav className="space-y-2">
                        {headings.map((heading) => {
                            const indentLevel = heading.level - minLevel;
                            return (
                                <a
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    className="block text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors truncate"
                                    style={{
                                        marginLeft: `${indentLevel * 20}px`, // 20px per indent level
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(heading.id)?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                    }}
                                >
                                    {heading.text}
                                </a>
                            );
                        })}
                    </nav>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
